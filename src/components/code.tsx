export default function Code(props: React.HTMLAttributes<HTMLElement>) {
	const { className = '', ...rest } = props
	return (
		<code
			className={`bg-slate-100 rounded ring-1 ring-slate-300 px-1 py-0.5 inline-block ${className}`}
			{...rest}
		/>
	)
}
