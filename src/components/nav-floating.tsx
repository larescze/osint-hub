import {
	ChevronUpDownIcon,
	HomeIcon,
	MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { Drawer } from 'vaul'
import type { NavbarCategory } from '../../types/types'
import NavLink from './nav-link'
import { useState } from 'react'
import { GitHubIcon } from './nav-sidebar'
import { useLocation } from 'react-router-dom'

export default function NavFloating(props: { categories: NavbarCategory[] }) {
	const [open, setOpen] = useState(false)
	const location = useLocation()
	const category = [
		...props.categories,
		{
			name: 'Home',
			path: '/',
			icon: HomeIcon,
		},
	].find((category) => category.path === location.pathname)

	return (
		<nav
			className="
        fixed
        bottom-8
        left-1/2
        -translate-x-1/2
        w-auto
        h-[50px]
        bg-black
        rounded-full
        flex
        text-white
        items-center
        lg:hidden
        shadow-xl
        z-30
      "
		>
			{/* Search button */}
			{/* <button>
        <MagnifyingGlassIcon className="size-5 box-content pl-5 pr-4" />
      </button>
      <div className="w-[1px] h-1/2 bg-white/40"></div> */}

			<Drawer.Root open={open} onOpenChange={setOpen}>
				<Drawer.Trigger className="w-auto flex items-center gap-2 justify-center px-5">
					{category?.icon && <category.icon className="size-5" />}
					{category?.name && (
						<span className="leading-none mt-[1.5px] ml-[-2px] whitespace-nowrap">
							{category.name}
						</span>
					)}
					<ChevronUpDownIcon className="size-5 opacity-50" />
				</Drawer.Trigger>
				<Drawer.Portal>
					<Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
					<Drawer.Content className="bg-[black] flex flex-col rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none z-50">
						<Drawer.Title hidden className="font-medium mb-4 text-gray-900">
							Navigation
						</Drawer.Title>
						<div className="py-4 bg-[#111111] text-white rounded-t-[10px] flex-1">
							<div
								aria-hidden
								className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8"
							/>
							<NavLink
								href="/"
								icon={HomeIcon}
								className="mb-6"
								onClick={() => setTimeout(() => setOpen(false), 100)}
							>
								Home
							</NavLink>
							<div className="px-9 text-white/60 text-base pb-2 mb-2 border-b border-white/20">
								Categories
							</div>
							{props.categories.map((category) => (
								<NavLink
									key={category.path}
									href={category.path}
									icon={category.icon}
									onClick={() => setTimeout(() => setOpen(false), 100)}
								>
									{category.name}
								</NavLink>
							))}
							<div className="h-[1px] my-3 bg-white/20 w-full" />
							<NavLink
								href="https://github.com/larescze/osint-hub"
								icon={GitHubIcon}
								className="mb-4"
							>
								Contribute on GitHub
							</NavLink>
						</div>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		</nav>
	)
}
