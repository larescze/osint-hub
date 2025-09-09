import { useMemo, useRef, useState, useLayoutEffect } from 'react'
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	flexRender,
	createColumnHelper,
	type ColumnDef,
	type SortingState,
} from '@tanstack/react-table'
import ExternalNavigationModal from './external-navigation-dialog'
import Tag from './tag'
import type { CategoryMeta } from '../hooks/useOsintData'
import Note from './note'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

type ColumnType = 'text' | 'link' | 'tags' | 'status'

type StatusValue =
	| boolean
	| 'yes'
	| 'no'
	| 'partial'
	| 'unknown'
	| null
	| undefined

export type DataColumnSpec<T extends object> = {
	id: string
	header?: React.ReactNode
	headerLabel?: string
	type: ColumnType
	accessorKey?: keyof T
	accessorFn?: (row: T) => unknown
	sortable?: boolean
	statusOrder?: Record<'yes' | 'partial' | 'no' | 'unknown', number>
	// link-specific
	linkHrefKey?: keyof T
	linkHrefAccessor?: (row: T) => string | null | undefined
	// optional classes
	headerClassName?: string
	cellClassName?: string
	noteDataKey?: keyof T
}

export type DataTableProps<T extends object> = {
	data: T[]
	columns: Array<DataColumnSpec<T>>
	categoryMeta?: Record<string, CategoryMeta>
	stickyHeader?: boolean
	scrollContainerSelector?: string // CSS selector for scroll container that affects header position (defaults to 'main')
	initialSorting?: SortingState
	onSortingChange?: (sorting: SortingState) => void
}

const DEFAULT_STATUS_ORDER: Record<
	'yes' | 'partial' | 'no' | 'unknown',
	number
> = {
	yes: 0,
	partial: 1,
	no: 2,
	unknown: 3,
}

function normalizeStatus(
	value: StatusValue,
): 'yes' | 'no' | 'partial' | 'unknown' {
	if (typeof value === 'boolean') return value ? 'yes' : 'no'
	if (!value) return 'unknown'
	const v = String(value).toLowerCase() as 'yes' | 'no' | 'partial' | 'unknown'
	return ['yes', 'no', 'partial', 'unknown'].includes(v) ? v : 'unknown'
}

