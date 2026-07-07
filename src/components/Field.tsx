import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  required?: boolean
  htmlFor: string
  children: ReactNode
}

export function Field({ label, required, htmlFor, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="type-label text-text-primary">
        {label}
        {required && <span className="text-text-muted"> *</span>}
      </label>
      {children}
    </div>
  )
}
