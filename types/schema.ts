import { z } from 'zod'

// Base schema for category metadata
export const CategoryMetadataSchema = z.record(
	z.string(),
	z.object({
		name: z.string(),
		description: z.string().optional().optional(),
	}),
)

// Refine function to check if all used categories are defined in the meta section
function categoriesRefine(
	data: {
		meta: {
			categories: {
				[key: string]: {
					name: string
					description?: string | null
				}
			} | null
		}
		data: {
			categories: string[] | null
		}[]
	},
	ctx: z.RefinementCtx,
) {
	if (!data.meta.categories) return
	const availableCategories = Object.keys(data.meta.categories)
	const categorySchema = createCategorySchema(availableCategories)
	for (const record of data.data) {
		if (!record.categories) continue
		for (const category of record.categories) {
			if (!categorySchema.safeParse(category).success) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						'Unknown category used (all categories must be defined in the meta section)',
					path: ['data', 'categories', category],
				})
			}
		}
	}
}

// Function to create a dynamic category schema based on available categories
export function createCategorySchema(categories: string[]) {
	return z.enum(categories as [string, ...string[]])
}

export const RecordBaseSchema = z.object({
	name: z.string(),
	categories: z.array(z.string()).nullable(),
	link: z.string().nullable().optional(),
	API: z.boolean().nullable(),
	API_note: z.string().optional(),
	description: z.string().optional().nullable(),
	open_source: z.boolean().nullable(),
	accessibility: z.boolean().nullable(),
	accessibility_note: z.string().optional(),
})

const MaintainableRecordSchema = RecordBaseSchema.extend({
	maintained: z.boolean().nullable(),
	maintained_note: z.string().optional(),
})

// Schemas for specific sections
export const IdxInternetRecordSchema = RecordBaseSchema
export const ArchivedWebRecordSchema = RecordBaseSchema
export const DevicesRecordSchema = RecordBaseSchema.extend({
	services: z.boolean().nullable(),
	services_note: z.string().optional(),
	CVE: z.boolean().nullable(),
	CVE_note: z.string().optional(),
})

export const DarknetRecordSchema = MaintainableRecordSchema
export const MixedRecordSchema = MaintainableRecordSchema
export const DomainsIpsRecordSchema = MaintainableRecordSchema
export const IndexedInternetRecordSchema = RecordBaseSchema

export const SocialNetworksRecordSchema = MaintainableRecordSchema.extend({
	social_networks: z.string().array().nullable(),
})

export const SearchEngineRecordSchema = RecordBaseSchema.omit({
	accessibility: true,
	accessibility_note: true,
	open_source: true,
})

// Basic schema for initial parsing (before dynamic validation)
// Per-section schemas for individual JSON files under public/data/*.json
export const IndexedInternetFileSchema = z
	.object({
		$schema: z.string().optional(),
		meta: z.object({
			categories: CategoryMetadataSchema,
		}),
		data: z.array(IdxInternetRecordSchema),
	})
	.superRefine(categoriesRefine)

export const ArchivedWebFileSchema = z
	.object({
		$schema: z.string().optional(),
		meta: z.object({
			categories: CategoryMetadataSchema,
		}),
		data: z.array(ArchivedWebRecordSchema),
	})
	.superRefine(categoriesRefine)

export const DevicesFileSchema = z
	.object({
		$schema: z.string().optional(),
		meta: z.object({
			categories: CategoryMetadataSchema,
		}),
		data: z.array(DevicesRecordSchema),
	})
	.superRefine(categoriesRefine)

export const DarknetFileSchema = z
	.object({
		$schema: z.string().optional(),
		meta: z.object({
			categories: CategoryMetadataSchema,
		}),
		data: z.array(DarknetRecordSchema),
	})
	.superRefine(categoriesRefine)

export const SocialNetworksFileSchema = z
	.object({
		$schema: z.string().optional(),
		meta: z.object({
			categories: CategoryMetadataSchema,
		}),
		data: z.array(SocialNetworksRecordSchema),
	})
	.superRefine(categoriesRefine)

export const MixedFileSchema = z
	.object({
		$schema: z.string().optional(),
		meta: z.object({
			categories: CategoryMetadataSchema,
		}),
		data: z.array(MixedRecordSchema),
	})
	.superRefine(categoriesRefine)

export const SearchEnginesFileSchema = z
	.object({
		$schema: z.string().optional(),
		meta: z.object({
			categories: CategoryMetadataSchema,
		}),
		data: z.array(SearchEngineRecordSchema),
	})
	.superRefine(categoriesRefine)

export const DomainsIpsFileSchema = z
	.object({
		$schema: z.string().optional(),
		meta: z.object({
			categories: CategoryMetadataSchema,
		}),
		data: z.array(DomainsIpsRecordSchema),
	})
	.superRefine(categoriesRefine)
