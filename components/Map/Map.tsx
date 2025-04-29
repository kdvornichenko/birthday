import React, {
	forwardRef,
	useRef,
	useEffect,
	useState,
	useCallback,
	useMemo,
} from 'react'
import {
	YMap,
	YMapComponentsProvider,
	YMapDefaultSchemeLayer,
	YMapDefaultFeaturesLayer,
	YMapMarker,
	YMapZoomControl,
	YMapControls,
} from 'ymap3-components'
import MapPin from './MapPin'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
	LngLat,
	VectorCustomization,
	YMap as YMapInstance,
} from '@yandex/ymaps3-types'
import theme from '@/public/customization.json'

type TMap = {
	className?: string
}

gsap.registerPlugin(ScrollTrigger)

const Map = forwardRef<HTMLDivElement, TMap>(({ className }, ref) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [mapInstance, setMapInstance] = useState<YMapInstance | null>(null)
	const api = process.env.NEXT_PUBLIC_YMAPS_API

	const params = useMemo(
		() => ({
			center: [30.314997, 59.938784],
			marker: [29.813082, 60.170556],
			zoom: 8,
			zoomDuration: 1500,
		}),
		[]
	)

	const mapRefCallback = useCallback((instance: YMapInstance | null) => {
		if (instance) {
			setMapInstance(instance)
		}
	}, [])

	useEffect(() => {
		if (!mapInstance) return

		const triggerElement = containerRef.current
		if (!triggerElement) return

		const scrollTriggerInstance = ScrollTrigger.create({
			trigger: triggerElement,
			start: 'top 60%',
			end: 'top 60%',
			markers: false,
			onEnter: () => {
				mapInstance.setLocation({
					center: params.marker as LngLat,
					zoom: 12,
					duration: params.zoomDuration,
					easing: 'ease-in-out',
				})

				setTimeout(() => {
					mapInstance.setLocation({
						center: params.center as LngLat,
						zoom: 8.5,
						duration: params.zoomDuration,
						easing: 'ease-in-out',
					})
				}, params.zoomDuration + 300)
			},
			once: true,
		})

		return () => {
			scrollTriggerInstance.kill()
		}
	}, [mapInstance, params])

	const mergeRefs = useCallback(
		<T,>(...refs: React.Ref<T>[]): React.RefCallback<T> => {
			return value => {
				refs.forEach(ref => {
					if (typeof ref === 'function') {
						ref(value)
					} else if (ref && typeof ref === 'object') {
						;(ref as React.MutableRefObject<T | null>).current = value
					}
				})
			}
		},
		[]
	)

	if (!api) {
		console.error('Yandex Maps API key is missing')
		return <div>Error: Map cannot be loaded without API key.</div>
	}

	return (
		<div className={className ?? ''} ref={mergeRefs(ref, containerRef)}>
			<YMapComponentsProvider apiKey={api} lang='en_US'>
				<YMap ref={mapRefCallback} location={params} mode='vector' theme='dark'>
					<YMapDefaultSchemeLayer
						customization={theme as VectorCustomization}
					/>
					<YMapDefaultFeaturesLayer />
					<YMapMarker coordinates={params.marker as LngLat}>
						<MapPin />
					</YMapMarker>
					<YMapControls position='right'>
						<YMapZoomControl />
					</YMapControls>
				</YMap>
			</YMapComponentsProvider>
		</div>
	)
})

Map.displayName = 'Map'

export default React.memo(Map)
