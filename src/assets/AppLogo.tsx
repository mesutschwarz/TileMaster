/**
 * AppLogo.tsx — Reusable application logo mark.
 *
 * A 3 × 3 tilemap grid that visualises TileMaster's core concept.
 * Each rect is a "tile" with a distinct opacity, suggesting varied
 * tile types drawn from the current theme's accent palette.
 *
 * ── Customisation ─────────────────────────────────────────────────────
 *  • Tile layout / opacities  →  TILE_MAP constant below
 *  • Tile size / radius / gap →  TILE_SIZE, TILE_RADIUS, TILE_GAP
 *  • Colours                  →  CSS variables (accent-primary / accent-secondary)
 *  • Swap for an image asset  →  replace the SVG return with an <img> tag
 * ─────────────────────────────────────────────────────────────────────── */

import React from 'react'

// ─── Layout constants ─────────────────────────────────────────────────────────

const TILE_SIZE = 20   // px — rendered size of each individual tile
const TILE_RADIUS = 4    // px — border-radius of each tile
const TILE_GAP = 4    // px — gap between adjacent tiles
const STEP = TILE_SIZE + TILE_GAP   // 24 px stride between tile origins

// ─── Tile map ─────────────────────────────────────────────────────────────────
// One entry per tile, in row-major order (top-left → bottom-right).
// [opacity:number, useSecondaryAccent:boolean]

const TILE_MAP: [number, boolean][] = [
    [1.00, false], [0.55, false], [0.80, true],
    [0.40, false], [1.00, false], [0.50, false],
    [0.65, true], [0.30, false], [0.85, false],
]

// ─────────────────────────────────────────────────────────────────────────────

export interface AppLogoProps {
    /** Rendered width & height in px. The SVG scales uniformly. Default: 40 */
    size?: number
    /** Optional extra class names on the wrapping <svg>. */
    className?: string
    /** aria-label for the SVG. Defaults to hidden decorative mark. */
    label?: string
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 40, className, label }) => {
    const viewBox = STEP * 3 - TILE_GAP   // 68 × 68 intrinsic units

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${viewBox} ${viewBox}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label={label}
            aria-hidden={label ? undefined : true}
        >
            {TILE_MAP.map(([opacity, isSecondary], i) => {
                const col = i % 3
                const row = Math.floor(i / 3)
                return (
                    <rect
                        key={i}
                        x={col * STEP}
                        y={row * STEP}
                        width={TILE_SIZE}
                        height={TILE_SIZE}
                        rx={TILE_RADIUS}
                        opacity={opacity}
                        style={{
                            fill: isSecondary
                                ? 'var(--accent-secondary, #8b5cf6)'
                                : 'var(--accent-primary,   #ec4899)',
                        }}
                    />
                )
            })}
        </svg>
    )
}
