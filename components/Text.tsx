import { forwardRef, ReactNode } from 'react'

type Props = {
	className?: string
	children: ReactNode
}

const Text = forwardRef<HTMLHeadingElement, Props>(
	({ className, children }, ref) => {
		return (
			<div
				ref={ref}
				className={`flex flex-col gap-y-4 lg:gap-y-8 ${className || ''}`}
			>
				{children}
			</div>
		)
	}
)

Text.displayName = 'Text'

export default Text
