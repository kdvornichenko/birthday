'use client'

import React, { useState, useRef, useMemo, useEffect, forwardRef, useCallback } from 'react'
import classNames from 'classnames'

const defaultAllowedCharacters = [
	'2',
	'@',
	'$',
	'4',
	'6',
	'8',
	'9',
	'0',
	'3',
	'#',
	'?',
	'5',
	'0',
	'1',
	'9',
]

function getRandomCharacter(charset: string[]): string {
	const randomIndex = Math.floor(Math.random() * charset.length)
	return charset[randomIndex]
}

function createEventHandler(
	initialText: string,
	finalText: string,
	setText: React.Dispatch<React.SetStateAction<string>>,
	setInProgress: React.Dispatch<React.SetStateAction<boolean>>,
	getInProgress: () => boolean,
	speed: 'fast' | 'medium' | 'slow',
	charset: string[],
	setHasAnimated?: React.Dispatch<React.SetStateAction<boolean>>,
	duration?: number
) {
	const speedSettings = {
		fast: { BASE_DELAY: 10, REVEAL_DELAY: 10, INITIAL_RANDOM_DURATION: 100 },
		medium: { BASE_DELAY: 30, REVEAL_DELAY: 30, INITIAL_RANDOM_DURATION: 300 },
		slow: {
			BASE_DELAY: 30,
			REVEAL_DELAY: 60,
			INITIAL_RANDOM_DURATION: duration || 1000,
		},
	}

	const { BASE_DELAY, REVEAL_DELAY, INITIAL_RANDOM_DURATION } =
		speedSettings[speed]

	const generateRandomText = () =>
		finalText
			.split('')
			.map(char => (char === ' ' ? ' ' : getRandomCharacter(charset)))
			.join('')

	return async () => {
		if (getInProgress()) return

		setInProgress(true)

		let randomizedText = generateRandomText()
		const endTime = Date.now() + INITIAL_RANDOM_DURATION

		// Фаза случайных символов
		while (Date.now() < endTime) {
			setText(randomizedText)
			await new Promise(resolve => setTimeout(resolve, BASE_DELAY))
			randomizedText = generateRandomText()
		}

		// Фаза раскрытия
		for (let i = 0; i < finalText.length; i++) {
			await new Promise(resolve => setTimeout(resolve, REVEAL_DELAY))
			setText(
				`${finalText.substring(0, i + 1)}${randomizedText.substring(i + 1)}`
			)
		}

		setInProgress(false)
		if (setHasAnimated) {
			setHasAnimated(true)
		}
	}
}

type LetterFxProps = {
	initialText: string // Начальный текст
	finalText: string // Финальный текст
	trigger?: 'hover' | 'instant' | 'custom'
	speed?: 'fast' | 'medium' | 'slow'
	charset?: string[]
	onTrigger?: (triggerFn: () => void) => void
	className?: string
	style?: React.CSSProperties
	duration?: number
}

const LetterFx = forwardRef<HTMLSpanElement, LetterFxProps>(
	(
		{
			initialText,
			finalText,
			trigger = 'hover',
			speed = 'medium',
			charset = defaultAllowedCharacters,
			onTrigger,
			className,
			style,
			duration,
		},
		ref
	) => {
		const [text, setText] = useState<string>(initialText)
		const [inProgress, setInProgress] = useState<boolean>(false)
		const inProgressRef = useRef<boolean>(false)
		const [hasAnimated, setHasAnimated] = useState<boolean>(false)

		// Обновляем inProgressRef при изменении inProgress
		useEffect(() => {
			inProgressRef.current = inProgress
		}, [inProgress])

		const getInProgress = useCallback(() => inProgressRef.current, [])

		const eventHandler = useMemo(
			() =>
				createEventHandler(
					initialText,
					finalText,
					setText,
					setInProgress,
					getInProgress,
					speed,
					charset,
					trigger === 'instant' ? setHasAnimated : undefined,
					duration
				),
			[initialText, finalText, trigger, speed, charset, duration, getInProgress]
		)

		// Инициализируем текст и запускаем анимацию при необходимости
		useEffect(() => {
			if (!hasAnimated) {
				setText(initialText)

				if (trigger === 'instant') {
					eventHandler()
				}
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [initialText, trigger])

		// Передаем eventHandler через onTrigger
		useEffect(() => {
			if (trigger === 'custom' && onTrigger) {
				onTrigger(eventHandler)
			}
		}, [trigger, onTrigger, eventHandler])

		return (
			<span
				ref={ref}
				className={classNames(className)}
				style={style}
				onMouseOver={trigger === 'hover' ? eventHandler : undefined}
			>
				{text}
			</span>
		)
	}
)

LetterFx.displayName = 'LetterFx'

export default LetterFx
