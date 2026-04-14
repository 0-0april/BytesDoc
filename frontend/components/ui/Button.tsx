import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit'
  className?: string
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition'
  const variants = {
    primary: 'bg-primary text-white hover:bg-accent',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
