import { TFormItem } from '@/types/form.type'

export const formItems: TFormItem[] = [
	{ id: 'name', type: 'input' },
	{ id: 'surname', type: 'input' },
	{
		id: 'attendance',
		type: 'radio',
		options: [
			{ value: 'приду', isDefault: true },
			{ value: 'не приду' },
		],
	},
	{
		id: 'alcohol',
		type: 'checkbox',
		options: [
			{ value: 'Вино' },
			{ value: 'Водка' },
			{ value: 'Коньяк' },
			{ value: 'Не пью', isDefault: true },
		],
	},
	{ id: 'about', type: 'textarea' },
]
