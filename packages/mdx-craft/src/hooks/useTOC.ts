import { useContext } from 'react'
import type { TOCContextValue } from '../types/provider.js'
import { TOCContext } from '../provider/context.js'

export const useTOC = (): TOCContextValue => {
  const context = useContext(TOCContext)

  if (!context) {
    throw new Error('useTOC must be used within a TOCProvider')
  }

  return context
}
