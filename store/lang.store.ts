import { create } from 'zustand'

type Lang = 'RU' | 'EN'

interface LangState {
    lang: Lang
    setLang: (lang: Lang) => void
}

export const useLangStore = create<LangState>(set => ({
    lang: 'RU',
    setLang: (lang: Lang) => set({ lang }),
}))
