'use client'

import React, {
	FormEvent,
	forwardRef,
	useEffect,
	useRef,
	useState,
} from 'react'
import { RadioGroup, Radio } from '@nextui-org/radio'
import { CheckboxGroup, Checkbox } from '@nextui-org/checkbox'
import { Input, Textarea } from '@nextui-org/input'
import { cn } from '@nextui-org/theme'
import ReactInputMask from 'react-input-mask'
import DOMPurify from 'dompurify'
import axios from 'axios'

import { SparkleFx } from '@/lib/SparkleFx'
import { Translations, useTranslation } from '@/lib/i18n'
import { formItems } from '@/data/form.data'
import useFormState from '@/store/form.store'
import { Button } from '@nextui-org/button'

type TForm = {
	className?: string
}

interface IFormData {
	name: string
	surname: string
	phone: string
	telegram?: string
	coupleName?: string
	allergies?: string
	radios: Record<string, string>
	checkboxValues: Record<string, string[]>
	about?: string
}

const Form = forwardRef<HTMLFormElement, TForm>(({ className }, ref) => {
	const { t } = useTranslation()
	const form = t('form') as Translations['RU']['form']

	const {
		setShowFormModal,
		setFormSended,
		setIsSending,
		isSending,
		willBeAttended,
		setWillBeAttended,
		setFormError,
	} = useFormState()

	const [phone, setPhone] = useState('')
	const [checkboxValues, setCheckboxValues] = useState<string[]>([
		'alcohol-Не пью',
	])
	const [selectedRadios, setSelectedRadios] = useState<Record<string, string>>(
		{}
	)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [isButtonVisible, setIsButtonVisible] = useState(false)

	const buttonRef = useRef<HTMLButtonElement>(null)
	const inputNameRef = useRef<HTMLInputElement>(null)
	const inputSurnameRef = useRef<HTMLInputElement>(null)
	const inputTelegramRef = useRef<HTMLInputElement>(null)
	const coupleNameRef = useRef<HTMLInputElement>(null)
	const allergiesRef = useRef<HTMLTextAreaElement>(null)
	const aboutRef = useRef<HTMLTextAreaElement>(null)

	const sanitizeInput = (input: string) => DOMPurify.sanitize(input)

	const inputClassNames =
		'border-slate-950 data-[hover=true]:border-slate-950/50'
	const labelClassNames =
		'text-slate-950 text-2xl lg:text-3xl mb-3 after:content-[""]'

	useEffect(() => {
		const defaults: Record<string, string> = {}
		formItems.forEach(item => {
			if (item.type === 'radio' && item.options) {
				const defaultOption = item.options.find(opt => opt.isDefault)
				if (defaultOption) {
					defaults[item.id] = defaultOption.value
				}
			}
		})
		setSelectedRadios(defaults)
	}, [])

	useEffect(() => {
		if (!buttonRef.current) return
		const observer = new IntersectionObserver(
			([entry]) => setIsButtonVisible(entry.isIntersecting),
			{ threshold: 0 }
		)
		observer.observe(buttonRef.current)
		return () => observer.disconnect()
	}, [])

	const getItemLabel = (itemId: string) => {
		const item = form.items[itemId]
		return typeof item === 'string' ? item : item?.label
	}

	const isDisabled = (itemId: string) => {
		return (
			itemId !== 'attendance' &&
			itemId !== 'name' &&
			itemId !== 'surname' &&
			!willBeAttended
		)
	}

	const handleCheckboxChange = (value: string) => {
		setCheckboxValues(prev => {
			if (value === 'alcohol-Не пью') {
				return ['alcohol-Не пью']
			} else if (prev.includes(value)) {
				return prev.filter(v => v !== value)
			} else {
				return [...prev.filter(v => v !== 'alcohol-Не пью'), value]
			}
		})
	}

	const handleRadioChange = (groupId: string, value: string) => {
		if (groupId === 'attendance') {
			setWillBeAttended(value !== 'attendance-не приду')
		}
		setSelectedRadios(prev => ({ ...prev, [groupId]: value }))
	}

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!selectedRadios['attendance'])
			newErrors['attendance'] = form.fieldErrors.attendance
		if (!checkboxValues.length) newErrors['alcohol'] = form.fieldErrors.alcohol
		if (!inputNameRef.current?.value?.trim())
			newErrors['name'] = form.fieldErrors.name
		if (!inputSurnameRef.current?.value?.trim())
			newErrors['surname'] = form.fieldErrors.surname

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const getItemOptionLabel = (itemId: string, optionValue: string) => {
		const item = form.items[itemId]
		if (typeof item !== 'string') {
			return item.options?.[optionValue] ?? ''
		}
		return ''
	}

	const getCheckboxTexts = (values: string[]): Record<string, string[]> => {
		const groupedCheckboxValues: Record<string, string[]> = {}
		formItems
			.filter(item => item.type === 'checkbox')
			.forEach(group => {
				if (group.options) {
					const groupValues = values
						.filter(val => val.startsWith(`${group.id}-`))
						.map(val => val.replace(`${group.id}-`, ''))
					if (groupValues.length > 0) {
						groupedCheckboxValues[group.id] = groupValues
					}
				}
			})
		return groupedCheckboxValues
	}

	const sendToTelegram = async (formData: IFormData) => {
		const botToken = process.env.NEXT_PUBLIC_TG_API
		const chatId = process.env.NEXT_PUBLIC_CHAT_API
		const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

		const message = !willBeAttended
			? `${formData.name} ${formData.surname} не придет`
			: `Анкета гостя:
ФИО: ${formData.name} ${formData.surname}
Присутствие: ${formData.radios.attendance || 'Не указано'}
Алкоголь: ${
					formData.checkboxValues['alcohol']?.length
						? formData.checkboxValues['alcohol'].join(', ')
						: 'Не выбрано'
			  }
Дополнительная информация: ${formData.about || 'Нет'}`

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
			console.error('Ошибка при отправке:', error)
			setFormError('Ошибка отправки в Telegram')
			setFormSended(false)
			setShowFormModal(true)
		} finally {
			setIsSending(false)
		}
	}

	const onFormSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (validateForm()) {
			const formData: IFormData = {
				name: sanitizeInput(inputNameRef.current?.value || ''),
				surname: sanitizeInput(inputSurnameRef.current?.value || ''),
				phone: sanitizeInput(phone),
				telegram: sanitizeInput(inputTelegramRef.current?.value || ''),
				coupleName: sanitizeInput(coupleNameRef.current?.value || ''),
				allergies: sanitizeInput(allergiesRef.current?.value || ''),
				about: sanitizeInput(aboutRef.current?.value || ''),
				radios: selectedRadios,
				checkboxValues: getCheckboxTexts(checkboxValues),
			}
			await sendToTelegram(formData)
		}
	}

	return (
		<form
			ref={ref}
			onSubmit={onFormSubmit}
			className={cn(className, 'flex flex-col gap-y-10 font-gyre-mono')}
		>
			{formItems.map(item => {
				if (item.type === 'radio') {
					return (
						<div key={item.id}>
							<RadioGroup
								label={getItemLabel(item.id)}
								isDisabled={isDisabled(item.id)}
								classNames={{
									label: cn(
										labelClassNames,
										isDisabled(item.id) && 'opacity-50',
										errors[item.id] && 'text-red-500'
									),
								}}
								defaultValue={`${item.id}-${
									item.options?.find(opt => opt.isDefault)?.value
								}`}
								onValueChange={value => handleRadioChange(item.id, value)}
							>
								{item.options?.map(opt => (
									<Radio
										key={opt.value}
										value={`${item.id}-${opt.value}`}
										classNames={{
											wrapper: 'group-data-[selected=true]:border-slate-950',
											label: 'text-xl',
										}}
									>
										{getItemOptionLabel(item.id, opt.value)}
									</Radio>
								))}
							</RadioGroup>

							{item.id === 'allergies' &&
								selectedRadios['allergies'] === 'allergies-yeap' && (
									<Textarea
										ref={allergiesRef}
										variant='bordered'
										placeholder={
											typeof form.items['allergies'] === 'object'
												? form.items['allergies'].textarea ?? ''
												: ''
										}
										isRequired
										isDisabled={isDisabled('allergies')}
										classNames={{
											inputWrapper: cn(
												'transition-all mt-4 lg:mt-6',
												errors['allergies'] && 'border-red-500',
												inputClassNames
											),
											input: 'text-xl',
											label: 'text-lg after:content-[""]',
										}}
									/>
								)}
						</div>
					)
				}

				if (item.type === 'checkbox') {
					return (
						<CheckboxGroup
							key={item.id}
							label={getItemLabel(item.id)}
							value={checkboxValues}
							isDisabled={isDisabled(item.id)}
							classNames={{
								label: cn(
									labelClassNames,
									isDisabled(item.id) && 'opacity-50',
									errors[item.id] && 'text-red-500'
								),
							}}
						>
							{item.options?.map(opt => (
								<Checkbox
									key={opt.value}
									value={`${item.id}-${opt.value}`}
									onChange={() =>
										handleCheckboxChange(`${item.id}-${opt.value}`)
									}
									classNames={{
										wrapper: 'group-data-[selected=true]:border-slate-950',
										label: 'text-xl',
									}}
								>
									{getItemOptionLabel(item.id, opt.value)}
								</Checkbox>
							))}
						</CheckboxGroup>
					)
				}

				if (item.type === 'input') {
					const inputRef =
						item.id === 'name'
							? inputNameRef
							: item.id === 'surname'
							? inputSurnameRef
							: item.id === 'telegram'
							? inputTelegramRef
							: undefined

					if (item.id === 'phone') {
						return (
							<ReactInputMask
								key={item.id}
								mask='+7 (999) 999-99-99'
								value={phone}
								onChange={e => setPhone(e.target.value)}
							>
								{props => (
									<Input
										{...props}
										label={form.items[item.id]}
										variant='underlined'
										isRequired
										isDisabled={isDisabled(item.id)}
										classNames={{
											inputWrapper: cn(
												'transition-all',
												errors[item.id] && 'border-red-500',
												inputClassNames
											),
											input: 'text-xl',
											label: 'text-lg after:content-[""]',
										}}
									/>
								)}
							</ReactInputMask>
						)
					}

					return (
						<Input
							key={item.id}
							ref={inputRef}
							label={getItemLabel(item.id)}
							variant='underlined'
							isRequired
							isDisabled={isDisabled(item.id)}
							startContent={item.id === 'telegram' && '@'}
							classNames={{
								inputWrapper: cn(
									'transition-all',
									errors[item.id] && 'border-red-500',
									inputClassNames
								),
								input: 'text-xl data-[has-start-content=true]:ps-0',
								label: 'text-lg after:content-[""]',
							}}
						/>
					)
				}

				if (item.type === 'textarea') {
					return (
						<Textarea
							key={item.id}
							ref={item.id === 'about' ? aboutRef : undefined}
							placeholder={getItemLabel(item.id)}
							variant='bordered'
							isDisabled={isDisabled(item.id)}
							classNames={{
								inputWrapper: cn(
									'transition-all mt-4 lg:mt-6',
									errors[item.id] && 'border-red-500',
									inputClassNames
								),
								input: 'text-xl',
								label: 'text-lg after:content-[""]',
							}}
						/>
					)
				}

				return null
			})}

			{Object.keys(errors).length > 0 && (
				<div className='text-red-500 text-xl'>
					<p>{form.errorsTitle}</p>
					<ul>
						{Object.keys(errors).map(key => (
							<li key={key}>- {form.fieldErrors[key]}</li>
						))}
					</ul>
				</div>
			)}

			<SparkleFx
				className='w-fit'
				speed='fast'
				count={50}
				trigger={isButtonVisible}
			>
				<Button
					className='font-gyre-mono text-2xl bg-slate-950 text-zinc-200 py-6 w-full mt-4 relative z-10'
					variant='faded'
					type='submit'
					isLoading={isSending}
					ref={buttonRef}
				>
					{form.sendButton}
				</Button>
			</SparkleFx>
		</form>
	)
})

Form.displayName = 'Form'

export default Form
