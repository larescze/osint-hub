import type React from 'react'

interface PageLayoutProps {
	title: string
	subtitle?: string
	children: React.ReactNode
}

export default function PageLayout({
	title,
	subtitle,
	children,
}: PageLayoutProps) {
	return (
		<div className="max-lg:pb-28 max-md:pb-28 max-sm:pb-28 p-16 max-xl:p-9 max-lg:p-9 max-md:p-6 max-sm:px-3 max-sm:pt-6">
			<div className="mb-6">
				<h1
					className="text-3xl max-md:text-2xl font-bold text-gray-900 mb-2 tracking-tighter"
					style={{ color: '#111111' }}
				>
					{title}
				</h1>
				{subtitle ? (
					<p
						className="text-gray-600 leading-tight"
						style={{ color: '#111111' }}
					>
						{subtitle}
					</p>
				) : null}
			</div>
			{children}
		</div>
	)
}
