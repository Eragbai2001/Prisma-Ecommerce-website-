export interface NavItem {
   title: string
   href?: string
   disabled?: boolean
   external?: boolean
   icon?: any
   label?: string
}

export interface PaystackConfig {
   reference: string
   email: string
   amount: number
   publicKey: string
   currency: string
}

export interface PaystackResponse {
   reference: string
   status: string
   trans: string
   transaction: string
   message: string
}
