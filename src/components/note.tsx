import * as HoverCard from '@radix-ui/react-hover-card'
import { useState } from 'react'

export default function Note({ note }: { note: string }) {
	const [isOpen, setIsOpen] = useState(false)

	if (!note) return null

	return (
		<HoverCard.Root open={isOpen} onOpenChange={setIsOpen}>
			<HoverCard.Trigger asChild>
				<span
					className="text-sm text-gray-600 cursor-help underline decoration-dotted mx-1 italic"
					style={{ color: '#111111' }}
					onClick={() => setIsOpen(!isOpen)}
				>
					note
				</span>
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
