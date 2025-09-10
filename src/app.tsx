import type React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import IndexedInternet from './pages/indexed-internet'
import ArchivedWebPage from './pages/archived-web'
import NetworkDevicesPage from './pages/network-devices'
import DarkWebPage from './pages/dark-web'
import SocialNetworksPage from './pages/social-networks'
import MixedPage from './pages/mixed'
import SearchEnginesPage from './pages/search-engines'
import DomainsIpsPage from './pages/domains-ips'
import { useSectionData } from './hooks/useSectionData'
import {
	ArchiveBoxIcon,
	ArrowLeftIcon,
	CloudIcon,
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
import NotFoundPage from './pages/not-found'
import Code from './components/code'

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
		name: 'Network devices',
		path: '/network-devices',
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
		name: 'Domains & IPs',
		path: '/domains-ips',
		icon: CloudIcon,
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
						<Route path="/network-devices" element={<NetworkDevicesPage />} />
						<Route path="/dark-web" element={<DarkWebPage />} />
						<Route path="/social-networks" element={<SocialNetworksPage />} />
						<Route path="/search-engines" element={<SearchEnginesPage />} />
						<Route path="/domains-ips" element={<DomainsIpsPage />} />
						<Route path="/mixed" element={<MixedPage />} />
						<Route path="*" element={<NotFoundPage />} />
					</Routes>
				</main>
			</div>
		</>
	)
}

// Special component for the home page showing all tools
function Home() {
	const { loading, error } = useSectionData('indexed_internet')

	if (loading) return <div className="p-6">Loading...</div>
	if (error) return <div className="p-6 text-red-500">Error: {error}</div>

	return (
		<div className="p-24 max-lg:px-16 max-lg:py-20 max-md:px-9 max-md:pt-9 max-md:pb-28 max-sm:px-6 max-w-5xl">
			<h1 className="text-4xl font-bold mb-6 tracking-tight">
				OSINT Hub Homepage
			</h1>
			<p className="mb-6">
				Welcome to the open website, which presents a comparative analysis of
				OSINT tools and services for data collection and analysis. The resources
				are organized into 9 categories, with options to filter individual tools
				by their functionality. Since this field is constantly evolving, we
				welcome your contributions to help us keep the catalog up to date.
			</p>
			<h2 className="text-2xl font-bold mb-2">About</h2>
			<p className="mb-6">
				The results of the comparative analysis are part of the research paper
				entitled “Comparative analysis of OSINT tools, techniques, and legal
				aspects”, which is currently under review in the journal Computers &
				Security.
			</p>
			<h2 className="text-2xl font-bold mb-2 mt-6">Contributing</h2>
			<div className="mb-6">
				<p>
					The repository can be accessed at{' '}
					<a
						href="https://github.com/larescze/osint-hub"
						className="font-medium underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://github.com/larescze/osint-hub
					</a>
					. Contributions are welcome. You can edit the relevant dataset in{' '}
					<Code>public/data</Code> and follow the steps below (see README for
					full details).
				</p>
				<ol className="list-decimal pl-6 mt-2">
					<li>Fork the repository and create a feature branch.</li>{' '}
					<li>
						Update the relevant dataset located in <Code>public/data/</Code> and
						include all required fields. Add any new categories under{' '}
						<Code>meta.categories</Code>.
					</li>{' '}
					<li>
						Run <Code>yarn validate</Code> to check schema compliance, totals,
						undefined/unused categories, and potential duplicate tool names.
					</li>{' '}
					<li>Commit your changes and open a Pull Request</li>
				</ol>
			</div>
			<Link
				to="/indexed-internet"
				className="block w-fit block w-full max-w-5xl"
			>
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
            text-base
            font-semibold
            leading-tight
            tracking-tight
            max-w-5xl
            w-full
          "
				>
					<ArrowLeftIcon className="size-5 stroke-2 shrink-0 max-lg:-rotate-90" />
					You can start by opening any category from the navigation
				</div>
			</Link>
		</div>
	)
}

export default App
