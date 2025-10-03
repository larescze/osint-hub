import * as HoverCard from '@radix-ui/react-hover-card'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

export default function Note({
	as = 'div',
	className,
	note,
	children,
}: {
	as?: 'div' | 'span'
	className?: string
	note: string | null
	children: React.ReactNode
}) {
	const [isOpen, setIsOpen] = useState(false)

	const Component = as

	if (!note) return <Component className={className}>{children}</Component>

	return (
		<HoverCard.Root
			open={isOpen}
			onOpenChange={setIsOpen}
			openDelay={200}
			closeDelay={200}
		>
			<HoverCard.Trigger asChild>
				<Component
					className={twMerge(
						'cursor-help underline decoration-dotted',
						className,
					)}
					onClick={() => setIsOpen(!isOpen)}
				>
					{children}
				</Component>
			</HoverCard.Trigger>
			<HoverCard.Portal>
				<HoverCard.Content
					className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs text-sm z-50"
					sideOffset={5}
					onPointerDownOutside={() => setIsOpen(false)}
					onEscapeKeyDown={() => setIsOpen(false)}
				>
					{note}
					<HoverCard.Arrow className="fill-white" />
				</HoverCard.Content>
			</HoverCard.Portal>
		</HoverCard.Root>
	)
}
