import React, { forwardRef, ReactNode } from 'react'
import Paragraph from './typo/Paragraph'

type TPlanItem = {
	className?: string
	children?: ReactNode
	time: string
	text: string
}

const PlanItem = forwardRef<HTMLDivElement, TPlanItem>(
	({ children, className, time, text }, ref) => {
		return (
			<div
				className={`${className || ''} flex items-center gap-x-4 lg:gap-x-10`}
				ref={ref}
			>
				<div className='size-24 lg:size-32 flex-shrink-0'>
					{children}
				</div>

				<Paragraph>
					{time}
					&nbsp;&mdash; <br className='block sm:hidden' />
					{text}
				</Paragraph>
			</div>
		)
	}
)

PlanItem.displayName = 'PlanItem'

export default PlanItem
