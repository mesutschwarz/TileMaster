import { Tile } from '../types/tile'

/**
 * Heuristic to detect if a file content looks like GBDK C source or Header
 */
export const isCFile = (filename: string): boolean => {
    return filename.endsWith('.c') || filename.endsWith('.h')
}

/**
 * Parses a C/H file to find tile arrays.
 * It looks for arrays defined as `const unsigned char ... [] = { ... }`
 * It attempts to parse the hex values and convert them to Tile objects.
 *
 * Supports GBDK 2bpp planar (GB/GBC/Mega Duck) and 4bpp planar (SMS/GG) data.
 */
export const importCode = (content: string, width: number, height: number, encoding: '2bpp' | '4bpp' = '2bpp'): Tile[] => {
    const tiles: Tile[] = []

    // Regex to find arrays: const unsigned char NAME[] = { DATA };
    // Matches "const unsigned char", optional "BANK(n)", name, "[]", "=", "{", data, "}"
    const arrayRegex = /const\s+unsigned\s+char\s+(?:BANK\(\d+\)\s+)?([a-zA-Z0-9_]+)\[\]\s*=\s*{([^}]+)}/g

    const bitsPerPixel = encoding === '4bpp' ? 4 : 2
    const bytesPerTile = (width * height * bitsPerPixel) / 8

    let match
    while ((match = arrayRegex.exec(content)) !== null) {
        const name = match[1]
        const dataStr = match[2]

        // Clean comments and whitespace
        const cleanData = dataStr.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')

        // Parse hex values
        const bytes = cleanData
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .map(s => {
                if (s.startsWith('0x') || s.startsWith('0X')) return parseInt(s, 16)
                return parseInt(s, 10)
            })
            .filter(n => !isNaN(n))

        if (bytes.length === 0) continue

        // Skip map arrays — only import tile data
        if (name.includes('_map_')) continue

        for (let i = 0; i < bytes.length; i += bytesPerTile) {
            const tileBytes = bytes.slice(i, i + bytesPerTile)
            if (tileBytes.length < bytesPerTile) break // Incomplete tile

            const tileId = `tile-code-${name}-${tiles.length}`
            const tileData = encoding === '4bpp'
                ? decodeGbdk4bpp(tileBytes)
                : decodeGbdk2bpp(tileBytes)

            tiles.push({
                id: tileId,
                data: tileData,
                width: width,
                height: height
            })
        }
    }

    return tiles
}

/**
 * Decodes GBDK 2bpp planar format back to color indices (0-3)
 * 16 bytes -> 64 pixels (8x8)
 */
const decodeGbdk2bpp = (bytes: number[]): number[] => {
    const pixels = new Array(64).fill(0)

    for (let row = 0; row < 8; row++) {
        const lowByte = bytes[row * 2]
        const highByte = bytes[row * 2 + 1]

        for (let col = 0; col < 8; col++) {
            // Bit 7 is leftmost pixel
            const bit = 7 - col
            const lowBit = (lowByte >> bit) & 1
            const highBit = (highByte >> bit) & 1
            const color = (highBit << 1) | lowBit

            pixels[row * 8 + col] = color
        }
    }

    return pixels
}

/**
 * Decodes GBDK 4bpp planar format back to color indices (0-15)
 * 32 bytes -> 64 pixels (8x8)
 * Byte layout: rows of 4 bytes (bitplane0-low, bitplane1-low, bitplane2-low, bitplane3-low)
 * SMS/GG format: each row = 4 bytes interleaved
 */
const decodeGbdk4bpp = (bytes: number[]): number[] => {
    const pixels = new Array(64).fill(0)

    for (let row = 0; row < 8; row++) {
        const b0 = bytes[row * 4]
        const b1 = bytes[row * 4 + 1]
        const b2 = bytes[row * 4 + 2]
        const b3 = bytes[row * 4 + 3]

        for (let col = 0; col < 8; col++) {
            const bit = 7 - col
            const v = ((b0 >> bit) & 1)
                | (((b1 >> bit) & 1) << 1)
                | (((b2 >> bit) & 1) << 2)
                | (((b3 >> bit) & 1) << 3)
            pixels[row * 8 + col] = v
        }
    }

    return pixels
}
