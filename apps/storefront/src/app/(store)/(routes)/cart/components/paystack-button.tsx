'use client'
import { usePaystackPayment } from "@paystack/inline-js"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface PaystackButtonProps {
  amount: number
  email: string
  metadata?: any
  disabled?: boolean
}

export function PaystackButton({ amount, email, metadata, disabled }: PaystackButtonProps) {
  const router = useRouter()

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: Math.round(amount * 100), // Convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    metadata,
  }

  const onSuccess = async (reference: any) => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: reference.reference }),
      })

      if (response.ok) {
        toast.success('Payment successful!')
        router.push('/orders')
      } else {
        toast.error('Payment verification failed')
      }
    } catch (error) {
      toast.error('Error processing payment')
    }
  }

  const onClose = () => {
    toast.error('Payment cancelled')
  }

  const initializePayment = usePaystackPayment(config)

  return (
    <Button 
      onClick={() => initializePayment(onSuccess, onClose)}
      disabled={disabled}
      className="w-full"
    >
      Pay with Paystack
    </Button>
  )
}