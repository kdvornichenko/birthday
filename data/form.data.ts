import { TFormItem } from '@/types/form.type'

export const formItems: TFormItem[] = [
	{ id: 'name', type: 'input', label: 'Имя' },
	{ id: 'surname', type: 'input', label: 'Фамилия' },
	{
		id: 'attendance',
		type: 'radio',
		label: 'Придете?',
		options: [
			{ value: 'solo', text: 'Приду', isDefault: true },
			{ value: 'nope', text: 'Не приду :(' },
		],
	},
	{
		id: 'alcohol',
		type: 'checkbox',
		label: 'Алкоголь?',
		options: [
			{ value: 'red', text: 'Красное' },
			{ value: 'white', text: 'Белое' },
			{ value: 'vodka', text: 'Водка' },
			{ value: 'cognac', text: 'Коньяк' },
			{ value: 'nope', text: 'Не пью', isDefault: true },
		],
	},
	{
		id: 'about',
		type: 'textarea',
		label: 'Что-то еще? (не обязательно)',
	},
]