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

      // throw error if response is not ok to trigger catch block
      if (!response.ok) throw new Error('Failed to generate response')

      // get response body and handle it here
      const responseBody = response.json()

      setCode(responseBody)
    } catch (error) {
      // use switch statement to handle different error types
      switch(error) {
        case 400:
          setCode("Bad request")
        case 401:
          setCode("Unauthorized")
        case 404:
          setCode("Not found")
        case 500:
          setCode("Internal Server Error")
        default:
          setCode("Unknown error")
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
