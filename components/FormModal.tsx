'use client'

import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@nextui-org/modal'
import React from 'react'
import TelegramLink from './TelegramLink'
import { Snippet } from '@nextui-org/snippet'
import { Button } from '@nextui-org/button'
import useFormState from '@/store/form.store'
import { BirthdayCake } from './icons/IconBirthdayCake'

const FormModal = () => {
	const {
		formSended,
		showFormModal,
		setShowFormModal,
		willBeAttended,
		formError,
	} = useFormState()

	return (
		<Modal
			isOpen={showFormModal}
			onOpenChange={isOpen => setShowFormModal(isOpen)}
			backdrop='blur'
			placement='center'
			size='2xl'
		>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='flex flex-col gap-1 font-kudry text-3xl'>
							{formSended ? 'Отправлено!' : 'Ошибка при отправке формы'}
						</ModalHeader>

						<ModalBody className='font-gyre-mono text-xl'>
							{formSended ? (
								willBeAttended ? (
									<div className='flex flex-col gap-y-4'>
										<span>Спасибо! С нетерпением Вас ждем!</span>
									</div>
								) : (
									<div className='flex flex-col gap-y-4'>
										<span>Очень жаль 😢</span>
									</div>
								)
							) : (
								<div className='flex flex-col gap-y-4'>
									<div>
										<span>
											'Ошибка при отправке формы. Пожалуйста, скопируйте это
											сообщение, нажав на значок '
										</span>
										<Snippet
											symbol=''
											variant='bordered'
											size='sm'
											disableCopy
											classNames={{
												base: 'gap-0',
												copyButton: 'opacity-100',
											}}
										/>

										<span>(или сделайте скриншот) и отправьте мне</span>
										<TelegramLink person='k' />
									</div>

									<Snippet
										symbol=''
										variant='bordered'
										size='lg'
										classNames={{ pre: 'whitespace-pre-line' }}
									>
										{formError}
									</Snippet>
								</div>
							)}
						</ModalBody>

						<ModalFooter className='flex items-center justify-end'>
							<Button
								color='primary'
								className='bg-slate-950'
								onPress={onClose}
							>
								<BirthdayCake className='size-7' />
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

export default FormModal
