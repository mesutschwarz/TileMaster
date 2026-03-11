import React from 'react'
import { Info, AlertTriangle, AlertCircle, Cpu, CheckCircle2, ShieldCheck, ShieldAlert } from 'lucide-react'
import { useProjectStore } from '../../stores/projectStore'
import { validateProject } from '../../core/validation/ConstraintEngine'
import { clsx } from 'clsx'

export const StatusBar: React.FC = () => {
    const { platform, tileset, maps, lastHistoryLabel, historyIndex, history } = useProjectStore()
    const issues = React.useMemo(() => validateProject(platform, tileset, maps), [platform, tileset, maps])
    const [showHealth, setShowHealth] = React.useState(false)
    const healthRef = React.useRef<HTMLDivElement>(null)

    const errors = issues.filter(i => i.severity === 'error')
    const warnings = issues.filter(i => i.severity === 'warning')

    React.useEffect(() => {
        if (!showHealth) return
        const handleClickOutside = (e: MouseEvent) => {
            if (healthRef.current && !healthRef.current.contains(e.target as Node)) {
                setShowHealth(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showHealth])

    return (
        <footer className="status-bar glass-panel rounded-3xl flex items-center justify-between px-6 select-none shrink-0 border-transparent shadow-lg py-1 relative z-20">
            <div className="flex items-center gap-4 h-full">
                <div className="flex items-center gap-1.5 h-full px-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
                    <Cpu size={12} className="text-gray-400" />
                    <span className="font-bold text-gray-200">{platform.name}</span>
                </div>

                {/* Platform Health indicator — click to expand details */}
                <div className="relative" ref={healthRef}>
                    <button
                        onClick={() => setShowHealth(!showHealth)}
                        className={clsx(
                            "flex items-center gap-3 h-full px-2 py-1 rounded-lg transition-colors",
                            showHealth ? "bg-white/10" : "hover:bg-white/10"
                        )}
                    >
                        {errors.length > 0 ? (
                            <ShieldAlert size={12} className="text-red-400" />
                        ) : warnings.length > 0 ? (
                            <AlertTriangle size={12} className="text-yellow-400" />
                        ) : (
                            <ShieldCheck size={12} className="text-green-400" />
                        )}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <AlertCircle size={10} className={errors.length > 0 ? "text-red-400" : "opacity-40"} />
                                <span className="text-gray-300 text-xs">{errors.length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <AlertTriangle size={10} className={warnings.length > 0 ? "text-yellow-400" : "opacity-40"} />
                                <span className="text-gray-300 text-xs">{warnings.length}</span>
                            </div>
                        </div>
                    </button>

                    {showHealth && (
                        <div className="absolute bottom-full left-0 mb-2 w-80 rounded-xl glass-panel border border-white/10 shadow-2xl overflow-hidden">
                            <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
                                {errors.length > 0 ? (
                                    <ShieldAlert size={14} className="text-red-400" />
                                ) : warnings.length > 0 ? (
                                    <AlertTriangle size={14} className="text-yellow-400" />
                                ) : (
                                    <ShieldCheck size={14} className="text-green-400" />
                                )}
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Platform Health</span>
                            </div>
                            <div className="px-4 py-3 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                {issues.length === 0 ? (
                                    <div className="text-[10px] text-gray-400 italic">All assets are within hardware constraints.</div>
                                ) : (
                                    issues.map((issue) => (
                                        <div key={issue.id} className="flex gap-2 items-start">
                                            {issue.severity === 'error' ? (
                                                <AlertCircle size={10} className="text-red-400 shrink-0 mt-0.5" />
                                            ) : (
                                                <AlertTriangle size={10} className="text-yellow-400 shrink-0 mt-0.5" />
                                            )}
                                            <span className={clsx(
                                                "text-[10px] leading-tight",
                                                issue.severity === 'error' ? "text-red-300" : "text-yellow-300"
                                            )}>
                                                {issue.message}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {errors.length === 0 && (
                    <div className="flex items-center gap-1 text-gray-300">
                        <CheckCircle2 size={12} />
                        <span>Valid</span>
                    </div>
                )}

                {lastHistoryLabel && (
                    <div className="flex items-center gap-1 text-gray-400">
                        <span className="uppercase tracking-[0.2em] text-[9px]">Last</span>
                        <span className="text-gray-300">{lastHistoryLabel}</span>
                    </div>
                )}

                <div className="flex items-center gap-1 text-gray-400">
                    <span className="uppercase tracking-[0.2em] text-[9px]">History</span>
                    <span className="text-gray-300">{Math.max(historyIndex + 1, 0)}/{history.length}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 h-full">
                <div className="px-2 h-full flex items-center hover:bg-white/10 cursor-pointer transition-colors text-gray-300">
                    Tiles: {tileset.tiles.length}/{platform.maxTiles}
                </div>
                <div className="px-2 h-full flex items-center hover:bg-white/10 cursor-pointer transition-colors text-gray-300">
                    Maps: {maps.length}
                </div>
                <div className="px-2 h-full flex items-center hover:bg-white/10 cursor-pointer transition-colors text-gray-300">
                    {platform.tileWidth}x{platform.tileHeight}
                </div>
            </div>
        </footer>
    )
}
