import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const PageContainer = React.forwardRef(({ 
  className, 
  children, 
  maxWidth = "max-w-4xl",
  loading = false,
  loadingText = "Loading...",
  error = null,
  errorText = "An error occurred. Please try again.",
  animate = true,
  ...props 
}, ref) => {
  const containerClasses = cn(
    "container mx-auto px-4 py-8",
    maxWidth,
    className
  )

  const content = loading ? (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        <p className="text-lg text-gray-600">{loadingText}</p>
      </div>
    </div>
  ) : error ? (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-600">{typeof error === 'string' ? error : errorText}</p>
    </div>
  ) : animate ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  ) : (
    children
  )

  return (
    <div ref={ref} className={containerClasses} {...props}>
      {content}
    </div>
  )
})

PageContainer.displayName = "PageContainer"

export { PageContainer }

