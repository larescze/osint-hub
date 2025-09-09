import type z from 'zod'
import type { IdxInternetRecordSchema } from './schema'

// Export inferred types
export type Category = string // Categories are now dynamic strings
export type IndexedInternetRecord = z.infer<typeof IdxInternetRecordSchema>

export type NavbarCategory = {
	name: string
	path: string
	icon: React.FC<React.SVGProps<SVGSVGElement>>
}
