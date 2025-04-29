import { TFormItem } from '@/types/form.type'

export const formItems: TFormItem[] = [
	{ id: 'name', type: 'input' },
	{ id: 'surname', type: 'input' },
	{
		id: 'attendance',
		type: 'radio',
		options: [
			{ value: 'solo', isDefault: true },
			// { value: 'couple' },
			{ value: 'nope' },
		],
	},
	{
		id: 'transport',
		type: 'radio',
		options: [
			{ value: 'transfer' },
			{ value: 'self', isDefault: true },
		],
	},
	{
		id: 'meal',
		type: 'radio',
		options: [
			{ value: 'beef', isDefault: true },
			{ value: 'fish' },
		],
	},
	{
		id: 'alcohol',
		type: 'checkbox',
		options: [
			{ value: 'red-dry' },
			{ value: 'red-semi-sweet' },
			{ value: 'white-dry' },
			{ value: 'white-semi-sweet' },
			{ value: 'champaign' },
			{ value: 'nope', isDefault: true },
		],
	},
	{
		id: 'allergies',
		type: 'radio',
		options: [
			{ value: 'yeap' },
			{ value: 'nope', isDefault: true },
		],
	},
	{ id: 'phone', type: 'input' },
	{ id: 'telegram', type: 'input' },
	{ id: 'about', type: 'textarea' },
]
