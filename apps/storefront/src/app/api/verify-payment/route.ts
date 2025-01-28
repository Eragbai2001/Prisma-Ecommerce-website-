import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { reference } = await request.json()
    
    // Verify payment with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )
    
    const data = await verifyResponse.json()
    
    if (data.status && data.data.status === 'success') {
      const { metadata, customer } = data.data
      
      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          refId: reference,
          payable: data.data.amount / 100,
          isSuccessful: true,
          status: 'Paid',
          userId: metadata.userId,
          orderId: metadata.orderId,
          providerId: metadata.providerId,
        },
      })

      // Update order status
      await prisma.order.update({
        where: { id: metadata.orderId },
        data: { 
          isPaid: true,
          status: 'Processing'
        },
      })

      // Clear cart
      await prisma.cart.delete({
        where: { userId: metadata.userId },
      })

      return NextResponse.json({ success: true, payment })
    }

    return NextResponse.json(
      { success: false, message: 'Payment verification failed' },
      { status: 400 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
