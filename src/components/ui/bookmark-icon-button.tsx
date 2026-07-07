/**
 * Animated bookmark toggle — adapted from 21st.dev (@shsfwork/bookmark-icon-button).
 *
 * Changes from the source component, to fit this codebase:
 * - Controlled: `saved` state lives in BookmarksProvider (the source kept its
 *   own local useState, which can't sync with the account/localStorage store).
 * - Design-system styling instead of the shadcn Button dependency (same 32px-
 *   family chrome hover, 6px radius) and our BookmarkIcon glyph instead of
 *   lucide-react (identical path).
 * - blue-500 → `--accent` token for the burst + particles; the resting filled
 *   state stays text-primary so the accent remains transient (accent is
 *   reserved for conversion CTAs in this design system).
 * - Burst/particles only fire on an actual save interaction — not when a page
 *   mounts with already-saved cards (the demo component never faced this).
 */
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookmarkIcon } from '../Icons'

interface BookmarkIconButtonProps {
  saved: boolean
  onToggle: () => void
  label: string
  /**
   * Must include a position class (`relative`, or `absolute` + offsets):
   * the burst/particle layers anchor to this button as their containing
   * block. The base classes intentionally carry no position to avoid
   * cascade conflicts with caller-supplied positioning.
   */
  className?: string
}

interface Particle {
  size: number
  scale: number
  x: number
  y: number
  duration: number
  delay: number
}

function makeParticles(): Particle[] {
  return Array.from({ length: 5 }, (_, i) => {
    const angle = (i / 5) * (2 * Math.PI)
    const radius = 18 + Math.random() * 8
    return {
      size: 4 + Math.random() * 2,
      scale: 0.8 + Math.random() * 0.4,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.75,
      duration: 0.6 + Math.random() * 0.1,
      delay: i * 0.04,
    }
  })
}

export function BookmarkIconButton({ saved, onToggle, label, className }: BookmarkIconButtonProps) {
  const [bursting, setBursting] = useState(false)
  const particles = useRef<Particle[]>([])
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleClick = () => {
    if (!saved) {
      particles.current = makeParticles()
      setBursting(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setBursting(false), 800)
    }
    onToggle()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label}
      className={`flex h-6 w-6 items-center justify-center rounded-[6px] transition-standard ${
        saved ? 'text-accent hover:text-accent-soft' : 'text-text-muted hover:text-text-primary'
      } ${className ?? 'relative'}`}
    >
      <motion.span
        initial={false}
        animate={{ scale: saved ? 1.1 : 1 }}
        whileTap={saved ? { scale: 1, rotate: 0 } : { scale: 0.85, rotate: -10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="relative flex items-center justify-center"
      >
        <BookmarkIcon size={15} className="opacity-60" />

        <span
          className="absolute inset-0 flex items-center justify-center transition-standard"
          style={{ opacity: saved ? 1 : 0 }}
        >
          <BookmarkIcon size={15} filled />
        </span>

        <AnimatePresence>
          {saved && bursting && (
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent) 0%, transparent 80%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 1], opacity: [0, 0.4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </motion.span>

      <AnimatePresence>
        {saved && bursting && (
          <motion.span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {particles.current.map((p, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-accent"
                style={{ width: p.size, height: p.size, filter: 'blur(1px)' }}
                initial={{ scale: 0, opacity: 0.3, x: 0, y: 0 }}
                animate={{
                  scale: [0, p.scale, 0],
                  opacity: [0.3, 0.8, 0],
                  x: [0, p.x],
                  y: [0, p.y],
                }}
                transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
              />
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
