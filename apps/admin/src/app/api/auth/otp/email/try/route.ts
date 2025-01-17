'use server'

import config from '@/config/site'
import Mail from '@/emails/verify'
import prisma from '@/lib/prisma'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { sendMail } from '@persepolis/mail'
import { isEmailValid } from '@persepolis/regex'
import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!isEmailValid(email)) {
            return getErrorResponse(400, 'Incorrect Email')
        }

        const OTP = generateSerial({})

        // First check if owner exists
        const existingOwner = await prisma.owner.findUnique({
            where: { email }
        })

        if (!existingOwner) {
            // Create new owner if doesn't exist
            await prisma.owner.create({
                data: {
                    email,
                    OTP
                }
            })
        } else {
            // Update existing owner
            await prisma.owner.update({
                where: { email },
                data: { OTP }
            })
        }

        // Send email
        try {
            await sendMail({
                name: config.name,
                to: email,
                subject: 'Verify your email.',
                html: await render(Mail({ code: OTP, name: config.name }))
            })
        } catch (emailError) {
            console.error('Email sending failed:', emailError)
            return getErrorResponse(500, 'Failed to send verification email')
        }

        return new NextResponse(
            JSON.stringify({
                status: 'success',
                email
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        )
    } catch (error) {
        console.error('Detailed error:', error)
        
        if (error instanceof ZodError) {
            return getErrorResponse(400, 'Failed validations', error)
        }

        // Check for Prisma-specific errors
        if (error?.code === 'P2002') {
            return getErrorResponse(409, 'Email already exists')
        }

        return getErrorResponse(500, error.message || 'Internal server error')
    }
}