import { useEffect, useState } from 'react'
import type { IndexedInternetRecord } from '../../types/types'

export interface CategoryMeta {
	name: string
	description?: string | null
}

export interface SectionFile<TRecord> {
	meta: { categories: Record<string, CategoryMeta> }
	data: TRecord[]
}

export interface UseSectionDataReturn<TRecord> {
	data?: SectionFile<TRecord>
	loading: boolean
	error: string | null
	refetch: () => Promise<void>
}

export interface NormalizedRecord
	extends Omit<IndexedInternetRecord, 'categories'> {
	categories: string[]
	normalizedTool: string
	normalizedDescription: string
}

export function normalizeIndexedInternetRecord(
	record: IndexedInternetRecord,
): NormalizedRecord {
	const normalizeUrl = (url: string | undefined): string | undefined => {
		if (!url) return undefined
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
		categories: record.categories.map((c) => c.toLowerCase()),
		normalizedTool: record.tool.toLowerCase().trim(),
		normalizedDescription: (record.description || '').toLowerCase().trim(),
	}
}

export function useSectionData<TRecord, TMapped = TRecord>(
	section: string,
	options?: { map?: (records: TRecord[]) => TMapped[] },
): UseSectionDataReturn<TMapped> {
	const [data, setData] = useState<SectionFile<TMapped> | undefined>(undefined)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchData = async (): Promise<void> => {
		try {
			setLoading(true)
			setError(null)
			const BASE_URL = (import.meta as unknown as { env: { BASE_URL: string } })
				.env.BASE_URL
			const response = await fetch(`${BASE_URL}/data/${section}.json`)
			if (!response.ok) {
				throw new Error(
					`Failed to fetch ${section}.json: ${response.status} ${response.statusText}`,
				)
			}
			const raw = (await response.json()) as SectionFile<TRecord>
			const mapped = options?.map
				? options.map(raw.data)
				: (raw.data as unknown as TMapped[])
			setData({ meta: raw.meta, data: mapped })
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error'
			setError(message)
			console.error('Error fetching section data:', err)
		} finally {
			setLoading(false)
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: run once
	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [section])

	return { data, loading, error, refetch: fetchData }
}
