import { useState, useEffect } from 'react'
import type { Category, IndexedInternetRecord } from '../../types/types'

// Category metadata structure
export interface CategoryMeta {
	name: string
	description?: string | null
}

// Generic data structure from the JSON file
interface OsintDataRoot {
	$schema?: string
	indexed_internet?: {
		meta: {
			categories: Record<string, CategoryMeta>
		}
		data: IndexedInternetRecord[]
	}
	search_engines?: {
		meta: { categories: Record<string, CategoryMeta> }
		data: unknown[]
	}
	archived_web?: {
		meta: { categories: Record<string, CategoryMeta> }
		data: unknown[]
	}
	devices?: {
		meta: { categories: Record<string, CategoryMeta> }
		data: unknown[]
	}
	dark_web?: {
		meta: { categories: Record<string, CategoryMeta> }
		data: unknown[]
	}
	social_networks?: {
		meta: { categories: Record<string, CategoryMeta> }
		data: unknown[]
	}
	mixed?: {
		meta: { categories: Record<string, CategoryMeta> }
		data: unknown[]
	}
	[key: string]: unknown // Allow for future table types
}

// Normalized record type for indexed_internet
export interface NormalizedRecord
	extends Omit<IndexedInternetRecord, 'categories'> {
	categories: Category[]
	normalizedTool: string
	normalizedDescription: string
}

// Generic hook return type
export interface UseOsintDataReturn {
	data: {
		indexed_internet?: {
			meta: {
				categories: Record<string, CategoryMeta>
			}
			records: NormalizedRecord[]
		}
		search_engines?: {
			meta: { categories: Record<string, CategoryMeta> }
			data: unknown[]
		}
		archived_web?: {
			meta: { categories: Record<string, CategoryMeta> }
			data: unknown[]
		}
		devices?: {
			meta: { categories: Record<string, CategoryMeta> }
			data: unknown[]
		}
		dark_web?: {
			meta: { categories: Record<string, CategoryMeta> }
			data: unknown[]
		}
		social_networks?: {
			meta: { categories: Record<string, CategoryMeta> }
			data: unknown[]
		}
		mixed?: {
			meta: { categories: Record<string, CategoryMeta> }
			data: unknown[]
		}
		[key: string]: unknown // Allow for future table types
	}
	loading: boolean
	error: string | null
	refetch: () => Promise<void>
}

/**
 * Normalizes a record by trimming strings, normalizing URLs, and lowercasing categories
 */
function normalizeRecord(record: IndexedInternetRecord): NormalizedRecord {
	const normalizeUrl = (url: string | undefined): string | undefined => {
		if (!url) return undefined
		// Remove trailing slashes and ensure consistent format
		return url.replace(/\/+$/, '')
	}

	return {
		...record,
		tool: record.tool.trim(),
		link: normalizeUrl(record.link),
		open_source_license: record.open_source_license?.trim() || undefined,
		accessibility_note: record.accessibility_note?.trim() || undefined,
		API_note: record.API_note?.trim() || undefined,
		description: record.description?.trim() || undefined,
		categories: record.categories.map(
			(cat: string) => cat.toLowerCase() as Category,
		),
		// Add normalized fields for search purposes
		normalizedTool: record.tool.toLowerCase().trim(),
		normalizedDescription: (record.description || '').toLowerCase().trim(),
	}
}

/**
 * Custom hook to fetch and manage OSINT data
 */
export function useOsintData(): UseOsintDataReturn {
	const [data, setData] = useState<{
		indexed_internet?: {
			records: NormalizedRecord[]
			meta: { categories: Record<string, CategoryMeta> }
		}
		search_engines?: {
			meta: { categories: Record<string, CategoryMeta> }
			data: unknown[]
		}
		archived_web?: {
			meta: { categories: Record<string, CategoryMeta> }
			data: unknown[]
		}
		devices?: {
			meta: { categories: Record<string, CategoryMeta> }
			data: unknown[]
		}
		dark_web?: {
			meta: { categories: Record<string, CategoryMeta> }
			data: unknown[]
		}
		social_networks?: {
			meta: { categories: Record<string, CategoryMeta> }
			data: unknown[]
		}
		mixed?: {
			meta: { categories: Record<string, CategoryMeta> }
			data: unknown[]
		}
		[key: string]: unknown
	}>({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchData = async (): Promise<void> => {
		try {
			setLoading(true)
			setError(null)
			const BASE_URL = (import.meta as unknown as { env: { BASE_URL: string } })
				.env.BASE_URL
			const response = await fetch(`${BASE_URL}/data/data.json`)

			if (!response.ok) {
				throw new Error(
					`Failed to fetch data: ${response.status} ${response.statusText}`,
				)
			}

			const rawData: OsintDataRoot = await response.json()

			// Process indexed_internet data if it exists
			const processedData: typeof data = {}

			if (rawData.indexed_internet?.data) {
				// Validate structure
				if (!Array.isArray(rawData.indexed_internet.data)) {
					throw new Error(
						'Invalid data structure: indexed_internet.data must be an array',
					)
				}

				// Normalize records and set the processed data
				processedData.indexed_internet = {
					meta: rawData.indexed_internet.meta,
					records: rawData.indexed_internet.data.map(normalizeRecord),
				}
			}

			if (rawData.search_engines)
				processedData.search_engines = rawData.search_engines

			// Pass through other sections as-is (we may add normalization later per section)
			if (rawData.archived_web)
				processedData.archived_web = rawData.archived_web
			if (rawData.devices) processedData.devices = rawData.devices
			if (rawData.dark_web) processedData.dark_web = rawData.dark_web
			if (rawData.social_networks)
				processedData.social_networks = rawData.social_networks
			if (rawData.mixed) processedData.mixed = rawData.mixed

			setData(processedData)
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'An unknown error occurred'
			setError(errorMessage)
			console.error('Error fetching OSINT data:', err)
		} finally {
			setLoading(false)
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: intended to run only once
	useEffect(() => {
		fetchData()
	}, [])

	return {
		data,
		loading,
		error,
		refetch: fetchData,
	}
}