export default function DataTable<T extends object>(props: DataTableProps<T>) {
	const {
		data,
		columns: specs,
		categoryMeta = {},
		stickyHeader = true,
		scrollContainerSelector = 'main',
		initialSorting = [],
		onSortingChange,
	} = props
	const columnHelper = createColumnHelper<T>()

	const [sorting, setSorting] = useState<SortingState>(initialSorting)
	const headerRef = useRef<HTMLTableSectionElement | null>(null)
	const stickyHeaderRef = useRef<HTMLDivElement | null>(null)
	const tableContainerRef = useRef<HTMLDivElement | null>(null)

	// Sync sticky header with widths and scroll position
	useLayoutEffect(() => {
		if (!stickyHeader) return
		const onScrollOrResize = () => {
			if (!headerRef.current) return
			const top = headerRef.current.getBoundingClientRect().top
			if (!tableContainerRef.current || !stickyHeaderRef.current) return
			const ths = headerRef.current.querySelectorAll('th')
			const widths = Array.from(ths).map(
				(th) => th.getBoundingClientRect().width,
			)
			widths.forEach((width, index) => {
				;(stickyHeaderRef.current?.children[index] as HTMLElement).style.width =
					`${width}px`
			})
			;(stickyHeaderRef.current as HTMLDivElement).scrollLeft = (
				tableContainerRef.current as HTMLDivElement
			).scrollLeft
		}

		onScrollOrResize()
		window.addEventListener('resize', onScrollOrResize)
		const scrollEl = document.querySelector(scrollContainerSelector)
		scrollEl?.addEventListener('scroll', onScrollOrResize)
		tableContainerRef.current?.addEventListener('scroll', onScrollOrResize)
		return () => {
			window?.removeEventListener('resize', onScrollOrResize)
			scrollEl?.removeEventListener('scroll', onScrollOrResize)
			tableContainerRef.current?.removeEventListener('scroll', onScrollOrResize)
		}
	})

	// biome-ignore lint/correctness/useExhaustiveDependencies: intended to run only once
	const columns = useMemo<ColumnDef<T, unknown>[]>(() => {
		return specs.map((spec) => {
			const headerNode = spec.header ?? spec.headerLabel ?? spec.id

			// Derive common accessor
			const accessor = spec.accessorFn
				? (row: T) => spec.accessorFn?.(row)
				: spec.accessorKey
					? (row: T) =>
							(row as unknown as { [key: string]: unknown })[
								spec.accessorKey as string
							]
					: (row: T) => (row as unknown as { [key: string]: unknown })[spec.id]

			// sortingFn per type
			let sortingFn: ColumnDef<T, unknown>['sortingFn'] = 'alphanumeric'
			let enableSorting = true
			if (spec.sortable === false) enableSorting = false

			if (spec.type === 'tags') {
				enableSorting = false
				sortingFn = undefined
			} else if (spec.type === 'status') {
				const orderMap = spec.statusOrder ?? DEFAULT_STATUS_ORDER
				sortingFn = (rowA, rowB) => {
					const a = normalizeStatus(accessor(rowA.original) as StatusValue)
					const b = normalizeStatus(accessor(rowB.original) as StatusValue)

					return orderMap[a] - orderMap[b]
				}
			} else if (spec.type === 'link') {
				sortingFn = 'alphanumeric'
			} else {
				sortingFn = 'alphanumeric'
			}

			return columnHelper.accessor((row) => accessor(row), {
				id: spec.id,
				header: () => (
					<button
						type="button"
						className={`px-6 h-[40px] text-center uppercase ${
							spec.headerClassName ?? ''
						}`}
					>
						{headerNode}
					</button>
				),
				cell: (info) => {
					const row = info.row.original
					switch (spec.type) {
						case 'text': {
							const value = info.getValue() as string | null | undefined
							return (
								<div
									className="text-sm text-gray-600"
									style={{ color: '#111111' }}
								>
									{value ?? (
										<span
											className="text-gray-400"
											style={{ color: '#666666' }}
										>
											N/A
										</span>
									)}
									{spec.noteDataKey ? (
										// biome-ignore lint/suspicious/noExplicitAny: <explanation>
										<Note note={(row as any)[spec.noteDataKey as string]} />
									) : null}
								</div>
							)
						}

						case 'link': {
							const label = info.getValue() as string | null | undefined
							const href = spec.linkHrefAccessor
								? spec.linkHrefAccessor(row)
								: spec.linkHrefKey
									? (row as unknown as { [key: string]: unknown })[
											spec.linkHrefKey as string
										]
									: undefined
							if (href) {
								return (
									<ExternalNavigationModal
										trigger={
											<div className="flex items-center gap-1">
												<span className="font-medium underline cursor-pointer">
													{label}
												</span>
												<ArrowTopRightOnSquareIcon className="size-4 cursor-pointer" />
												{spec.noteDataKey ? (
													<Note
														// biome-ignore lint/suspicious/noExplicitAny: <explanation>
														note={(row as any)[spec.noteDataKey as string]}
													/>
												) : null}
											</div>
										}
										href={href as string}
									/>
								)
							}
							return <span className="font-medium">{label ?? 'N/A'}</span>
						}

						case 'tags': {
							const tags = (info.getValue() as Array<string>) ?? []
							return (
								<div className="flex flex-wrap gap-1">
									{tags.map((tag) => {
										const tagUpper = String(tag).toUpperCase()
										const catInfo = categoryMeta[tagUpper]
										return (
											<Tag
												key={tagUpper}
												variant="secondary"
												categoryInfo={catInfo}
											>
												{tagUpper}
											</Tag>
										)
									})}
								</div>
							)
						}

						default: {
							// status
							const normalized = normalizeStatus(info.getValue() as StatusValue)
							const variantMap = {
								yes: 'success' as const,
								no: 'error' as const,
								partial: 'warning' as const,
								unknown: 'default' as const,
							}
							return (
								<div className="flex items-center gap-1">
									<Tag variant={variantMap[normalized]}>{normalized}</Tag>
									{spec.noteDataKey ? (
										// biome-ignore lint/suspicious/noExplicitAny: <explanation>
										<Note note={(row as any)[spec.noteDataKey as string]} />
									) : null}
								</div>
							)
						}
					}
				},
				enableSorting,
				sortingFn,
			})
		})
	}, [specs])

	const specById = useMemo(() => {
		const map: Record<string, DataColumnSpec<T>> = {}
		for (const s of specs) {
			map[s.id] = s
		}
		return map
	}, [specs])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: (updater) => {
			const next = typeof updater === 'function' ? updater(sorting) : updater
			setSorting(next)
			onSortingChange?.(next)
		},
		state: { sorting },
	})

	return (
		<div className="bg-white rounded-lg shadow border border-gray-200">
			{stickyHeader && (
				<div
					className={`
            overflow-hidden
            w-full
            sticky
            top-0
            z-20
            bg-gray-50
            border
            border-gray-200
            mb-[-42px]
          `}
				>
					<div className="flex overflow-hidden" ref={stickyHeaderRef}>
						{(table.getHeaderGroups()[0]?.headers ?? []).map((header) => (
							<div
								key={header.id}
								className="shrink-0 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
								style={{ color: '#111111' }}
								onClick={header.column.getToggleSortingHandler()}
							>
								<div className="flex items-center space-x-1">
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
									{{
										asc: <span style={{ color: '#111111' }}>↑</span>,
										desc: <span style={{ color: '#111111' }}>↓</span>,
									}[header.column.getIsSorted() as string] ?? null}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="overflow-x-auto" ref={tableContainerRef}>
				<table className="table-fixed min-w-full divide-y divide-gray-200">
					<thead
						className="bg-gray-50 opacity-0 pointer-events-none"
						ref={headerRef}
					>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className="relative text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
										style={{ color: '#111111' }}
										onClick={header.column.getToggleSortingHandler()}
									>
										<div className="flex items-center space-x-1">
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
											{{
												asc: <span style={{ color: '#111111' }}>↑</span>,
												desc: <span style={{ color: '#111111' }}>↓</span>,
											}[header.column.getIsSorted() as string] ?? null}
										</div>
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id} className="hover:bg-gray-50">
								{row.getVisibleCells().map((cell) => {
									const spec = specById[cell.column.id as string]
									let extraStyle: Record<string, unknown> | undefined =
										undefined
									if (spec?.type === 'text') {
										const v = cell.getValue() as unknown
										const length =
											typeof v === 'string'
												? v.length
												: v == null
													? 0
													: String(v).length
										if (length > 20) {
											extraStyle = { minWidth: '380px' }
										}
									}
									return (
										<td
											key={cell.id}
											className="px-6 h-[40px] py-2 text-sm"
											style={{ color: '#111111', ...(extraStyle || {}) }}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									)
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{data.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-500" style={{ color: '#111111' }}>
						No records found
					</p>
				</div>
			)}
		</div>
	)
}
