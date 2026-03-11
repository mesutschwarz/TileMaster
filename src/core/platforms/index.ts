import { PlatformRegistry } from '../../types/platform'

/**
 * GBDK-2020 Compatible Platform Registry
 *
 * All values are based on real hardware specifications and GBDK-2020 constraints.
 * GBDK-2020 supports: Game Boy (DMG), Game Boy Color, Mega Duck, NES,
 * Sega Master System, and Game Gear.
 *
 * References:
 * - GBDK-2020 docs: https://gbdk-2020.github.io/gbdk-2020/docs/api/
 * - Pan Docs (GB/GBC): https://gbdev.io/pandocs/
 * - SMS Power (SMS/GG): https://www.smspower.org/Development/
 */
export const PLATFORMS: PlatformRegistry = {
    gb: {
        id: 'gb',
        name: 'Game Boy',
        gbdkTarget: 'gb',
        description: 'Nintendo Game Boy (DMG). 4 shades of grey, 8x8 tiles, 2bpp planar encoding.',

        tileWidth: 8,
        tileHeight: 8,
        bitDepth: 2,
        bytesPerTile: 16,
        encoding: '2bpp',

        maxBgTiles: 256,
        maxSpriteTiles: 256,
        maxTiles: 256,
        vramBanks: 1,

        screenTilesX: 20,
        screenTilesY: 18,
        screenWidth: 160,
        screenHeight: 144,

        mapWidth: 32,
        mapHeight: 32,
        maxBgLayers: 1,

        colorsPerPalette: 4,
        defaultPalette: ['#e0f8d0', '#88c070', '#346856', '#081820'],
        palettes: {
            bg: 1,
            sprite: 2
        },

        maxSpritesPerLine: 10,
        maxSpritesTotal: 40,
        spriteSizes: ['8x8', '8x16'],

        maxRomBanks: 256,
    },
    gbc: {
        id: 'gbc',
        name: 'Game Boy Color',
        gbdkTarget: 'gb',
        description: 'Nintendo Game Boy Color. Full color with 8 BG palettes of 4 colors each, 2 VRAM banks.',

        tileWidth: 8,
        tileHeight: 8,
        bitDepth: 2,
        bytesPerTile: 16,
        encoding: '2bpp',

        maxBgTiles: 512,
        maxSpriteTiles: 512,
        maxTiles: 512,
        vramBanks: 2,

        screenTilesX: 20,
        screenTilesY: 18,
        screenWidth: 160,
        screenHeight: 144,

        mapWidth: 32,
        mapHeight: 32,
        maxBgLayers: 1,

        colorsPerPalette: 4,
        defaultPalette: ['#e0f8d0', '#88c070', '#346856', '#081820'],
        palettes: {
            bg: 8,
            sprite: 8
        },

        maxSpritesPerLine: 10,
        maxSpritesTotal: 40,
        spriteSizes: ['8x8', '8x16'],

        maxRomBanks: 512,
    },
    megaduck: {
        id: 'megaduck',
        name: 'Mega Duck',
        gbdkTarget: 'duck',
        description: 'Mega Duck / Cougar Boy. GB-compatible hardware with different cartridge pinout.',

        tileWidth: 8,
        tileHeight: 8,
        bitDepth: 2,
        bytesPerTile: 16,
        encoding: '2bpp',

        maxBgTiles: 256,
        maxSpriteTiles: 256,
        maxTiles: 256,
        vramBanks: 1,

        screenTilesX: 20,
        screenTilesY: 18,
        screenWidth: 160,
        screenHeight: 144,

        mapWidth: 32,
        mapHeight: 32,
        maxBgLayers: 1,

        colorsPerPalette: 4,
        defaultPalette: ['#e0f8d0', '#88c070', '#346856', '#081820'],
        palettes: {
            bg: 1,
            sprite: 2
        },

        maxSpritesPerLine: 10,
        maxSpritesTotal: 40,
        spriteSizes: ['8x8', '8x16'],

        maxRomBanks: 256,
    },
    nes: {
        id: 'nes',
        name: 'NES / Famicom',
        gbdkTarget: 'nes',
        description: 'Nintendo Entertainment System / Famicom. 2bpp CHR tiles, 4 BG palettes of 4 colors from 64-color master palette.',

        tileWidth: 8,
        tileHeight: 8,
        bitDepth: 2,
        bytesPerTile: 16,
        encoding: '2bpp',

        maxBgTiles: 256,
        maxSpriteTiles: 256,
        maxTiles: 256,
        vramBanks: 1,

        screenTilesX: 32,
        screenTilesY: 30,
        screenWidth: 256,
        screenHeight: 240,

        mapWidth: 32,
        mapHeight: 30,
        maxBgLayers: 1,

        colorsPerPalette: 4,
        defaultPalette: ['#626262', '#898989', '#b4b4b4', '#ffffff'],
        palettes: {
            bg: 4,
            sprite: 4
        },

        maxSpritesPerLine: 8,
        maxSpritesTotal: 64,
        spriteSizes: ['8x8', '8x16'],

        maxRomBanks: 256,
    },
    sms: {
        id: 'sms',
        name: 'Sega Master System',
        gbdkTarget: 'sms',
        description: 'Sega Master System. 4bpp tiles, up to 16 colors per palette from 64-color master palette.',

        tileWidth: 8,
        tileHeight: 8,
        bitDepth: 4,
        bytesPerTile: 32,
        encoding: '4bpp',

        maxBgTiles: 448,
        maxSpriteTiles: 256,
        maxTiles: 448,
        vramBanks: 1,

        screenTilesX: 32,
        screenTilesY: 24,
        screenWidth: 256,
        screenHeight: 192,

        mapWidth: 32,
        mapHeight: 28,
        maxBgLayers: 1,

        colorsPerPalette: 16,
        defaultPalette: [
            '#000000', '#0000aa', '#00aa00', '#00aaaa',
            '#aa0000', '#aa00aa', '#aa5500', '#aaaaaa',
            '#555555', '#5555ff', '#55ff55', '#55ffff',
            '#ff5555', '#ff55ff', '#ffff55', '#ffffff'
        ],
        palettes: {
            bg: 1,
            sprite: 1
        },

        maxSpritesPerLine: 8,
        maxSpritesTotal: 64,
        spriteSizes: ['8x8', '8x16'],

        maxRomBanks: 64,
    },
    gg: {
        id: 'gg',
        name: 'Game Gear',
        gbdkTarget: 'gg',
        description: 'Sega Game Gear. SMS-compatible with smaller visible area (160x144) and 4096-color master palette.',

        tileWidth: 8,
        tileHeight: 8,
        bitDepth: 4,
        bytesPerTile: 32,
        encoding: '4bpp',

        maxBgTiles: 448,
        maxSpriteTiles: 256,
        maxTiles: 448,
        vramBanks: 1,

        screenTilesX: 20,
        screenTilesY: 18,
        screenWidth: 160,
        screenHeight: 144,

        mapWidth: 32,
        mapHeight: 28,
        maxBgLayers: 1,

        colorsPerPalette: 16,
        defaultPalette: [
            '#000000', '#0000aa', '#00aa00', '#00aaaa',
            '#aa0000', '#aa00aa', '#aa5500', '#aaaaaa',
            '#555555', '#5555ff', '#55ff55', '#55ffff',
            '#ff5555', '#ff55ff', '#ffff55', '#ffffff'
        ],
        palettes: {
            bg: 1,
            sprite: 1
        },

        maxSpritesPerLine: 8,
        maxSpritesTotal: 64,
        spriteSizes: ['8x8', '8x16'],

        maxRomBanks: 64,
    }
}
