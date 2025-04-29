import { create } from 'zustand'

type LoaderState = {
    progress: number 
    loaded: boolean 
    setProgress: (value: number) => void 
    setLoaded: (value: boolean) => void 
}

const useLoaderStore = create<LoaderState>((set) => ({
    progress: 0,
    loaded: false,
    setProgress: (value: number) => set({ progress: value }), 
    setLoaded: (value: boolean) => set({ loaded: value }), 
}))

export default useLoaderStore
