'use client'

import { createContext, useState, useContext, useMemo, ReactNode, useCallback } from 'react'
import { ThemeProvider as Theme } from 'next-themes'
import useMounted from '~/hooks/useMounted'

interface Store {
  titleInView: boolean
  setTitleInView: (value: boolean) => void
  compose: () => void
  code?: string
}

const StoreContext = createContext<Store>({
  titleInView: false,
  setTitleInView: () => {},
  compose: () => {},
  code: undefined
})

export function StoreProvider({ children }: { children: ReactNode }) {
  const mounted = useMounted()
  const [titleInView, setTitleInView] = useState(false)
  const [code, setCode] = useState<undefined | string>(undefined)

  const compose = useCallback(async () => {
    try {
      const response = await fetch('/api/compose', {
        mode: 'cors',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      // Throw an error if the response is not OK to trigger the catch block
      if (!response.ok) throw new Error('Failed to generate response')
  
      // Get the response body and handle it here
      const responseBody = await response.json()
  
      setCode(responseBody)
    } catch (error) {
      // Use switch statement to handle different error types
      switch (error.message) {
        case 'Failed to generate response':
          setCode('Failed to generate response')
          break
        default:
          // Handle specific HTTP status codes using the response status property
          switch (response?.status) {
            case 400:
              setCode('Bad request')
              break
            case 401:
              setCode('Unauthorized')
              break
            case 404:
              setCode('Not found')
              break
            case 500:
              setCode('Internal Server Error')
              break
            default:
              setCode('Unknown error')
              break
          }
          break
      }
    }
  }, [])
  

  const memoizedValue = useMemo(
    () => ({
      titleInView,
      setTitleInView,
      compose,
      code
    }),
    [code, compose, titleInView]
  )

  if (!mounted) return null

  return (
    <StoreContext.Provider value={memoizedValue}>
      <Theme attribute="class" enableSystem={true} defaultTheme="system">
        {children}
      </Theme>
    </StoreContext.Provider>
  )
}

export default function useStore() {
  return useContext(StoreContext)
}
