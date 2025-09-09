import { useMemo, useState } from 'react'
import DataTable, { type DataColumnSpec } from '../components/data-table'
import PageLayout from '../components/page-layout'
import CategoryFilterPopover from '../components/category-filter-popover'
import { useOsintDataContext } from '../contexts/osing-data-context'

type MixedRecord = {
	tool: string
	categories: string[]
	link: string | null
	maintained: 'yes' | 'no' | 'partial' | 'unknown'
	maintained_note: string | null
	API: 'yes' | 'no' | 'partial' | 'unknown'
	API_note: string | null
	description: string | null
}

export default function MixedPage() {
	const { data, loading, error } = useOsintDataContext()

	const records: MixedRecord[] = (data?.mixed?.data as MixedRecord[]) || []
	const categoryMeta = data?.mixed?.meta?.categories || {}

	const [selectedCategoriesUpper, setSelectedCategoriesUpper] = useState<
		Set<string>
	>(new Set())

	const filteredRecords = useMemo(() => {
		if (selectedCategoriesUpper.size === 0) return records
		return records.filter((r) =>
			r.categories?.some((c) =>
				selectedCategoriesUpper.has(String(c).toUpperCase()),
			),
		)
	}, [records, selectedCategoriesUpper])

	const columns = useMemo<DataColumnSpec<MixedRecord>[]>(() => {
		return [
			{
				id: 'tool',
				type: 'link',
				accessorKey: 'tool',
				linkHrefKey: 'link',
				headerLabel: 'Tool',
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
				id: 'maintained',
				type: 'status',
				accessorKey: 'maintained',
				headerLabel: 'Maintained',
				noteDataKey: 'maintained_note',
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
			<PageLayout title="Mixed" subtitle="Assorted OSINT resources">
				<div className="flex justify-center items-center min-h-64">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2" />
						<p style={{ color: '#111111' }}>Loading mixed sources...</p>
					</div>
				</div>
			</PageLayout>
		)
	}

	if (error) {
		return (
			<PageLayout title="Mixed">
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
			</PageLayout>
		)
	}

	return (
		<PageLayout title="Mixed" subtitle="Assorted OSINT resources">
			<DataTable<MixedRecord>
				data={filteredRecords}
				columns={columns}
				categoryMeta={categoryMeta}
				stickyHeader
				scrollContainerSelector="main"
			/>
		</PageLayout>
	)
}
