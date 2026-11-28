import { useMemo, useState } from 'react'

function getSearchableText(value: unknown): string {
	if (value == null) return ''
	if (Array.isArray(value)) return value.map(getSearchableText).join(' ')
	if (typeof value === 'object') {
		return Object.values(value as Record<string, unknown>)
			.map(getSearchableText)
			.join(' ')
	}
	return String(value)
}

function normalizeSearchText(value: string): string {
	return value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase()
}

export function useFullTextSearch<T extends object>(data: T[]) {
	const [searchQuery, setSearchQuery] = useState('')

	const filteredData = useMemo(() => {
		const terms = normalizeSearchText(searchQuery)
			.trim()
			.split(/\s+/)
			.filter(Boolean)
		if (terms.length === 0) return data

		return data.filter((record) => {
			const searchableText = normalizeSearchText(getSearchableText(record))
			return terms.every((term) => searchableText.includes(term))
		})
	}, [data, searchQuery])

	return { searchQuery, setSearchQuery, filteredData }
}
