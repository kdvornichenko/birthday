'use client'

import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import Block from '@/components/Block'
import Map from '@/components/Map/Map'
import Text from '@/components/Text'
import Heading from '@/components/typo/Heading'
import Paragraph from '@/components/typo/Paragraph'
import '../styles/global.scss'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import Loader from '@/components/Loader'
import SlideShow from '@/components/SlideShow'
import useSlideShowStore from '@/store/slideShow.store'
import LetterFx from '@/lib/LetterFX'
import { Finger } from '@/components/icons/IconFinger'
import Form from '@/components/Form'
import FormModal from '@/components/FormModal'
import useFormState from '@/store/form.store'
import Link from 'next/link'
import { Heart } from '@/components/icons/IconHeart'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
	const [isMapLoaded, setIsMapLoaded] = useState(false)
	const { isSlideShowComplete } = useSlideShowStore()
	const { showFormModal } = useFormState()
	const screenRefs = useRef<
		Record<
			number,
			{
				heading?: HTMLElement
				text?: HTMLElement
				image?: HTMLElement
				map?: HTMLElement
				plan?: HTMLElement
				block?: HTMLElement
				form?: HTMLElement
			}
		>
	>({})

	const containerRef = useRef<HTMLDivElement>(null)
	const addressRef = useRef<HTMLAnchorElement>(null)
	const fingerRef = useRef<SVGSVGElement>(null)
	const letterFxTriggerRef1 = useRef<() => void>()
	const letterFxTriggerRef2 = useRef<() => void>()
	const letterFxTriggerRef3 = useRef<() => void>()
	const letterFxTriggerRef4 = useRef<() => void>()
	const letterFxTriggerRef5 = useRef<() => void>()
	const letterFxTriggerRef6 = useRef<() => void>()
	const lenis = useLenis()

	const refFunctions = useRef<Record<string, (el: HTMLElement | null) => void>>(
		{}
	)

	// Универсальная функция для получения функции рефа
	const getRefFunction = useCallback(
		(
			index: number,
			type: 'heading' | 'text' | 'image' | 'map' | 'plan' | 'block' | 'form'
		) => {
			const key = `${index}-${type}`
			if (!refFunctions.current[key]) {
				refFunctions.current[key] = (el: HTMLElement | null) => {
					if (!el) return
					if (!screenRefs.current[index]) {
						screenRefs.current[index] = {}
					}
					screenRefs.current[index][type] = el
				}
			}
			return refFunctions.current[key]
		},
		[]
	)

	useLayoutEffect(() => {
		setIsMapLoaded(true)

		const age = screenRefs.current[4]?.text

		if (age) {
			ScrollTrigger.create({
				trigger: age,
				start: 'bottom bottom',
				onEnter: () => {
					const letters = [letterFxTriggerRef5, letterFxTriggerRef6]

					letters.forEach(item => {
						item.current?.()
					})
				},
				once: true,
			})
		}

		const textElement = screenRefs.current[2]?.text

		if (textElement) {
			ScrollTrigger.create({
				trigger: textElement,
				start: 'bottom bottom',
				onEnter: () => {
					const letters = [
						letterFxTriggerRef1,
						letterFxTriggerRef2,
						letterFxTriggerRef3,
						letterFxTriggerRef4,
					]

					letters.forEach(item => {
						item.current?.()
					})
				},
				once: true,
			})
		}

		if (addressRef && fingerRef) {
			ScrollTrigger.create({
				trigger: addressRef.current,
				start: 'top 60%',
				markers: false,
				onEnter: () => {
					gsap
						.timeline()
						.to(
							addressRef.current,
							{
								borderColor: 'rgb(2 6 23 / 1)',
								duration: 1,
								ease: 'power1.inOut',
							},
							'>'
						)
						.to(
							fingerRef.current,
							{
								opacity: 1,
								delay: 0.5,
								y: '-50%',
								duration: 0.5,
								ease: 'power1.inOut',
							},
							'>'
						)
						.to(
							[addressRef.current, fingerRef.current],
							{
								scale: 0.98,
								duration: 0.2,
							},
							'>'
						)
						.to(
							[addressRef.current, fingerRef.current],
							{
								scale: 1,
								duration: 0.2,
							},
							'>'
						)
						.to(fingerRef.current, {
							duration: 1,
							y: '-4px',
						})
				},
				once: true,
			})
		}

		// Настройка ResizeObserver
		const observer = new ResizeObserver(() => {
			window.dispatchEvent(new Event('resize', { bubbles: true }))
		})

		if (containerRef.current) {
			observer.observe(containerRef.current)
		}

		return () => {
			observer.disconnect()
			ScrollTrigger.killAll() // Удаляем триггер при размонтировании
		}
	}, [])

	useEffect(() => {
		const animateElement = (element: HTMLElement | undefined) => {
			if (!element) return
			gsap.fromTo(
				element,
				{ opacity: 0 },
				{
					opacity: 1,
					scrollTrigger: {
						markers: false,
						trigger: element,
						start: 'top bottom',
						end: 'top +=50%',
						scrub: true,
					},
				}
			)

			const mm = gsap.matchMedia()
			const breakPoint = 1024

			mm.add(
				{
					isDesktop: `(min-width: ${breakPoint}px)`,
					isMobile: `(max-width: ${breakPoint - 1}px)`,
				},
				({ isDesktop }) => {
					gsap.fromTo(
						element,
						{ y: isDesktop ? 100 : '5vh' },
						{
							y: isDesktop ? -100 : '-5vh',
							scrollTrigger: {
								markers: false,
								trigger: element,
								start: 'top bottom',
								scrub: true,
							},
						}
					)
				}
			)
		}

		Object.entries(screenRefs.current).forEach(([, refs]) => {
			if (!refs) return

			animateElement(refs.heading)
			animateElement(refs.text)
			animateElement(refs.image)
			animateElement(refs.map)
			animateElement(refs.plan)
			animateElement(refs.block)
			animateElement(refs.form)
		})
	}, [isMapLoaded])

	useEffect(() => {
		if (!isSlideShowComplete || lenis?.scroll >= 20) return

		lenis?.scrollTo(window.innerHeight / 1.5, {
			duration: 1.5,
			easing: (t: number) => Math.min(1, Math.sqrt(1 - Math.pow(t - 1, 2))),
		})
	}, [lenis, isSlideShowComplete])

	useEffect(() => {
		if (showFormModal) {
			lenis?.stop()
		} else {
			lenis?.start()
		}
	}, [showFormModal, lenis])

	return (
		<ReactLenis
			root
			options={{ syncTouch: true, smoothWheel: true, touchMultiplier: 0 }}
		>
			<Loader />

			<FormModal />

			<div ref={containerRef} className='relative bg-stone-50 z-10 '>
				<div className='relative z-20'>
					<SlideShow totalImages={3} />

					{/* Начало */}
					<Block className='py-10 items-center flex'>
						<Text className='py-10 xl:py-20'>
							<Heading text='Что?' ref={getRefFunction(1, 'heading')} />
							<Paragraph ref={getRefFunction(1, 'text')}>
								Никогда такого не было и вот опять! Начиная аж с 1975 и каждый
								следующий год, в одну и ту же дату, происходит событие, которое
								всем нам так хорошо известно - День Рождения!
								<br />
								<br />
								Но в этот раз не шуточки, не хухры-мухры, дело серьезное,
								серьезнее некуда!
							</Paragraph>
						</Text>
					</Block>

					{/* Начало */}
					<Block className='py-10 items-center flex justify-center'>
						<Text className='py-10 xl:py-20 w-fit'>
							<div
								className='text-[256px] bg-clip-text bg-[length:60px_60px] bg-repeat bg-slate-950/80 bg-[url("/img/pattern-50.png")] text-transparent'
								ref={getRefFunction(4, 'text')}
							>
								<span>
									<LetterFx
										speed='slow'
										trigger='custom'
										duration={2000}
										initialText='0'
										finalText='5'
										onTrigger={triggerFn5 => {
											letterFxTriggerRef5.current = triggerFn5
										}}
										charset={['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']}
									/>

									<LetterFx
										speed='slow'
										trigger='custom'
										duration={1500}
										initialText='0'
										finalText='0'
										charset={['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']}
										onTrigger={triggerFn6 => {
											letterFxTriggerRef6.current = triggerFn6
										}}
									/>
								</span>
							</div>
						</Text>
					</Block>

					{/* Когда? */}
					<Block className='flex items-center justify-center'>
						<Text>
							<Heading
								text='Когда?'
								ref={getRefFunction(2, 'heading')}
								className='text-center'
							/>
							<Paragraph
								customSize
								className='text-center text-4xl md:text-5xl whitespace-nowrap'
								ref={getRefFunction(2, 'text')}
							>
								<span>
									<LetterFx
										speed='slow'
										trigger='custom'
										duration={2500}
										initialText='0'
										finalText='2'
										onTrigger={triggerFn1 => {
											letterFxTriggerRef1.current = triggerFn1
										}}
									/>

									<LetterFx
										speed='slow'
										trigger='custom'
										duration={2000}
										initialText='0'
										finalText='4'
										onTrigger={triggerFn2 => {
											letterFxTriggerRef2.current = triggerFn2
										}}
									/>
								</span>
								<span>
									.
									<LetterFx
										speed='slow'
										trigger='custom'
										duration={1500}
										initialText='0'
										finalText='0'
										onTrigger={triggerFn3 => {
											letterFxTriggerRef3.current = triggerFn3
										}}
									/>
									<LetterFx
										speed='slow'
										trigger='custom'
										duration={1000}
										initialText='0'
										finalText='5'
										onTrigger={triggerFn4 => {
											letterFxTriggerRef4.current = triggerFn4
										}}
									/>
									.2025
								</span>
								<span className='block text-center text-4xl md:text-5xl whitespace-nowrap mt-10'>
									Ровно в 15:00
								</span>
							</Paragraph>
						</Text>
					</Block>

					{/* Где? */}
					<Block className='flex flex-col justify-center min-h-screen py-20'>
						<Text>
							<Heading text='Где?' ref={getRefFunction(3, 'heading')} />
							<Paragraph ref={getRefFunction(3, 'text')} className='opacity-0'>
								Зыряновск (Алтай, кому как), ресторан &quot;Эдельвейс&quot;
								<br />
								<span className='font-semibold'>
									Адрес:
									<a
										href='https://yandex.ru/maps/29492/altay/?ll=84.262912%2C49.714914&mode=poi&poi%5Bpoint%5D=84.263075%2C49.715063&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D55227339221&z=18'
										target='_blank'
										ref={addressRef}
										className=' border px-1 pb-1 border-slate-950/0 rounded-md relative inline-block translate-y-0.5  will-change-transform'
									>
										ул. Тохтарова 2 (хотя все и так знают)
										<Finger
											ref={fingerRef}
											className='absolute w-8 h-8 end-4 top-full translate-y-1/2 opacity-0 will-change-transform'
										/>
									</a>
									<br />
								</span>
							</Paragraph>
							<Map
								className='opacity-0 w-full portrait:h-[60vh] h-[50vh] rounded-3xl overflow-hidden mt-10 will-change-transform'
								ref={getRefFunction(3, 'map')}
							/>
						</Text>
					</Block>

					{/* Анкета */}
					<Block className='flex flex-col justify-center'>
						<Heading
							text='А теперь к главному'
							ref={getRefFunction(10, 'heading')}
						/>

						<Form ref={getRefFunction(10, 'form')} className='mt-4 lg:mt-20' />
					</Block>
					<footer className='flex w-full lg:justify-end p-4 lg:p-10 bg-slate-950'>
						<div className='font-gyre-mono text-zinc-50 text-sm lg:text-base'>
							<Link
								href='https://github.com/kdvornichenko'
								target='_blank'
								className='underline underline-offset-4 hover:text-zinc-300 transition-colors'
							>
								kdvornichenko
							</Link>{' '}
							from{' '}
							<Link
								href='https://its.agency'
								target='_blank'
								className='underline underline-offset-4 hover:text-zinc-300 transition-colors'
							>
								its.agency
							</Link>{' '}
							with <Heart className='size-3.5 inline-flex lg:size-4' />
						</div>
					</footer>
				</div>
				<div className='inset-0 pointer-events-none absolute z-10'>
					<div className='w-full h-full bg-[length:128px_128px] bg-repeat bg-[url("/img/pattern.png")] opacity-15'></div>
				</div>
			</div>
		</ReactLenis>
	)
}
