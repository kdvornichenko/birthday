import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { NextUIProvider } from '@nextui-org/system'
import { Suspense } from 'react'

const geistSans = localFont({
	src: './fonts/Kudry.woff',
	variable: '--font-kudry',
	weight: '100 900',
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
})

const gyreMono = localFont({
	src: './fonts/Gyre.woff',
	variable: '--font-gyre-mono',
	weight: '100 900',
})

export const metadata: Metadata = {
	title: 'Приглашение на День Рождения',
	description: 'Приглашение на День Рождения 🎂🥳',
	robots: 'noindex, nofollow',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${gyreMono.variable} antialiased overflow-x-hidden w-screen`}
			>
				<NextUIProvider>
					<Suspense>{children}</Suspense>
				</NextUIProvider>
			</body>
		</html>
	)
}
