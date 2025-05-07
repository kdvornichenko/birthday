'use client'

import React, {
	FormEvent,
	forwardRef,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { RadioGroup, Radio } from '@nextui-org/radio'
import { Button } from '@nextui-org/button'
import { cn } from '@nextui-org/theme'
import { Input, Textarea } from '@nextui-org/input'
import { CheckboxGroup, Checkbox } from '@nextui-org/checkbox'
import { Heart } from './icons/IconHeart'
import DOMPurify from 'dompurify'
import axios from 'axios'
import useFormState from '@/store/form.store'
import { formItems } from '@/data/form.data'
import ReactInputMask from 'react-input-mask'
import { SparkleFx } from '@/lib/SparkleFx'

type TForm = {
	className?: string
}

interface IFormData {
	name: string
	surname: string
	radios: Record<string, string>
	checkboxValues: Record<string, string[]>
	about?: string
}

const Form = forwardRef<HTMLFormElement, TForm>(({ className }, ref) => {
	const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false)
	const buttonRef = useRef<HTMLButtonElement>(null)

	const sanitizeInput = (input: string) => DOMPurify.sanitize(input)

	const [phone, setPhone] = useState<string>('')
	const [checkboxValues, setCheckboxValues] = useState<string[]>([
		'alcohol-nope',
	])
	const [selectedRadios, setSelectedRadios] = useState<Record<string, string>>(
		{}
	)
	const labelClassNames = useMemo(
		() => 'text-slate-950 text-2xl lg:text-3xl mb-3 after:content-[""]',
		[]
	)
	const inputClassNames = useMemo(
		() => 'border-slate-950 data-[hover=true]:border-slate-950/50',
		[]
	)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const {
		setShowFormModal,
		setFormSended,
		setIsSending,
		isSending,
		willBeAttended,
		setWillBeAttended,
		setFormError,
	} = useFormState()

	const allergiesRef = useRef<HTMLTextAreaElement>(null)
	const coupleNameRef = useRef<HTMLInputElement>(null)
	const inputNameRef = useRef<HTMLInputElement>(null)
	const inputSurnameRef = useRef<HTMLInputElement>(null)
	const inputTelegramRef = useRef<HTMLInputElement>(null)
	const aboutRef = useRef<HTMLTextAreaElement>(null)

	const onFormSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (validateForm()) {
			// Функция для получения текста радио по выбранному значению
			const getRadioText = (groupId: string, value: string): string => {
				const group = formItems.find(item => item.id === groupId)
				if (group?.type === 'radio' && group.options) {
					// Убираем префикс groupId- перед сравнением
					const cleanedValue = value.replace(`${groupId}-`, '')
					const option = group.options.find(opt => opt.value === cleanedValue)
					return option?.text || ''
				}
				return ''
			}

			// Функция для получения текста чекбоксов по значениям
			const getCheckboxTexts = (values: string[]): Record<string, string[]> => {
				// Группируем результаты по id каждой группы чекбоксов
				const groupedCheckboxValues: Record<string, string[]> = {}

				formItems
					.filter(item => item.type === 'checkbox') // Обрабатываем только чекбокс-группы
					.forEach(checkboxGroup => {
						if (checkboxGroup.options) {
							// Находим значения, относящиеся к текущей группе
							const groupValues = values
								.map(value => {
									const option = checkboxGroup.options?.find(
										opt => `${checkboxGroup.id}-${opt.value}` === value
									)
									return option?.text || ''
								})
								.filter(Boolean) // Убираем пустые значения

							// Если есть значения, добавляем их в результирующий объект
							if (groupValues.length > 0) {
								groupedCheckboxValues[checkboxGroup.id] = groupValues
							}
						}
					})

				return groupedCheckboxValues
			}

			// Собираем данные формы
			const formData = {
				name: sanitizeInput(inputNameRef.current?.value || ''),
				surname: sanitizeInput(inputSurnameRef.current?.value || ''),
				radios: Object.keys(selectedRadios).reduce((acc, groupId) => {
					acc[groupId] = getRadioText(groupId, selectedRadios[groupId])
					return acc
				}, {} as Record<string, string>),
				checkboxValues: getCheckboxTexts(checkboxValues),
				about: sanitizeInput(aboutRef.current?.value || ''),
			}

			await sendToTelegram(formData)
		}
	}

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!selectedRadios['attendance']) {
			newErrors['attendance'] = 'Выберите один из вариантов'
		}

		if (!checkboxValues.length) {
			newErrors['alcohol'] = 'Выберите хотя бы один напиток'
		}

		if (!sanitizeInput(inputNameRef.current?.value || '').trim().length) {
			newErrors['name'] = 'Заполните Имя'
		}
		if (!sanitizeInput(inputSurnameRef.current?.value || '').trim().length) {
			newErrors['surname'] = 'Заполните Фамилию'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const sendToTelegram = async (formData: IFormData) => {
		const botToken = process.env.NEXT_PUBLIC_TG_API
		const chatId = process.env.NEXT_PUBLIC_CHAT_API
		const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

		const message = !willBeAttended
			? `${formData.name} ${formData.surname} не придет`
			: `ФИО: ${formData.name} ${formData.surname}
				Присутствие: ${formData.radios.attendance || 'Не указано'}
				Алкоголь: ${
					formData.checkboxValues['alcohol']?.length
						? formData.checkboxValues['alcohol'].join(', ')
						: 'Не выбрано'
				}
				Дополнительная информация: ${formData.about || 'Нет'}
			`

		// Отправка сообщения
		try {
			setIsSending(true)
			await axios.post(apiUrl, {
				chat_id: chatId,
				text: message,
				parse_mode: 'HTML',
			})
			setFormSended(true)
			setShowFormModal(true)
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorMessage =
					`Сообщение: ${error.message}\nОписание: ${error.response?.data?.description}` ||
					'Произошла ошибка при отправке формы'
				console.error('Ошибка при отправке в Telegram:', error)
				setFormError(errorMessage)
			} else {
				console.error('Неизвестная ошибка:', error)
				setFormError('Неизвестная ошибка. Пожалуйста, попробуйте снова.')
			}
			setFormSended(false)
			setShowFormModal(true)
		} finally {
			setIsSending(false)
		}
	}

	const handleCheckboxChange = (value: string) => {
		setCheckboxValues(prevValues => {
			if (value === 'alcohol-nope') {
				return ['alcohol-nope']
			} else if (prevValues.includes(value)) {
				return prevValues.filter(v => v !== value)
			} else {
				return [...prevValues.filter(v => v !== 'alcohol-nope'), value]
			}
		})
	}

	const handleRadioChange = (groupId: string, value: string) => {
		if (value === 'attendance-nope') {
			setWillBeAttended(false)
		} else {
			setWillBeAttended(true)
		}

		setSelectedRadios(prevState => ({
			...prevState,
			[groupId]: value,
		}))
	}

	const isDisabled = (itemId: string) => {
		if (
			itemId !== 'attendance' &&
			itemId !== 'name' &&
			itemId !== 'surname' &&
			!willBeAttended
		) {
			return true
		}
		return false
	}

	useEffect(() => {
		const defaultRadios: Record<string, string> = {}
		formItems.forEach(item => {
			if (item.type === 'radio' && item.options) {
				const defaultOption = item.options.find(option => option.isDefault)
				if (defaultOption) {
					defaultRadios[item.id] = defaultOption.value
				}
			}
		})
		setSelectedRadios(defaultRadios)
	}, [])

	useEffect(() => {
		if (!buttonRef.current) return

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsButtonVisible(entry.isIntersecting)
			},
			{
				root: null,
				threshold: 0,
			}
		)

		observer.observe(buttonRef.current)

		return () => {
			observer.disconnect()
		}
	}, [])

	return (
		<form
			ref={ref}
			onSubmit={onFormSubmit}
			className={`${
				className ?? ''
			} flex flex-col gap-y-10 font-gyre-mono will-change-transform `}
		>
			{formItems.map(item => {
				if (item.type === 'radio') {
					return (
						<div key={`group-${item.label}-wrapper`}>
							<RadioGroup
								key={`group-${item.label}`}
								label={item.label}
								classNames={{
									label: cn(
										labelClassNames,
										`${isDisabled(item.id) ? 'opacity-50' : 'opacity-100'}`,
										errors[item.id] ? 'text-red-500' : ''
									),
								}}
								defaultValue={
									item.id +
									'-' +
									item.options?.find(option => option.isDefault)?.value
								}
								isRequired
								isDisabled={isDisabled(item.id)}
								onValueChange={value => handleRadioChange(item.id, value)}
							>
								{item.options?.map(option => (
									<Radio
										key={`radio-${item.label}-${option.value}`}
										classNames={{
											wrapper: cn(
												'group-data-[selected=true]:border-slate-950'
											),
											control: cn(
												'group-data-[selected=true]:bg-[url("/img/heart.svg")] bg-transparent bg-contain bg-no-repeat bg-center w-2.5 h-2.5 rounded-none'
											),
											label: cn('text-xl'),
										}}
										value={`${item.id}-${option.value}`}
									>
										{option.text}
									</Radio>
								))}
							</RadioGroup>

							{selectedRadios[item.id] === 'attendance-couple' && (
								<Input
									ref={coupleNameRef}
									key={`input-couple-name`}
									type='text'
									variant='underlined'
									label='Имя и Фамилия Вашей половинки'
									placeholder=''
									size='lg'
									isRequired
									isDisabled={isDisabled(item.id)}
									classNames={{
										inputWrapper: ` ${
											errors[item.id] ? 'border-red-500' : inputClassNames
										}`,
										input: 'text-xl',
										label: 'text-lg after:content-[""]',
									}}
								/>
							)}

							{selectedRadios[item.id] === 'allergies-yeap' && (
								<Textarea
									ref={allergiesRef}
									key={`input-allergies`}
									type='text'
									variant='bordered'
									placeholder='Напишите ваши аллергены, чтобы мы могли исключить их из состава блюд'
									size='lg'
									isRequired
									isDisabled={isDisabled(item.id)}
									classNames={{
										inputWrapper: `transition-all mt-4 lg:mt-6 ${
											errors[item.id] ? 'border-red-500' : inputClassNames
										}`,
										input: 'text-xl',
										label: 'text-lg after:content-[""]',
									}}
								/>
							)}
						</div>
					)
				}

				if (item.type === 'input') {
					if (item.id === 'phone') {
						return (
							<ReactInputMask
								mask='+7 (999) 999-99-99'
								value={phone}
								onChange={e => setPhone(e.target.value)}
								key={`input-${item.label}`}
							>
								{inputProps => (
									<Input
										{...inputProps}
										label='Номер телефона'
										variant='underlined'
										size='lg'
										isRequired={!isDisabled(item.id)}
										isDisabled={isDisabled(item.id)}
										classNames={{
											inputWrapper: `transition-all ${
												errors['phone'] ? 'border-red-500' : inputClassNames
											}`,
											input: 'text-xl',
											label: 'text-lg after:content-[""]',
										}}
									/>
								)}
							</ReactInputMask>
						)
					} else if (item.id === 'telegram') {
						return (
							<Input
								ref={inputTelegramRef}
								key={`input-${item.label}`}
								type='text'
								variant='underlined'
								label={item.label}
								placeholder=''
								size='lg'
								isDisabled={isDisabled(item.id)}
								startContent='@'
								classNames={{
									inputWrapper: `transition-all ${
										errors[item.id] ? 'border-red-500' : inputClassNames
									}`,
									input: 'text-xl data-[has-start-content=true]:ps-0',
									label: 'text-lg after:content-[""]',
								}}
							/>
						)
					} else
						return (
							<Input
								ref={
									item.id === 'name'
										? inputNameRef
										: item.id === 'surname'
										? inputSurnameRef
										: null
								}
								key={`input-${item.label}`}
								type='text'
								variant='underlined'
								label={item.label}
								placeholder=''
								size='lg'
								isRequired
								isDisabled={isDisabled(item.id)}
								classNames={{
									inputWrapper: `transition-all ${
										errors[item.id] ? 'border-red-500' : inputClassNames
									}`,
									input: 'text-xl',
									label: 'text-lg after:content-[""]',
								}}
							/>
						)
				}

				if (item.type === 'checkbox') {
					return (
						<CheckboxGroup
							key={`group-${item.label}`}
							label={item.label}
							classNames={{
								label: cn(
									labelClassNames,
									`${isDisabled(item.id) ? 'opacity-50' : 'opacity-100'}`,
									errors[item.id] ? 'text-red-500' : ''
								),
							}}
							defaultValue={item.options
								?.filter(option => option.isDefault)
								.map(option => option.value)}
							value={checkboxValues}
							isRequired
							isDisabled={isDisabled(item.id)}
						>
							{item.options?.map((option, index) => (
								<Checkbox
									key={`checkbox-${item.label}-${index}`}
									classNames={{
										wrapper: cn(
											'group-data-[selected=true]:border-slate-950 after:bg-slate-950'
										),
										label: cn('text-xl'),
									}}
									icon={<Heart color='#DDDDDC' />}
									value={`${item.id}-${option.value}`}
									onChange={() =>
										handleCheckboxChange(`${item.id}-${option.value}`)
									}
								>
									{option.text}
								</Checkbox>
							))}
						</CheckboxGroup>
					)
				}

				if (item.id === 'about') {
					return (
						<Textarea
							ref={aboutRef}
							key={`textarea-about`}
							type='text'
							variant='bordered'
							size='lg'
							placeholder={item.label}
							isDisabled={isDisabled(item.id)}
							classNames={{
								inputWrapper: `transition-all mt-4 lg:mt-6 ${
									errors[item.id] ? 'border-red-500' : inputClassNames
								}`,
								input: 'text-xl',
								label: 'text-lg after:content-[""]',
							}}
						/>
					)
				}
			})}
			<div>
				{Object.keys(errors).length > 0 && (
					<div className='text-red-500 text-xl'>
						<p>Форма заполнена не полностью:</p>
						<ul>
							{Object.values(errors).map((error, index) => (
								<li key={index}>- {error}</li>
							))}
						</ul>
					</div>
				)}
				<SparkleFx speed='fast' count={50} trigger={isButtonVisible}>
					<Button
						className='font-gyre-mono text-2xl bg-slate-950 text-zinc-200 py-6 w-full mt-4 relative z-10'
						variant='faded'
						type='submit'
						isLoading={isSending}
						ref={buttonRef}
					>
						Отправить
					</Button>
				</SparkleFx>
			</div>
		</form>
	)
})

Form.displayName = 'Form'

export default Form
