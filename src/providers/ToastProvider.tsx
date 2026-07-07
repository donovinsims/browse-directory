import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'

interface ToastState {
  toast: (message: string) => void
}

const ToastContext = createContext<ToastState | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const toast = useCallback((msg: string) => {
    setMessage(msg)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMessage(null), 3600)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {message && (
        <div className="fixed bottom-6 left-6 z-50 max-w-[360px] appear">
          <div className="bg-surface-raised shadow-float ring-hairline rounded-[10px] px-4 py-3 type-label text-text-primary">
            {message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastState {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
