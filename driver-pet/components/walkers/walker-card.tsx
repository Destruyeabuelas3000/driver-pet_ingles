'use client'

import Image from 'next/image'
import { Star, Users } from 'lucide-react'
import type { Walker } from '@/lib/types'
import { cn } from '@/lib/utils'

export function WalkerCard({
  walker,
  rating,
  selected,
  onSelect,
}: {
  walker: Walker
  rating: number
  selected?: boolean
  onSelect?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring',
        selected ? 'border-primary ring-2 ring-primary/30' : 'border-border',
      )}
    >
      <div className="relative h-20 bg-secondary">
        <div className="absolute inset-x-0 bottom-0 h-8 rounded-t-[50%] bg-card" />
        <div className="absolute top-3 left-1/2 size-24 -translate-x-1/2 overflow-hidden rounded-full border-[3px] border-primary bg-card">
          <Image src={walker.photo} alt={`Foto de ${walker.name}`} fill sizes="96px" className="object-cover" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-3 pt-10 pb-4">
        <h3 className="text-base font-bold text-primary">{walker.name}</h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Star className="size-4 fill-star text-star" aria-hidden />
            {rating.toFixed(1)}/5
          </span>
          <span className="flex items-center gap-1" title="Paseos realizados">
            <Users className="size-4 text-primary" aria-hidden />
            {walker.walksCount}
            <span className="sr-only">paseos</span>
          </span>
        </div>
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{walker.bio}</p>
      </div>
    </button>
  )
}
