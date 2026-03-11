# Platform System — GBDK-2020 Reference

TileMaster targets **GBDK-2020** as its primary export backend. Every supported platform corresponds to a real GBDK-2020 build target (`lcc -msm8 …`, `lcc -mgb …`, etc.) and the hardware constraints enforced throughout the app come directly from each console's technical specifications.

## Supported Platforms

| ID | Name | GBDK Target | Encoding | BPP | Tile Size | Screen (tiles) | VRAM Map | Max BG Tiles | Colors/Palette |
|---|---|---|---|---|---|---|---|---|---|
| `gb` | Game Boy (DMG) | `gb` | 2bpp planar | 2 | 8×8 | 20×18 | 32×32 | 256 | 4 |
| `gbc` | Game Boy Color | `gb` | 2bpp planar | 2 | 8×8 | 20×18 | 32×32 | 512 (2 VRAM banks) | 4 |
| `megaduck` | Mega Duck | `duck` | 2bpp planar | 2 | 8×8 | 20×18 | 32×32 | 256 | 4 |
| `sms` | Sega Master System | `sms` | 4bpp planar | 4 | 8×8 | 32×24 | 32×28 | 448 | 16 |
| `gg` | Game Gear | `gg` | 4bpp planar | 4 | 8×8 | 20×18 | 32×28 | 448 | 16 |

### Platform Details

#### Game Boy (DMG)
- **Resolution:** 160×144 px
- **Palettes:** 1 BG, 2 sprite (each 4 shades of grey)
- **Sprites:** 40 total, 10 per scanline, sizes 8×8 or 8×16
- **ROM banks:** up to 256

#### Game Boy Color
- Identical screen/tile geometry to DMG but adds:
  - 2 VRAM banks → 512 BG tiles
  - 8 BG palettes + 8 sprite palettes (4 colors each, true RGB555)
  - ROM banks up to 512

#### Mega Duck / Cougar Boy
- GB-compatible hardware with a different cartridge pinout.
- GBDK targets it as `duck`; tile encoding identical to GB (`2bpp`).

#### Sega Master System
- **Resolution:** 256×192 px (32×24 tiles)
- **VRAM map:** 32×28 (nametable, top/bottom rows reserved by hardware)
- **VRAM tiles:** 448 BG + 256 sprite
- **Palettes:** 1 BG + 1 sprite, each 16 colors from a 64-color master palette
- **Sprites:** 64 total, 8 per scanline, sizes 8×8 or 8×16
- **ROM banks:** up to 64

#### Game Gear
- SMS-compatible VDP with a smaller visible window (160×144, same as GB).
- 4096-color master palette (12-bit RGB vs 6-bit on SMS).
- Otherwise shares SMS tile format, VRAM layout, and sprite limits.

---

## Architecture

### Type Definitions — `src/types/platform.ts`

`PlatformId` is a string union of the five supported IDs.

`PlatformSpec` is the single source of truth for every hardware parameter:

| Field | Purpose |
|---|---|
| `gbdkTarget` | Value passed to GBDK's `-m` flag |
| `encoding` | `'2bpp'` or `'4bpp'` — drives both export and import |
| `bytesPerTile` | `(tileW × tileH × bitDepth) / 8` |
| `maxBgTiles` / `maxSpriteTiles` / `maxTiles` | VRAM tile budget |
| `vramBanks` | Number of tile VRAM banks (1 or 2) |
| `screenTilesX/Y` | Visible screen area in tiles |
| `mapWidth/Height` | Hardware VRAM nametable dimensions |
| `colorsPerPalette` | 4 (2bpp) or 16 (4bpp) |
| `palettes.bg` / `palettes.sprite` | Number of available palettes |
| `maxSpritesPerLine` / `maxSpritesTotal` | OAM constraints |
| `spriteSizes` | Allowed sprite dimensions |
| `maxRomBanks` | MBC / mapper upper limit |

### Platform Registry — `src/core/platforms/index.ts`

`PLATFORMS` is a `Record<PlatformId, PlatformSpec>` that holds every platform's complete spec. The UI reads this registry to populate the platform selector dropdown. Changing platforms updates the active `PlatformSpec` globally via the project store.

