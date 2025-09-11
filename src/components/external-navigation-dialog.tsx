import {
	ArrowTopRightOnSquareIcon,
	ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
import * as Dialog from '@radix-ui/react-dialog'
import * as Switch from '@radix-ui/react-switch'
import { useEffect, useState } from 'react'

export default function ExternalNavigationModal(props: {
	trigger: React.ReactNode
	href: string
}) {
	const COOKIE_NAME = 'oh_skip_external_warning'

	const readCookie = (name: string): string | null => {
		if (typeof document === 'undefined') return null
		const value = `; ${document.cookie}`
		const parts = value.split(`; ${name}=`)
		if (parts.length === 2) return parts.pop()?.split(';').shift() || null
		return null
	}

	const setCookie = (
		name: string,
		value: string,
		maxAgeSeconds: number,
	): void => {
		if (typeof document === 'undefined') return
		document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`
	}

	const deleteCookie = (name: string): void => {
		if (typeof document === 'undefined') return
		document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`
	}

	const [isOpen, setIsOpen] = useState(false)
	const [skipWarning, setSkipWarning] = useState(false)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const stored = readCookie(COOKIE_NAME)
		setSkipWarning(stored === '1')
	}, [])

	const handleOpenChange = (next: boolean) => {
		if (next) {
			// Evaluate cookie at click-time to ensure immediate effect across instances
			const cookieSaysSkip = readCookie(COOKIE_NAME) === '1'
			if (skipWarning || cookieSaysSkip) {
				if (typeof window !== 'undefined') {
					window.open(props.href, '_blank', 'noopener,noreferrer')
				}
				setIsOpen(false)
				return
			}
			setIsOpen(true)
		} else {
			setIsOpen(false)
		}
	}

	const handleTriggerClick = (): void => {
		// Evaluate cookie at click-time to ensure immediate effect across instances
		const cookieSaysSkip = readCookie(COOKIE_NAME) === '1'
		if (skipWarning || cookieSaysSkip) {
			if (typeof window !== 'undefined') {
				window.open(props.href, '_blank', 'noopener,noreferrer')
			}
			setIsOpen(false)
			return
		}
		setIsOpen(true)
	}

	const handleSkipToggle = (checked: boolean) => {
		setSkipWarning(checked)
		if (checked) {
			// 1 year
			setCookie(COOKIE_NAME, '1', 60 * 60 * 24 * 365)
		} else {
			deleteCookie(COOKIE_NAME)
		}
	}

	return (
		<Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
			<div
				role="button"
				tabIndex={0}
				onClick={handleTriggerClick}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						handleTriggerClick()
					}
				}}
			>
				{props.trigger}
			</div>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/40 z-20" />
				<Dialog.Content className="absolute w-[460px] overflow-hidden max-w-[95vw] bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg z-30">
					<div className="p-6">
						<Dialog.Title className="text-xl font-semibold mb-4 flex items-center gap-2">
							<ShieldExclamationIcon className="size-6 stroke-2" />
							<span>Warning: Leaving OSINT Hub</span>
						</Dialog.Title>
						<div className="text-black opacity-80 space-y-3 leading-[1.3]">
							<p>
								Remember that some links listed on OSINT Hub may lead to content
								that could be harmful, offensive or illegal.
							</p>
						</div>
						<div className="mt-6 flex max-sm:flex-col items-center justify-end gap-2">
							<Dialog.Close asChild>
								<button
									type="button"
									className="max-sm:w-full px-3 py-2 leading-[1.2] text-sm rounded border border-[#111111]/90 text-[#111111]/90 font-medium hover:bg-black/5 duration-100"
								>
									Stay on OSINT Hub
								</button>
							</Dialog.Close>
							<Dialog.Close asChild>
								<a
									href={props.href}
									target="_blank"
									rel="noopener noreferrer"
									className="max-sm:w-full max-sm:justify-center px-3 py-2 text-sm rounded bg-[#111111]/90 text-white hover:bg-[#111111] flex items-center gap-2"
								>
									<span>Continue to external site</span>
									<ArrowTopRightOnSquareIcon className="size-4" />
								</a>
							</Dialog.Close>
						</div>
					</div>
					<div className="px-6 py-3 bg-gray-50 border-t-[1px] border-gray-200 text-sm text-black/80 flex items-center gap-2">
						<span>Skip (disable) this warning next time</span>
						<Switch.Root
							className="SwitchRoot"
							checked={skipWarning}
							onCheckedChange={handleSkipToggle}
						>
							<Switch.Thumb className="SwitchThumb" />
						</Switch.Root>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
