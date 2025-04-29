import { create } from 'zustand'

type FormState = {
    formSended: boolean
    setFormSended: (value: boolean) => void
    showFormModal: boolean
    setShowFormModal: (value: boolean) => void
    isSending: boolean
    setIsSending: (value: boolean) => void
    willBeAttended: boolean
    setWillBeAttended: (value: boolean) => void
    formError: string
    setFormError: (value: string) => void
}

const useFormState = create<FormState>((set) => ({
    formSended: false,
    showFormModal: false,
    isSending: false,
    willBeAttended: true,
    formError: '',
    setFormSended: (value: boolean) => set({ formSended: value }),
    setShowFormModal: (value: boolean) => set({ showFormModal: value }),
    setIsSending: (value: boolean) => set({ isSending: value }),
    setWillBeAttended: (value: boolean) => set({ willBeAttended: value }),
    setFormError: (value: string) => set({
        formError: value
    }),
}))

export default useFormState