### Persistence — `src/stores/projectStore.ts`

The selected `PlatformId` is saved to `localStorage` under the key `tilemaster-platform` whenever the user changes it. On startup the store reads that key and falls back to `'gb'` if the stored value is missing or invalid.

---

## Constraint Engine — `src/core/validation/ConstraintEngine.ts`

`validateProject(platform, tileset, maps)` returns an array of `ValidationIssue` objects (severity `error` or `warning`). The checks are:

| Check | Severity | Condition |
|---|---|---|
| Tileset exceeds `maxTiles` | error | `tileset.tiles.length > platform.maxTiles` |
| Tileset >90% full | warning | tiles in 90-100% range |
| Tile wrong dimensions | error | tile `width/height` ≠ platform tile size |
| Too many unique colors in a tile | error | `Set(tile.data).size > 2^bitDepth` |
| Color index out of palette range | error | any pixel index < 0 or > `colorsPerPalette - 1` |
| Map exceeds VRAM nametable | warning | map dimensions > `mapWidth/mapHeight` |
| Map larger than screen | warning | requires scrolling |
| Dangling tile reference | error | a map layer cell references a tile index outside the tileset |

Validation runs on every project change and the results are surfaced in the **Status Bar** health indicator.

---

## Export System — `src/exporters/gbdk/GbdkExporter.ts`

### Tile Encoding

Two converters handle the two encoding families:

- **`tileTo2bpp(tile)`** — 8×8 → 16 bytes (GB / GBC / Mega Duck)
- **`tileTo4bpp(tile)`** — 8×8 → 32 bytes (SMS / Game Gear)

`tileToBinary(tile, platform)` dispatches automatically based on `platform.encoding`.

### Export Functions

| Function | Output |
|---|---|
| `generateGbdkC(platform, tileset, map, options)` | `.c` file with tile data array + optional map arrays |
| `generateGbdkH(platform, tileset, map, options)` | `.h` header with defines and externs |
| `generateGbdkBin(platform, tileset)` | Raw binary blob of all tile data |

The `.h` header includes useful defines:
```c
#define project_PLATFORM_TARGET "sms"
#define project_TILE_W 8
#define project_TILE_H 8
#define project_BYTES_PER_TILE 32
#define project_tiles_TILE_COUNT 42
#define project_tiles_SIZE 1344
```

---

## Import System

### Code Import — `src/importers/codeImporter.ts`

`importCode(content, width, height, encoding)` parses GBDK C source files, extracts `const unsigned char name[] = { … }` arrays, and decodes tiles using:

- **`decodeGbdk2bpp(bytes)`** — 16 bytes → 64 color indices (0-3)
- **`decodeGbdk4bpp(bytes)`** — 32 bytes → 64 color indices (0-15)

The `encoding` parameter defaults to `'2bpp'`; the Header component passes the active platform's encoding automatically.

### PNG Import — `src/importers/pngImporter.ts`

`importPng(file, platform, options)` slices an image into tiles, quantises pixels to the platform's `defaultPalette`, and optionally applies Floyd-Steinberg dithering. It produces both a tile array and a map layout, with duplicate tiles automatically de-duplicated.

---

## How Limits Are Enforced

1. **Tile count** — The constraint engine fires an error when tiles exceed `maxTiles`. The Tiles Explorer sidebar shows usage vs. limit.
2. **Color depth** — Each pixel index is clamped to the platform's bit depth during export. The constraint engine warns about out-of-range indices.
3. **Map size** — New maps default to `screenTilesX × screenTilesY`. The constraint engine warns if a map exceeds hardware VRAM map dimensions.
4. **Palette range** — Pixels outside `0 … colorsPerPalette - 1` are flagged as errors.

---

## Adding a New Platform

1. Add the new ID to the `PlatformId` union in `src/types/platform.ts`.
2. Add a complete `PlatformSpec` entry in `src/core/platforms/index.ts`.
3. If the platform uses a new encoding (not 2bpp or 4bpp), add encoder/decoder functions in `GbdkExporter.ts` and `codeImporter.ts`, and extend the `encoding` union type.
4. The platform will automatically appear in the Header dropdown, constraint validation, and export pipeline — no other changes needed.
