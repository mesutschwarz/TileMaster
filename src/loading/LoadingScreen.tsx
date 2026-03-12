/**
 * LoadingScreen
 *
 * Full-screen startup splash rendered as a fixed overlay (z-index 9999).
 * It sits on top of the already-mounted App tree and fades away once the
 * progress simulation completes.
 *
 * ── Customisation ────────────────────────────────────────────────────
 *  • App name / tagline / version  →  src/app.config.ts
 *  • Logo SVG mark                 →  src/assets/AppLogo.tsx
 *  • Wordmark text component       →  src/assets/AppWordmark.tsx
 *  • Timing / stages               →  loading/useLoadingProgress.ts
 *  • Animations / CSS              →  loading/loading.css
 *  • Sizes / spacing below         →  constants in this file
 * ──────────────────────────────────────────────────────────────────── */

import React from 'react'
import { useLoadingProgress, getStageLabel } from './useLoadingProgress'
import { AppLogo } from '../assets/AppLogo'
import { AppWordmark } from '../assets/AppWordmark'
import { APP_TAGLINE, APP_VERSION } from '../app.config'
import './loading.css'

// ─── Layout constants (edit here to adjust sizes / spacing) ──────────
const LOGO_SIZE = 72   // px — width & height of the logo mark
const PROGRESS_WIDTH = 220  // px — width of the progress bar
const GAP = 36   // px — vertical gap between sections
// ─────────────────────────────────────────────────────────────────────

interface LoadingScreenProps {
    onComplete: () => void
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const { progress, isExiting } = useLoadingProgress({ onComplete })

    return (
        <div className={`ls-screen${isExiting ? ' ls-exiting' : ''}`}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: `${GAP}px`,
                    userSelect: 'none',
                }}
            >
                {/* ── Logo ────────────────────────────────── */}
                <div className={`ls-icon${isExiting ? '' : ' ls-floating'}`}>
                    <AppLogo size={LOGO_SIZE} label="TileMaster logo" className="ls-tile" />
                </div>

                {/* ── Wordmark & Subtitle ─────────────────── */}
                <div style={{ textAlign: 'center' }}>
                    <h1 className="ls-wordmark" style={{ margin: 0 }}>
                        <AppWordmark fontSize="28px" fontWeight={800} letterSpacing="-0.025em" />
                    </h1>

                    <p className="ls-subtitle" style={{
                        margin: '10px 0 0',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary)',
                    }}>
                        {APP_TAGLINE}
                    </p>
                </div>

                {/* ── Progress Bar ────────────────────────── */}
                <div className="ls-progress-wrap" style={{ width: `${PROGRESS_WIDTH}px` }}>
                    <div className="ls-progress-track">
                        <div
                            className="ls-progress-fill"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="ls-shimmer" />
                        </div>
                    </div>

                    {/* Status label */}
                    <p className="ls-status" style={{
                        margin: '9px 0 0',
                        fontSize: '10px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--text-disabled)',
                        textAlign: 'center',
                        fontWeight: 500,
                        height: '14px',
                        transition: 'opacity 0.2s ease',
                    }}>
                        {getStageLabel(progress)}
                    </p>
                </div>

                {/* ── Version badge ────────────────────────── */}
                <p style={{
                    position: 'absolute',
                    bottom: '24px',
                    margin: 0,
                    fontSize: '9px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--text-disabled)',
                    fontWeight: 500,
                    opacity: 0.6,
                }}>
                    v{APP_VERSION}
                </p>
            </div>
        </div>
    )
}
