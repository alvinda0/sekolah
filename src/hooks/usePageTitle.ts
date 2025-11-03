// hooks/usePageTitle.ts
'use client'

import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | School`

    return () => {
      document.title = 'School'
    }
  }, [title])
}