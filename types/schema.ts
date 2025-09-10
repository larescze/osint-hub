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
			}
		}
		data: {
			categories: string[]
		}[]
	},
	ctx: z.RefinementCtx,
) {
	const availableCategories = Object.keys(data.meta.categories)
	const categorySchema = createCategorySchema(availableCategories)
	for (const record of data.data) {
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
	tool: z.string(),
	categories: z.array(z.string()),
	link: z.string().optional(),
	API: z.boolean().nullable(),
	API_note: z.string().optional(),
	description: z.string().optional(),
})

// Schemas for specific sections
export const IdxInternetRecordSchema = RecordBaseSchema.extend({
	open_source: z.boolean(),
	open_source_license: z.string().optional(),
	accessibility: z.boolean().nullable(),
	accessibility_note: z.string().optional(),
})

export const ArchivedWebRecordSchema = RecordBaseSchema.extend({
	open_source: z.boolean(),
	accessibility: z.boolean().nullable(),
	accessibility_note: z.string().optional(),
})

export const DevicesRecordSchema = RecordBaseSchema.extend({
	services: z.boolean().nullable(),
	services_note: z.string().optional(),
	CVE: z.boolean().nullable(),
	CVE_note: z.string().optional(),
	maintained: z.boolean().nullable(),
	maintained_note: z.string().optional(),
})

export const DarkWebRecordSchema = RecordBaseSchema.extend({
	maintained: z.boolean().nullable(),
	maintained_note: z.string().optional(),
})

export const SocialNetworksRecordSchema = RecordBaseSchema.extend({
	social_network: z.string(),
	maintained: z.boolean().nullable(),
	maintained_note: z.string().optional(),
})

export const MixedRecordSchema = RecordBaseSchema.extend({
	maintained: z.boolean().nullable(),
	maintained_note: z.string().optional(),
})

export const SearchEngineRecordSchema = RecordBaseSchema

// Domains & IPs schema: resources for domains, certificates and IP addresses
export const DomainsIpsRecordSchema = RecordBaseSchema.extend({
	open_source: z.boolean(),
	accessibility: z.boolean().nullable(),
	accessibility_note: z.string().optional(),
	maintained: z.boolean().nullable(),
	maintained_note: z.string().optional(),
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

export const DarkWebFileSchema = z
	.object({
		$schema: z.string().optional(),
		meta: z.object({
			categories: CategoryMetadataSchema,
		}),
		data: z.array(DarkWebRecordSchema),
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
