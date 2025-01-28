'use client'

import { validateBoolean } from '@/lib/utils'
import { AuthState } from '@/types/auth'
import { useEffect, useState } from 'react'

export function useAuthenticated(): AuthState {
   const [authState, setAuthState] = useState<AuthState>({
      authenticated: false,
      user: null,
   })

   useEffect(() => {
      // Check local storage or session for auth state
      const checkAuth = () => {
         const userStr = localStorage.getItem('user')
         if (userStr) {
            try {
               const user = JSON.parse(userStr)
               setAuthState({
                  authenticated: true,
                  user,
               })
            } catch (error) {
               console.error('Error parsing user data:', error)
               // Clear invalid data
               localStorage.removeItem('user')
            }
         } else {
            try {
               if (typeof window !== 'undefined' && window.localStorage) {
                  const cookies = document.cookie.split(';')
                  const loggedInCookie =
                     cookies
                        .find((cookie) => cookie.startsWith('logged-in'))
                        ?.split('=')[1] === 'true'

                  setAuthState({
                     authenticated: validateBoolean(loggedInCookie, false),
                     user: null,
                  })
               }
            } catch (error) {
               console.error({ error })
            }
         }
      }

      checkAuth()
   }, [])

   return authState
}