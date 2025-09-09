import type React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import IndexedInternet from './pages/indexed-internet'
import ArchivedWebPage from './pages/archived-web'
import DevicesPage from './pages/devices'
import DarkWebPage from './pages/dark-web'
import SocialNetworksPage from './pages/social-networks'
import MixedPage from './pages/mixed'
import SearchEnginesPage from './pages/search-engines'
import { useOsintDataContext } from './contexts/osing-data-context'
import {
	ArchiveBoxIcon,
	ArrowLeftIcon,
	ComputerDesktopIcon,
	EyeSlashIcon,
	GlobeAltIcon,
	MagnifyingGlassIcon,
	Squares2X2Icon,
	UserGroupIcon,
} from '@heroicons/react/24/outline'
import NavSidebar from './components/nav-sidebar'
import NavFloating from './components/nav-floating'
import type { NavbarCategory } from '../types/types'
import TopbarResponsive from './components/topbar-responsive'

// Category configuration
const CATEGORIES = [
	{
		name: 'Indexed internet',
		path: '/indexed-internet',
		icon: GlobeAltIcon,
	},
	{
		name: 'Archived web',
		path: '/archived-web',
		icon: ArchiveBoxIcon,
	},
	{
		name: 'Devices',
		path: '/devices',
		icon: ComputerDesktopIcon,
	},
	{
		name: 'Dark web',
		path: '/dark-web',
		icon: EyeSlashIcon,
	},
	{
		name: 'Social networks',
		path: '/social-networks',
		icon: UserGroupIcon,
	},
	{
		name: 'Search engines',
		path: '/search-engines',
		icon: MagnifyingGlassIcon,
	},
	{
		name: 'Mixed',
		path: '/mixed',
		icon: Squares2X2Icon,
	},
] satisfies NavbarCategory[]

function App(): React.ReactElement {
	return (
		<>
			<div className="h-[100vh] overflow-hidden grid grid-cols-[320px_1fr] max-lg:grid-cols-1 w-[100vw] relative">
				<NavSidebar categories={CATEGORIES} />
				<NavFloating categories={CATEGORIES} />
				<main
					id="main"
					className="overflow-y-auto bg-slate-50 overflow-x-hidden lg:w-[calc(100vw-320px)]"
				>
					<TopbarResponsive />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/indexed-internet" element={<IndexedInternet />} />
						<Route path="/archived-web" element={<ArchivedWebPage />} />
						<Route path="/devices" element={<DevicesPage />} />
						<Route path="/dark-web" element={<DarkWebPage />} />
						<Route path="/social-networks" element={<SocialNetworksPage />} />
						<Route path="/search-engines" element={<SearchEnginesPage />} />
						<Route path="/mixed" element={<MixedPage />} />
					</Routes>
				</main>
			</div>
		</>
	)
}

// Special component for the home page showing all tools
function Home() {
	const { data, loading, error } = useOsintDataContext()

	if (loading) return <div className="p-6">Loading...</div>
	if (error) return <div className="p-6 text-red-500">Error: {error}</div>

	return (
		<div className="p-24 max-lg:px-16 max-lg:py-20 max-md:px-9 max-md:pt-9 max-md:pb-28 max-sm:px-6 max-w-5xl">
			<h1 className="text-4xl font-bold mb-6 tracking-tight">
				OSINT Tools Hub Homepage
			</h1>
			<p className="text-lg font-semibold tracking-tight leading-tight mb-6">
				...
				{/* TODO */}
			</p>
			<h2 className="text-2xl font-bold mb-2">About</h2>
			<p>
				...
				{/* TODO */}
			</p>
			<h2 className="text-2xl font-bold mb-2 mt-6">Purpose</h2>
			<p>
				...
				{/* TODO */}
			</p>
			<h2 className="text-2xl font-bold mb-2 mt-6">Contributing</h2>
			<div>
				<p>
					Contributions are welcome. You can edit{' '}
					<code>public/data/data.json</code> and follow the steps below (see
					README for full details).
				</p>
				<ol className="list-decimal pl-6 mt-2 space-y-1">
					<li>Fork the repo and create a feature branch.</li>
					<li>
						Update <code>public/data/data.json</code> in the correct section and
						include all required fields. Add any new categories under{' '}
						<code>meta.categories</code>.
					</li>
					<li>
						Run <code>yarn validate</code> to check schema compliance, totals,
						undefined/unused categories, and potential duplicate tool names.
					</li>
					<li>Commit your changes and open a Pull Request.</li>
				</ol>
				<p className="text-sm text-slate-600 mt-2">
					Schema references: <code>types/schema.ts</code> and{' '}
					<code>types/data.schema.json</code>.
				</p>
			</div>
			<Link to="/indexed-internet" className="block w-fit">
				<div
					className="
            bg-white
            duration-100
            border
            border-gray-200
            shadow
            rounded-lg
            hover:bg-gray-100
            p-5
            mt-12
            flex
            gap-2
            max-w-xs
            text-base
            font-semibold
            leading-tight
            tracking-tight
          "
				>
					<ArrowLeftIcon className="size-5 stroke-2 shrink-0" />
					You can start by opening any category from the navigation
				</div>
			</Link>
		</div>
	)
}

export default App
