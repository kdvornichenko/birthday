import { create } from 'zustand'

type SlideShowState = {
    isSlideShowComplete: boolean
    setIsSlideShowComplete: (value: boolean) => void
}

const useSlideShowStore = create<SlideShowState>((set) => ({
    isSlideShowComplete: false,
    setIsSlideShowComplete: (value: boolean) => set({ isSlideShowComplete: value }),
}))

export default useSlideShowStore
