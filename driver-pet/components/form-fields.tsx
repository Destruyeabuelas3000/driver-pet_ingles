import { ChevronDown } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function PillSelect({
  icon,
  className,
  children,
  ...props
}: ComponentProps<'select'> & { icon?: ReactNode }) {
  return (
    <div className={cn('relative', className)}>
      {icon && (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-primary">{icon}</span>
      )}
      <select
        {...props}
        className={cn(
          'h-10 w-full appearance-none rounded-lg border border-border bg-card pr-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          icon ? 'pl-9' : 'pl-3',
        )}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
    </div>
  )
}

export const inputClass =
  'h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export const textareaClass =
  'w-full rounded-lg border border-border bg-card px-3 py-2 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}
