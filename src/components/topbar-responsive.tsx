import { Link } from 'react-router-dom'

export default function TopbarResponsive() {
	return (
		<div className="py-5 px-6 lg:hidden bg-[#111111] text-white text-lg flex flex-col justify-center gap-0.5">
			<Link to="/" className="font-semibold leading-none">
				OSINT Hub
			</Link>
			<span className="text-sm text-white/60 leading-none">
				A catalog of OSINT tools and resources
			</span>
		</div>
	)
}
