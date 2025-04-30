export type TFormItem = {
    id: string
    type: 'radio' | 'checkbox' | 'input' | 'textarea'
    label: string
    options?: Array<{
        value: string
        text: string
        isDefault?: boolean
        onChange?: (value: string) => void
    }>
}