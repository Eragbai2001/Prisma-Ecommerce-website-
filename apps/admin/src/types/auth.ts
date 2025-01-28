export interface User {
   id: string
   email: string
   name?: string
}

export interface AuthState {
   authenticated: boolean
   user: User | null
}
