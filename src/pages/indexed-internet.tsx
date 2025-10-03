import { useMemo, useState } from 'react'
import { useSectionData } from '../hooks/useSectionData'
import CategoryFilterPopover from '../components/category-filter-popover'
import DataTable, { type DataColumnSpec } from '../components/data-table'
import PageLayout from '../components/page-layout'
import type z from 'zod'
import type { IndexedInternetRecordSchema } from '../../types/schema'

type IndexedInternetRecord = z.infer<typeof IndexedInternetRecordSchema>

export default function IndexedInternet() {
	const { data, loading, error } =
		useSectionData<IndexedInternetRecord>('indexed_internet')

	const records = data?.data || []
	const categoryMeta = data?.meta?.categories || {}

	// Categories filtering state (store uppercase codes for the popover)
	const [selectedCategoriesUpper, setSelectedCategoriesUpper] = useState<
		Set<string>
	>(new Set())

	const filteredRecords = useMemo(() => {
		if (selectedCategoriesUpper.size === 0) return records
		return records.filter((r) =>
			r.categories?.some((catLower) =>
				selectedCategoriesUpper.has(catLower.toUpperCase()),
			),
		)
	}, [records, selectedCategoriesUpper])

	const columns = useMemo<DataColumnSpec<IndexedInternetRecord>[]>(() => {
		return [
			{
				id: 'name',
				type: 'link',
				accessorKey: 'name',
				linkHrefKey: 'link',
				headerLabel: 'Name',
			},
			{
				id: 'categories',
				type: 'tags',
				accessorKey: 'categories',
				sortable: false,
				headerClassName: 'px-0 h-auto',
				header: (
					<CategoryFilterPopover
						label="Categories"
						categoryMeta={categoryMeta}
						selected={selectedCategoriesUpper}
						onChange={setSelectedCategoriesUpper}
					/>
				),
			},
			{
				id: 'open_source',
				type: 'status',
				accessorKey: 'open_source',
				headerLabel: 'Open Source',
				statusOrder: { yes: 0, no: 1, na: 2 },
			},
			{
				id: 'accessibility',
				type: 'status',
				accessorKey: 'accessibility',
				headerLabel: 'Accessibility',
				noteDataKey: 'accessibility_note',
			},
			{
				id: 'API',
				type: 'status',
				accessorKey: 'API',
				headerLabel: 'API',
				noteDataKey: 'API_note',
			},
			{
				id: 'description',
				type: 'text',
				accessorKey: 'description',
				headerLabel: 'Description',
				sortable: false,
			},
		]
	}, [categoryMeta, selectedCategoriesUpper])

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-64">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2" />
					<p style={{ color: '#111111' }}>Loading OSINT sources...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-64">
				<div className="text-center text-red-600">
					<p className="text-lg font-semibold" style={{ color: '#111111' }}>
						Error loading data
					</p>
					<p className="text-sm" style={{ color: '#666666' }}>
						{error}
					</p>
				</div>
			</div>
		)
	}

	return (
		<PageLayout
			title="Indexed Internet Sources"
			subtitle="Curated collection of OSINT sources for web research"
		>
			<DataTable<IndexedInternetRecord>
				data={filteredRecords}
				columns={columns}
				categoryMeta={categoryMeta}
				stickyHeader
				scrollContainerSelector="main"
			/>
		</PageLayout>
	)
}
