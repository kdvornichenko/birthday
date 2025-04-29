// components/Countdown.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody } from '@heroui/card'

interface TimeLeft {
	days: number
	hours: number
	minutes: number
	seconds: number
}

const calculateTimeLeft = (): TimeLeft => {
	const target = new Date('2025-06-11T16:00:00')
	const now = new Date()
	const diff = target.getTime() - now.getTime()

	if (diff <= 0) {
		return { days: 0, hours: 0, minutes: 0, seconds: 0 }
	}

	return {
		days: Math.floor(diff / (1000 * 60 * 60 * 24)),
		hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
		minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
		seconds: Math.floor((diff % (1000 * 60)) / 1000),
	}
}

const Countdown = () => {
	const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

	useEffect(() => {
		const timerId = setInterval(() => {
			setTimeLeft(calculateTimeLeft())
		}, 1000)
		return () => clearInterval(timerId)
	}, [])

	return (
		<Card
			className='mx-auto p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
			shadow='md'
			radius='lg'
		>
			<CardHeader className='text-2xl lg:text-5xl font-medium flex justify-center'>
				До свадебки осталось
			</CardHeader>
			<CardBody>
				<div className='mt-5 flex justify-between gap-x-5'>
					{[
						{ label: 'Дни', value: timeLeft.days },
						{ label: 'Часы', value: timeLeft.hours },
						{ label: 'Минуты', value: timeLeft.minutes },
						{ label: 'Секунды', value: timeLeft.seconds },
					].map(({ label, value }) => (
						<div
							key={label}
							className='flex flex-col justify-center items-center'
						>
							<div className='text-4xl lg:text-8xl'>
								{value.toString().padStart(2, '0')}
							</div>
							<div className='mt-2 text-lg lg:text-2xl'>{label}</div>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	)
}

export default Countdown
