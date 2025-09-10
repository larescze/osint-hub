import PageLayout from '../components/page-layout'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
	return (
		<PageLayout title="Page not found" subtitle="We couldn't find this page.">
			<div className="space-y-4">
				<p className="text-gray-600" style={{ color: '#111111' }}>
					The page you are looking for does not exist.
				</p>
				<Link to="/" className="inline-block">
					<span className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm">
						Go to homepage
					</span>
				</Link>
			</div>
		</PageLayout>
	)
}
