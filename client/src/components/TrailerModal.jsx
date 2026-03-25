import React, { useEffect } from 'react'
import { X } from 'lucide-react'

const getEmbedUrl = (url) => {
    if (!url) return null
    // Handle youtu.be short links
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`
    // Handle full youtube watch links
    const fullMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
    if (fullMatch) return `https://www.youtube.com/embed/${fullMatch[1]}?autoplay=1&rel=0`
    // Already an embed URL
    if (url.includes('youtube.com/embed/')) return url + '?autoplay=1&rel=0'
    return null
}

const TrailerModal = ({ trailerUrl, onClose }) => {
    const embedUrl = getEmbedUrl(trailerUrl)

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handleKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKey)
            document.body.style.overflow = 'auto'
        }
    }, [onClose])

    if (!embedUrl) return null

    return (
        <div
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl mx-4 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary">Close</span>
                    <div className="p-1.5 rounded-full bg-white/10 group-hover:bg-primary/20 transition-colors">
                        <X className="w-4 h-4" />
                    </div>
                </button>

                {/* Video Embed */}
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/60" style={{ paddingTop: '56.25%' }}>
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src={embedUrl}
                        title="Movie Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    )
}

export default TrailerModal
