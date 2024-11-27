import { TIcon } from "@/types/icon.type"
import { forwardRef } from "react"

export const Heart = forwardRef<SVGSVGElement, TIcon>(({ className }, ref) => {
	return (
		<svg
			width='512'
			height='512'
			x='0'
			y='0'
			viewBox='0 0 391.837 391.837'
			className={className}
			ref={ref}
		>
			<g>
				<path
					d='M285.257 35.528c58.743.286 106.294 47.836 106.58 106.58 0 107.624-195.918 214.204-195.918 214.204S0 248.165 0 142.108c0-58.862 47.717-106.58 106.58-106.58a105.534 105.534 0 0 1 89.339 48.065 106.578 106.578 0 0 1 89.338-48.065z'
					fill='#d7443e'
				></path>
			</g>
		</svg>
	)
})

Heart.displayName = 'Heart'
