import { PlatformSpec } from '../../types/platform'
import { Tileset } from '../../types/tile'
import { TileMap } from '../../types/map'

export interface ValidationIssue {
    id: string
    type: 'tile' | 'map' | 'project'
    severity: 'error' | 'warning'
    message: string
    targetId?: string // ID of the tile or map
}

export const validateProject = (
    platform: PlatformSpec,
    tileset: Tileset,
    maps: TileMap[]
): ValidationIssue[] => {
    const issues: ValidationIssue[] = []
    const maxColors = Math.pow(2, platform.bitDepth)

    // 1. Tileset Size vs VRAM limit
    if (tileset.tiles.length > platform.maxTiles) {
        issues.push({
            id: 'tileset-size',
            type: 'project',
            severity: 'error',
            message: `Tileset exceeds ${platform.name} VRAM limit (${tileset.tiles.length}/${platform.maxTiles} tiles).`
        })
    } else if (tileset.tiles.length > platform.maxTiles * 0.9) {
        issues.push({
            id: 'tileset-size-warning',
            type: 'project',
            severity: 'warning',
            message: `Tileset is almost full (${tileset.tiles.length}/${platform.maxTiles} tiles).`
        })
    }

    // 2. Individual Tile Validation
    tileset.tiles.forEach(tile => {
        if (tile.width !== platform.tileWidth || tile.height !== platform.tileHeight) {
            issues.push({
                id: `tile-dim-${tile.id}`,
                type: 'tile',
                severity: 'error',
                message: `Tile has incorrect dimensions (${tile.width}x${tile.height}, expected ${platform.tileWidth}x${platform.tileHeight}).`,
                targetId: tile.id
            })
        }

        const uniqueColors = new Set(tile.data).size
        if (uniqueColors > maxColors) {
            issues.push({
                id: `tile-colors-${tile.id}`,
                type: 'tile',
                severity: 'error',
                message: `Tile uses ${uniqueColors} colors (max ${maxColors} for ${platform.encoding}).`,
                targetId: tile.id
            })
        }

        // Check for out-of-range color indices
        const maxIdx = platform.colorsPerPalette - 1
        const outOfRange = tile.data.some(idx => idx < 0 || idx > maxIdx)
        if (outOfRange) {
            issues.push({
                id: `tile-palette-${tile.id}`,
                type: 'tile',
                severity: 'error',
                message: `Tile contains color indices outside palette range (0-${maxIdx}).`,
                targetId: tile.id
            })
        }
    })

    // 3. Map Validation
    maps.forEach(map => {
        // Hard limit: map cannot exceed VRAM background map dimensions
        if (map.width > platform.mapWidth || map.height > platform.mapHeight) {
            issues.push({
                id: `map-vram-${map.id}`,
                type: 'map',
                severity: 'warning',
                message: `Map "${map.name}" (${map.width}x${map.height}) exceeds ${platform.name} VRAM map size (${platform.mapWidth}x${platform.mapHeight}).`,
                targetId: map.id
            })
        }

        // Info: map exceeds visible screen area
        if (map.width > platform.screenTilesX || map.height > platform.screenTilesY) {
            issues.push({
                id: `map-screen-${map.id}`,
                type: 'map',
                severity: 'warning',
                message: `Map "${map.name}" is larger than the visible screen (${platform.screenTilesX}x${platform.screenTilesY} tiles). Scrolling required.`,
                targetId: map.id
            })
        }

        // Validate tile layer references
        map.layers.forEach(layer => {
            if (layer.type === 'tile') {
                const outOfBounds = layer.data.some(idx => idx >= tileset.tiles.length && idx !== -1)
                if (outOfBounds) {
                    issues.push({
                        id: `map-ref-${map.id}-${layer.id}`,
                        type: 'map',
                        severity: 'error',
                        message: `Map "${map.name}" layer "${layer.name}" references tiles not in the tileset.`,
                        targetId: map.id
                    })
                }
            }
        })
    })

    return issues
}
