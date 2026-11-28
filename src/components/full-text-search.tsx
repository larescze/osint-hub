import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type FullTextSearchProps = {
	query: string
	onQueryChange: (query: string) => void
}

const PLACEHOLDER_TEXT = 'Search names, categories, descriptions, notes...'

export default function FullTextSearch({
	query,
	onQueryChange,
}: FullTextSearchProps) {
	return (
		<div className="flex flex-row-reverse border-b border-gray-200 bg-gray-50 p-4">
			<div className="group/search relative w-64">
				<MagnifyingGlassIcon
					className="pointer-events-none absolute left-3 top-1/2 z-10 size-5 -translate-y-1/2 text-gray-500"
					aria-hidden="true"
				/>

				{query.length === 0 && (
					<div
						className="pointer-events-none absolute inset-y-0 left-11 right-3 flex items-center overflow-hidden text-sm text-gray-500"
						aria-hidden="true"
					>
						<div className="flex w-max whitespace-nowrap group-focus-within/search:animate-[marquee-left_10s_linear_infinite] group-hover/search:animate-[marquee-left_10s_linear_infinite]">
							<span className="pr-8">{PLACEHOLDER_TEXT}</span>
							<span className="pr-8">{PLACEHOLDER_TEXT}</span>
						</div>
					</div>
				)}

				<input
					type="search"
					value={query}
					onChange={(event) => onQueryChange(event.target.value)}
					className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
					aria-label="Full-text search this category"
				/>
			</div>
		</div>
	)
}