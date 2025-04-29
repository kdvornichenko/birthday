import useLoaderStore from '@/store/loader.store'
import Heading from './typo/Heading'
import { useEffect } from 'react'

const Loader = () => {
	const { loaded, progress } = useLoaderStore()

	useEffect(() => {
		if (!loaded) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
	}, [loaded])

	return (
		<div
			className={`fixed inset-0 w-screen h-screen bg-stone-50 flex items-center justify-center text-white text-2xl z-50 transition-opacity duration-1000 pointer-events-none ${
				loaded ? 'opacity-0' : 'opacity-100'
			}`}
		>
			<Heading text={`Loading ${progress}%`} className='!leading-loose' />
		</div>
	)
}

export default Loader
