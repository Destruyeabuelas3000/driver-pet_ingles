'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRating({
  value,
  size = 'size-4',
  className,
}: {
  value: number
  size?: string
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={cn(size, n <= Math.round(value) ? 'fill-star text-star' : 'fill-muted text-border')}
        />
      ))}
    </span>
  )
}

export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div role="radiogroup" aria-label="Calificación" className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          className="rounded p-0.5 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star className={cn('size-7', n <= value ? 'fill-star text-star' : 'fill-muted text-border')} aria-hidden />
        </button>
      ))}
    </div>
  )
}
