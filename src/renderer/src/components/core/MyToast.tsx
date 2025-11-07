import React from 'react'
import * as Toast from '@radix-ui/react-toast'

interface MyToastProps {
  open: boolean
  title?: string
  description?: string
  variant?: 'success' | 'error' | 'info'
  onOpenChange?: (open: boolean) => void
}

export const MyToast: React.FC<MyToastProps> = ({
  open,
  title,
  description,
  variant = 'success',
  onOpenChange
}) => {
  const bgColor =
    variant === 'success' ? 'bg-green-600' : variant === 'error' ? 'bg-red-600' : 'bg-blue-600'

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={open}
        onOpenChange={onOpenChange}
        className={`fixed bottom-4 right-4 rounded-lg shadow-lg px-5 py-4 text-white ${bgColor}`}
      >
        {title && <Toast.Title className="font-semibold">{title}</Toast.Title>}
        {description && (
          <Toast.Description className="text-sm opacity-90">{description}</Toast.Description>
        )}
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 p-4 w-96 max-w-full z-[100]" />
    </Toast.Provider>
  )
}
