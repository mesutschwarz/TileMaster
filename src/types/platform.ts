export type PlatformId = 'gb' | 'gbc' | 'megaduck' | 'nes' | 'sms' | 'gg'

export interface PaletteSpec {
    id: string
    name: string
    colors: string[] // HEX colors
    maxColors: number
}

export interface PlatformSpec {
    id: PlatformId
    name: string

    /** GBDK-2020 target identifier used in build commands (e.g. "gb", "sms") */
    gbdkTarget: string

    // Tile properties
    tileWidth: number
    tileHeight: number
    /** Bits per pixel (2 = 4 colors, 4 = 16 colors) */
    bitDepth: number
    /** Bytes per tile: (tileWidth * tileHeight * bitDepth) / 8 */
    bytesPerTile: number
    /** Tile encoding format for GBDK export */
    encoding: '2bpp' | '4bpp'

    // VRAM limits
    /** Maximum number of background tiles in VRAM */
    maxBgTiles: number
    /** Maximum number of sprite tiles in VRAM */
    maxSpriteTiles: number
    /** Combined tile limit shown to user (typically maxBgTiles) */
    maxTiles: number
    /** Number of VRAM tile banks (GB=1, GBC=2) */
    vramBanks: number

    // Screen dimensions (visible area in tiles)
    screenTilesX: number
    screenTilesY: number
    /** Screen resolution in pixels */
    screenWidth: number
    screenHeight: number

    // Background map dimensions (hardware map buffer in VRAM)
    mapWidth: number
    mapHeight: number
    /** Maximum number of background map layers the hardware supports */
    maxBgLayers: number

    // Palette system
    colorsPerPalette: number
    defaultPalette: string[]
    palettes: {
        bg: number
        sprite: number
    }

    // Sprite limits
    maxSpritesPerLine: number
    maxSpritesTotal: number
    spriteSizes: string[] // e.g. ["8x8", "8x16"]

    // GBDK ROM banking
    maxRomBanks: number

    /** Brief platform description for UI tooltips */
    description: string
}

export type PlatformRegistry = Record<PlatformId, PlatformSpec>
