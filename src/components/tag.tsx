import type React from 'react'
import { useState } from 'react'
import * as HoverCard from '@radix-ui/react-hover-card'

export type TagVariant =
	| 'default'
	| 'success'
	| 'error'
	| 'warning'
	| 'info'
	| 'secondary'

interface CategoryInfo {
	name: string
	description?: string | null
}

interface TagProps {
	children: React.ReactNode
	variant?: TagVariant
	size?: 'sm' | 'md'
	className?: string
	categoryInfo?: CategoryInfo
}

const variantStyles: Record<TagVariant, string> = {
	default: 'bg-gray-100 text-gray-800 border-gray-200',
	success: 'bg-green-100 text-green-800 border-green-200',
	error: 'bg-red-100 text-red-800 border-red-200',
	warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
	info: 'bg-blue-100 text-blue-800 border-blue-200',
	secondary: 'bg-slate-100 text-slate-700 border-slate-200',
}

const sizeStyles = {
	sm: 'px-2 py-1 text-xs',
	md: 'px-3 py-1.5 text-sm',
}

export default function Tag({
	children,
	variant = 'default',
	size = 'sm',
	className = '',
	categoryInfo,
}: TagProps) {
	const [isOpen, setIsOpen] = useState(false)

	const tagElement = (
		<span
			className={`
        inline-flex items-center rounded-full font-medium border select-none
        ${categoryInfo ? 'cursor-help underline decoration-dotted' : ''}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
			onClick={categoryInfo ? () => setIsOpen(!isOpen) : undefined}
		>
			{children}
		</span>
	)

	// If no category info is provided, return the tag without hover card
	if (!categoryInfo) {
		return tagElement
	}

	return (
		<HoverCard.Root
			open={isOpen}
			onOpenChange={setIsOpen}
			openDelay={200}
			closeDelay={100}
		>
			<HoverCard.Trigger asChild>{tagElement}</HoverCard.Trigger>
			<HoverCard.Portal>
				<HoverCard.Content
					side="top"
					align="center"
					sideOffset={8}
					className="z-50 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
					onPointerDownOutside={() => setIsOpen(false)}
					onEscapeKeyDown={() => setIsOpen(false)}
				>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<span
								className={`
                  inline-flex items-center rounded-full font-medium border text-xs px-2 py-1
                  ${variantStyles[variant]}
                `}
							>
								{children}
							</span>
							<h3 className="font-semibold text-gray-900">
								{categoryInfo.name}
							</h3>
						</div>
						{categoryInfo.description && (
							<p className="text-sm text-gray-600 leading-relaxed">
								{categoryInfo.description}
							</p>
						)}
					</div>
					<HoverCard.Arrow className="fill-gray-200" />
				</HoverCard.Content>
			</HoverCard.Portal>
		</HoverCard.Root>
	)
}
