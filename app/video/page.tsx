'use client'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'
import {
	FiPlay,
	FiPause,
	FiVolume,
	FiVolumeX,
	FiMaximize,
	FiMinimize,
	FiDownload,
} from 'react-icons/fi'

interface VideoState {
	isPlaying: boolean
	progress: number
	volume: number
	isMuted: boolean
	duration: number
	currentTime: number
	isFullScreen: boolean
	isLoading: boolean
	isBuffering: boolean
	showControls: boolean
	hasError: boolean
	isReady: boolean
}

const Video: React.FC = () => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	const [state, setState] = useState<VideoState>({
		isPlaying: false,
		progress: 0,
		volume: 1,
		isMuted: false,
		duration: 0,
		currentTime: 0,
		isFullScreen: false,
		isLoading: true,
		isBuffering: false,
		showControls: false,
		hasError: false,
		isReady: false,
	})

	// Обработчики для управления
	const handleMouseMove = () => {
		if (!state.hasError) {
			setState(prev => ({ ...prev, showControls: true }))
			resetControlTimeout()
		}
	}

	const resetControlTimeout = () => {
		if (controlTimeoutRef.current) clearTimeout(controlTimeoutRef.current)

		controlTimeoutRef.current = setTimeout(() => {
			if (state.isPlaying) {
				setState(prev => ({
					...prev,
					showControls: false,
				}))
			}
		}, 1000)
	}

	const controlTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	// Инициализация видео
	useEffect(() => {
		const video = videoRef.current

		if (!video) return

		// Добавлены дополнительные обработчики событий
		const handleLoadedMetadata = () => {
			console.log('Metadata loaded')
			setState(prev => ({
				...prev,
				duration: video.duration || 0,
				isLoading: false,
				isReady: true,
			}))
		}

		const handleCanPlay = () => {
			console.log('Can play')
			setState(prev => ({ ...prev, isReady: true }))
		}

		const handleWaiting = () => {
			console.log('Buffering started')
			setState(prev => ({ ...prev, isBuffering: true }))
		}

		const handlePlaying = () => {
			console.log('Video playing')
			setState(prev => ({ ...prev, isBuffering: false }))
		}

		const handleError = () => {
			console.error('Video error:', video.error)
			setState(prev => ({
				...prev,
				isLoading: false,
				hasError: true,
				isReady: false,
			}))
		}

		const handleProgress = () => {
			if (video.duration && !isNaN(video.duration)) {
				console.log('Progress update')
				setState(prev => ({
					...prev,
					progress: (video.currentTime / video.duration) * 100,
					currentTime: video.currentTime,
				}))
			}
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === 'f') {
				toggleFullscreen()
			}
		}

		if (video.readyState >= 1) {
			handleLoadedMetadata()
		}

		// Подписка на события
		video.addEventListener('loadedmetadata', handleLoadedMetadata)
		video.addEventListener('canplay', handleCanPlay)
		video.addEventListener('waiting', handleWaiting)
		video.addEventListener('playing', handlePlaying)
		video.addEventListener('error', handleError)
		video.addEventListener('timeupdate', handleProgress)
		video.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('keydown', handleKeyDown)
		document.addEventListener('fullscreenchange', handleFullscreenChange)

		return () => {
			video.removeEventListener('loadedmetadata', handleLoadedMetadata)
			video.removeEventListener('canplay', handleCanPlay)
			video.removeEventListener('waiting', handleWaiting)
			video.removeEventListener('playing', handlePlaying)
			video.removeEventListener('error', handleError)
			video.removeEventListener('timeupdate', handleProgress)
			video.removeEventListener('mousemove', handleMouseMove)

			document.removeEventListener('fullscreenchange', handleFullscreenChange)
			document.removeEventListener('keydown', handleKeyDown)

			if (controlTimeoutRef.current) clearTimeout(controlTimeoutRef.current)
		}
	}, [])

	// Форматирование времени
	const formatTime = (time: number): string => {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
	}

	// Переключение воспроизведения
	const togglePlay = () => {
		const video = videoRef.current
		if (!video || state.hasError || !state.isReady) return

		if (state.isPlaying) {
			video.pause()
			setState(prev => ({ ...prev, isPlaying: false, showControls: true }))
		} else {
			video
				.play()
				.then(() => {
					resetControlTimeout()
				})
				.catch(err => {
					console.error('Error playing video:', err)
					setState(prev => ({ ...prev, hasError: true, isLoading: false }))
				})

			setState(prev => ({ ...prev, isPlaying: true }))
		}
	}

	// Перемотка видео
	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const video = videoRef.current
		const progressContainer = e.currentTarget
		if (
			!video ||
			!video.duration ||
			!progressContainer ||
			state.hasError ||
			!state.isReady
		)
			return

		const rect = progressContainer.getBoundingClientRect()
		const clickPosition = (e.clientX - rect.left) / rect.width
		video.currentTime = clickPosition * video.duration

		setState(prev => ({
			...prev,
			progress: clickPosition * 100,
			currentTime: clickPosition * video.duration,
		}))
	}

	// Обработка ошибок загрузки видео
	const handleVideoError = () => {
		setState(prev => ({
			...prev,
			isLoading: false,
			hasError: true,
			isReady: false,
		}))
	}

	const toggleFullscreen = () => {
		const container = containerRef.current
		if (!container) return

		if (!document.fullscreenElement) {
			container.requestFullscreen().catch(err => {
				console.error('Fullscreen error:', err.message)
			})
		} else {
			document.exitFullscreen()
		}
	}

	const handleFullscreenChange = () => {
		setState(prev => ({
			...prev,
			isFullScreen: !!document.fullscreenElement,
		}))
	}

	// Рендеринг
	return (
		<div className='max-w-7xl mx-auto p-4'>
			<div
				ref={containerRef}
				className={cn(
					'relative bg-black rounded-lg overflow-hidden shadow-xl group',
					state.isPlaying && !state.showControls && 'cursor-none'
				)}
				onMouseMove={handleMouseMove}
				onMouseEnter={() => {
					if (!state.hasError && state.isReady) {
						setState(prev => ({ ...prev, showControls: true }))
					}
				}}
				onMouseLeave={() => {
					if (state.isPlaying && !state.hasError && state.isReady) {
						setState(prev => ({ ...prev, showControls: false }))
					}
				}}
			>
				{/* Видео */}
				<video
					ref={videoRef}
					src='/birthday.mp4'
					className={cn('w-full h-auto select-none')}
					muted={state.isMuted}
					onEnded={() => setState(prev => ({ ...prev, isPlaying: false }))}
					onError={handleVideoError}
					onClick={togglePlay}
					onDoubleClick={toggleFullscreen}
					autoPlay={false}
					preload='metadata'
					poster='/img/poster.jpg'
				/>

				{/* Сообщение об ошибке */}
				{state.hasError && (
					<div className='absolute inset-0 flex items-center justify-center bg-black/50 z-10'>
						<div className='text-white text-center p-4'>
							<svg
								className='w-12 h-12 mx-auto mb-2 text-red-500'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
									clipRule='evenodd'
								/>
							</svg>
							<p className='text-lg font-semibold mb-1'>
								Ошибка загрузки видео
							</p>
							<p className='text-sm text-gray-300'>
								Проверьте наличие файла и его доступность
							</p>
						</div>
					</div>
				)}

				{/* Индикатор загрузки */}
				{state.isLoading && !state.hasError && (
					<div className='absolute inset-0 flex items-center justify-center bg-black/50 z-10'>
						<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
					</div>
				)}

				{/* Индикатор буферизации */}
				{state.isBuffering && !state.hasError && (
					<div className='absolute inset-0 flex items-center justify-center bg-black/50 z-10'>
						<div className='animate-pulse flex space-x-2'>
							<div className='h-2 w-2 bg-blue-500 rounded-full'></div>
							<div className='h-2 w-2 bg-blue-500 rounded-full'></div>
							<div className='h-2 w-2 bg-blue-500 rounded-full'></div>
						</div>
					</div>
				)}

				{/* Кастомные элементы управления */}
				<div
					className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity duration-300 ${
						state.showControls && !state.hasError && state.isReady
							? 'opacity-100'
							: 'opacity-0'
					}`}
					onMouseEnter={() => {
						if (!state.hasError && state.isReady) {
							setState(prev => ({ ...prev, showControls: true }))
						}
					}}
					onMouseLeave={() => {
						if (state.isPlaying && !state.hasError && state.isReady) {
							setState(prev => ({ ...prev, showControls: false }))
						}
					}}
				>
					<div
						className='progress-container relative h-2 bg-gray-700 rounded-full cursor-pointer group-hover:h-3 transition-all duration-200'
						onClick={handleProgressClick}
					>
						<div
							className='absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-100'
							style={{ width: `${state.progress}%` }}
						></div>
						<div
							className='absolute top-1/2 h-4 w-4 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
							style={{ left: `${state.progress}%` }}
						></div>
					</div>

					<div className='flex items-center justify-between mt-3'>
						<div className='flex items-center space-x-2'>
							<button
								onClick={togglePlay}
								className='text-white hover:text-blue-400 transition-colors focus:outline-none rounded-full p-1 disabled:opacity-50'
								aria-label={state.isPlaying ? 'Pause' : 'Play'}
								disabled={state.hasError || !state.isReady}
							>
								{state.isPlaying ? (
									<FiPause className='w-8 h-8' />
								) : (
									<FiPlay className='w-8 h-8' />
								)}
							</button>

							<div className='text-white text-sm'>
								{formatTime(state.currentTime)} / {formatTime(state.duration)}
							</div>

							<div className='relative flex items-center'>
								<button
									onClick={() => {
										if (!state.hasError && state.isReady) {
											setState(prev => ({ ...prev, isMuted: !prev.isMuted }))
										}
									}}
									className='text-white hover:text-blue-400 transition-colors focus:outline-none rounded-full p-1 disabled:opacity-50'
									aria-label={state.isMuted ? 'Unmute' : 'Mute'}
									disabled={state.hasError || !state.isReady}
								>
									{state.isMuted ? (
										<FiVolumeX className='w-6 h-6' />
									) : (
										<FiVolume className='w-6 h-6' />
									)}
								</button>
								<div className='relative ml-1 w-24 h-4 flex items-center group'>
									{/* Прогресс-полоса — фон */}
									<div
										className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-1/2 left-0 w-full h-1 rounded-full bg-gray-300 -translate-y-1/2`}
									/>

									{/* Прогресс-полоса — активная часть */}
									<div
										className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-1/2 left-0 h-1 rounded-full bg-blue-500 -translate-y-1/2 ${
											state.hasError || !state.isReady ? 'hidden' : ''
										}`}
										style={{ width: `${state.volume * 100}%` }}
									/>

									{/* Слайдер */}
									<input
										type='range'
										min='0'
										max='1'
										step='0.01'
										value={state.volume}
										onChange={e => {
											const newVolume = parseFloat(e.target.value)
											setState(prev => ({
												...prev,
												volume: newVolume,
												isMuted: newVolume === 0,
											}))

											const video = videoRef.current
											if (video && !state.hasError && state.isReady) {
												video.volume = newVolume
											}
										}}
										className={`w-full h-4 bg-transparent appearance-none z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 ${
											state.hasError || !state.isReady ? 'hidden' : ''
										}`}
										disabled={state.hasError || !state.isReady}
									/>
								</div>
							</div>
						</div>

						<div className='flex items-center space-x-3'>
							<a
								href='/birthday.mp4'
								download
								className='text-white hover:text-blue-400 transition-colors focus:outline-none rounded-full p-1'
								aria-label='Download Video'
							>
								<FiDownload className='w-6 h-6' />
							</a>

							<button
								onClick={toggleFullscreen}
								className='text-white hover:text-blue-400 transition-colors focus:outline-none rounded-full p-1 disabled:opacity-50'
								aria-label={
									state.isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'
								}
								disabled={state.hasError || !state.isReady}
							>
								{state.isFullScreen ? (
									<FiMinimize className='w-6 h-6' />
								) : (
									<FiMaximize className='w-6 h-6' />
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Video
