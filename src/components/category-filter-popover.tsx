import * as Popover from '@radix-ui/react-popover'
import Tag from './tag'
import type { CategoryMeta } from '../hooks/useOsintData'

type CategoryFilterPopoverProps = {
	label?: string
	categoryMeta: Record<string, CategoryMeta>
	selected: Set<string> // uppercase codes
	onChange: (next: Set<string>) => void
}

export default function CategoryFilterPopover(
	props: CategoryFilterPopoverProps,
) {
	const { label = 'Categories', categoryMeta, selected, onChange } = props

	const allCodes = Object.keys(categoryMeta)
	const orderedSelectedUpper = allCodes.filter((code) => selected.has(code))
	const shown = orderedSelectedUpper.slice(0, 3)
	const hasMore = orderedSelectedUpper.length > 3

	const toggle = (code: string) => {
		onChange(
			(() => {
				const next = new Set(selected)
				if (next.has(code)) next.delete(code)
				else next.add(code)
				return next
			})(),
		)
	}

	const clear = () => onChange(new Set())

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<div
					className="inline-flex items-center gap-1 w-[100%] box-border uppercase px-6 h-[40px]"
					onClick={(e) => e.stopPropagation()}
					aria-label={`Filter by ${label.toLowerCase()}`}
				>
					{label}
					{orderedSelectedUpper.length > 0 && (
						<span>{` (${shown.join(', ')}${hasMore ? ', ...' : ''})`}</span>
					)}
				</div>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					side="bottom"
					align="start"
					sideOffset={8}
					data-side="top"
					className="PopoverContent rounded-lg border border-gray-200 bg-white p-4 shadow-lg w-[280px] max-w-[95vw] z-50"
					onOpenAutoFocus={(e) => e.preventDefault()}
				>
					<div
						className="mb-2 text-xs font-semibold uppercase tracking-wider"
						style={{ color: '#111111' }}
					>
						Select categories
					</div>
					<div className="flex flex-wrap gap-2 mt-2">
						{allCodes.map((code) => {
							const active = selected.has(code)
							const catInfo = categoryMeta[code]
							return (
								<button
									key={code}
									type="button"
									className="p-0 m-0 bg-transparent border-0 cursor-pointer"
									onClick={(e) => {
										e.stopPropagation()
										toggle(code)
									}}
								>
									<Tag
										variant={active ? 'info' : 'secondary'}
										size="sm"
										categoryInfo={catInfo}
									>
										{code}
									</Tag>
								</button>
							)
						})}
					</div>
					<div className="mt-3 text-right">
						{selected.size > 0 && (
							<button
								type="button"
								className="text-xs text-blue-600 hover:underline"
								onClick={(e) => {
									e.stopPropagation()
									clear()
								}}
							>
								Clear
							</button>
						)}
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
}
