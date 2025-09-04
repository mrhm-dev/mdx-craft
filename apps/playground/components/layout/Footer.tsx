'use client'

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <div className="flex justify-between items-center px-4 h-full">
      <p className="text-sm text-muted-foreground text-center w-full">
        &copy; {year} MDX Craft. All rights reserved.
      </p>
    </div>
  )
}
