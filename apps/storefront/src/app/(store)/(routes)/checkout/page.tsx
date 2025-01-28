'use client'

import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { PaystackButton } from 'react-paystack'

// Define proper types
interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
}

interface CustomField {
  display_name: string;
  variable_name: string;
  value: string;
}

export function CheckoutPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isValid, setIsValid] = useState(false)

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  const amount = 1000000 // 10,000 Naira in kobo

  // Validate all required fields
  useEffect(() => {
    setIsValid(
      email.length > 0 &&
      name.length > 0 &&
      phone.length > 0 &&
      amount > 0 &&
      !!publicKey
    )
  }, [email, name, phone, amount, publicKey])

  const componentProps = {
    email,
    amount,
    metadata: {
      name,
      phone,
      custom_fields: [
        {
          display_name: 'Name',
          variable_name: 'name',
          value: name,
        },
        {
          display_name: 'Phone',
          variable_name: 'phone',
          value: phone,
        },
      ] as CustomField[],
    },
    publicKey,
    text: 'Pay Now',
    onSuccess: (response: PaystackResponse) => {
      console.log('Payment successful:', response)
      // Handle successful payment here
      alert('Payment successful! Thank you for your purchase.')
    },
    onClose: () => {
      console.log('Payment cancelled')
      alert("Wait! Don't leave :(")
    },
  }

  if (!publicKey) {
    return (
      <div className="p-4 text-red-500">
        Payment configuration error. Please contact support.
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="pt-4">
          {isValid ? (
            <PaystackButton
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-200"
              {...componentProps}
            />
          ) : (
            <Button disabled className="w-full">
              Please fill in all required fields
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage