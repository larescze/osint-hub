import { Link, useLocation } from 'react-router-dom'

export default function NavLink(props: {
	className?: string
	href: string
	children: React.ReactNode
	icon: React.FC<React.SVGProps<SVGSVGElement>>
	onClick?: () => void
}) {
	const location = useLocation()
	const className = `
    block
    px-9
    py-3
    w-full
    text-base
    ${location.pathname === props.href ? 'bg-white/10 text-white' : 'hover:bg-white/10 hover:text-white text-white/80'}
    flex
    items-center
    gap-2.5
    ${props.className}
  `

	// For external links (OSINT tools)
	if (props.href.startsWith('http')) {
		return (
			<a
				href={props.href}
				target={props.href.startsWith('http') ? '_blank' : undefined}
				rel="noopener noreferrer"
				className={className}
				onClick={props.onClick}
			>
				<props.icon className="size-5" />
				{props.children}
			</a>
		)
	}

	// // For internal navigation (if needed in the future)
	return (
		<Link to={props.href} className={className} onClick={props.onClick}>
			<props.icon className="size-5" />
			{props.children}
		</Link>
	)
}
