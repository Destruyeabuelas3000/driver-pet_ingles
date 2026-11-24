import Image from 'next/image'
import { Mail, MapPin } from 'lucide-react'

/* NOTA EDITABLE: datos de contacto del pie de página */
const CONTACT = {
  email: 'hola@driverpet.com',
  address: 'Bogotá, Colombia',
}

export function SiteFooter() {
  return (
    <footer id="contacto" className="mt-16 border-t bg-secondary">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-4">
          <Image src="/images/logo-color.png" alt="Driver Pet" width={120} height={96} className="h-20 w-auto" />
          <p className="max-w-xs text-sm text-muted-foreground text-pretty">
            Paseos seguros, felices y con reportes para que siempre sepas cómo le fue a tu mejor amigo.
          </p>
        </div>
        <address className="flex flex-col gap-2 text-sm not-italic">
          <h2 className="font-bold text-primary">Contacto</h2>
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-primary">
            <Mail className="size-4 text-primary" aria-hidden /> {CONTACT.email}
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" aria-hidden /> {CONTACT.address}
          </span>
        </address>
      </div>
    </footer>
  )
}
