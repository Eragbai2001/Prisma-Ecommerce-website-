import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.productId) {
         return new NextResponse('Product id is required', { status: 400 })
      }

      const product = await prisma.product.findUniqueOrThrow({
         where: {
            id: params.productId, // Corrected typo
         },
      })

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const product = await prisma.product.delete({
         where: {
            id: params.productId,
         },
      })

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(req: Request, { params }: { params: { productId: string } }) {
   try {
       if (!params.productId) {
           return new NextResponse('Product Id is required', { status: 400 })
       }

       const userId = req.headers.get('X-USER-ID')
       if (!userId) {
           return new NextResponse('Unauthorized', { status: 401 })
       }

       const body = await req.json()
       
       const product = await prisma.product.update({
           where: {
               id: params.productId,
           },
           data: {
               title: body.title,
               description: body.description, // Add this
               price: body.price,
               discount: body.discount,
               stock: body.stock,
               isFeatured: body.isFeatured,
               isAvailable: body.isAvailable,
               categories: body.categories, // Add this
               images: body.images // Add this
           },
       })

       return NextResponse.json(product)
   } catch (error) {
       console.error('[PRODUCT_PATCH]', error)
       return new NextResponse('Internal error', { status: 500 })
   }
}