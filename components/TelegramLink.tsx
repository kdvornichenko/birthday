import Link from 'next/link'
import React, { FC, useMemo } from 'react'

type TTelegramLink = {
	person: 'k' | 'v' | 'a'
}

const TelegramLink: FC<TTelegramLink> = ({ person }) => {
	const personLink = useMemo(() => {
		return person === 'k'
			? 'mercyyy813'
			: person === 'v'
			? 'Weikaaa'
			: 'anna_rassskazova'
	}, [person])

	return (
		<Link
			className='text-sky-600 underline underline-offset-8'
			href={`https://t.me/${personLink}`}
			target='_blank'
		>
			@{personLink}
		</Link>
	)
}

export default TelegramLink
