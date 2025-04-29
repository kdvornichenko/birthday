import { forwardRef, ReactNode } from 'react'

type Props = {
	children?: ReactNode
	className?: string
	customSize?: boolean
}

const Paragraph = forwardRef<HTMLParagraphElement, Props>(
	({ children, className, customSize }, ref) => {
		if (!children) return null

		return (
			<p
				ref={ref} // Передаем ref в элемент <p>
				className={`font-gyre-mono will-change-transform ${className || ''} ${
					customSize || 'text-2xl sm:text-3xl'
				}`}
			>
				{children}
			</p>
		)
	}
)

Paragraph.displayName = 'Paragraph'

export default Paragraph
