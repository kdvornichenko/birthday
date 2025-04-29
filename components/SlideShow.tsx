'use client'

import { useEffect, useMemo, useState, FC } from 'react'
import Image from 'next/image'
import useSlideShowStore from '@/store/slideShow.store'
import useLoaderStore from '@/store/loader.store'

type SlideShowProps = {
	totalImages: number
	interval?: number
}

const SlideShow: FC<SlideShowProps> = ({ totalImages, interval = 1000 }) => {
	const { loaded, setLoaded, setProgress } = useLoaderStore()
	const [currentImage, setCurrentImage] = useState(0)
	const [startSlideshow, setStartSlideshow] = useState(false)
	const [isLocalComplete, setIsLocalComplete] = useState(false)
	const [isPortrait, setIsPortrait] = useState(false) // Определяем ориентацию
	const { setIsSlideShowComplete } = useSlideShowStore()

	// Генерируем URL для изображений
	const landscapeUrls = useMemo(
		() =>
			Array.from(
				{ length: totalImages },
				(_, i) => `/img/slide_show/landscape/loader-${i + 1}.jpg`
			),
		[totalImages]
	)
	const portraitUrls = useMemo(
		() =>
			Array.from(
				{ length: totalImages },
				(_, i) => `/img/slide_show/portrait/loader-${i + 1}.jpg`
			),
		[totalImages]
	)

	// Активный набор изображений в зависимости от ориентации
	const imageUrls = isPortrait ? portraitUrls : landscapeUrls

	// Определяем текущую ориентацию экрана
	useEffect(() => {
		const updateOrientation = () => {
			setIsPortrait(window.matchMedia('(orientation: portrait)').matches)
		}

		updateOrientation() // Устанавливаем начальное значение
		window.addEventListener('resize', updateOrientation)

		return () => window.removeEventListener('resize', updateOrientation)
	}, [])

	// Предзагрузка изображений с отслеживанием прогресса
	useEffect(() => {
		let loadedCount = 0

		const preloadImages = async () => {
			await Promise.all(
				imageUrls.map(src => {
					return new Promise<void>(resolve => {
						const img = new globalThis.Image()
						img.src = src
						img.onload = () => {
							loadedCount++
							setProgress(Math.round((loadedCount / totalImages) * 100))
							if (loadedCount === totalImages) {
								setLoaded(true) // Все изображения загружены
							}
							resolve()
						}
						img.onerror = () => {
							loadedCount++
							setProgress(Math.round((loadedCount / totalImages) * 100))
							if (loadedCount === totalImages) {
								setLoaded(true)
							}
							resolve()
						}
					})
				})
			)
		}

		preloadImages()
	}, [imageUrls, setProgress, setLoaded, totalImages])

	// Задержка перед началом слайдшоу
	useEffect(() => {
		if (!loaded) return

		const delayTimer = setTimeout(() => {
			setStartSlideshow(true) // Запускаем слайдшоу после задержки
		}, interval / 2)

		return () => clearTimeout(delayTimer)
	}, [loaded, interval])

	// Переключение изображений после загрузки
	useEffect(() => {
		if (!startSlideshow) return

		const intervalId = setInterval(() => {
			setCurrentImage(prev => {
				const nextImage = prev + 1
				if (nextImage >= totalImages) {
					clearInterval(intervalId) // Останавливаем слайдшоу
					setIsLocalComplete(true) // Локально отмечаем завершение
					return prev // Остаёмся на последнем изображении
				}
				return nextImage
			})
		}, interval)

		return () => clearInterval(intervalId)
	}, [startSlideshow, interval, totalImages])

	// Обновляем глобальное состояние завершения
	useEffect(() => {
		if (isLocalComplete) {
			setIsSlideShowComplete(true)
		}
	}, [isLocalComplete, setIsSlideShowComplete])

	return (
		<div
			className={`relative w-full h-svh duration-1000 delay-500 ${
				loaded ? 'opacity-100' : 'opacity-0'
			}`}
		>
			{loaded &&
				imageUrls.map((src, index) => (
					<Image
						key={src}
						src={src}
						alt={`SlideShow ${index + 1}`}
						fill
						sizes='100vw'
						className={`absolute inset-0 object-cover object-center grayscale w-full h-full transition-opacity duration-500 ${
							index === currentImage ? 'block' : 'hidden'
						}`}
						priority
					/>
				))}
		</div>
	)
}

export default SlideShow
