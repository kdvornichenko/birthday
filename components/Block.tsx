import React, { ReactNode } from 'react'

type Props = {
	children: ReactNode
	className?: string
	grid?: boolean
}

const Block = ({ children, className, grid }: Props) => {
	return (
		<div
			className={`h-full min-h-screen max-w-7xl mx-auto px-4 ${
				className || ''
			} ${
				grid
					? 'grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-x-2 lg:gap-x-10 items-center'
					: ''
			}`}
		>
			{children}
		</div>
	)
}

export default Block
