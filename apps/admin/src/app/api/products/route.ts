import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      // Get the first available brand or create a default one
      let defaultBrand = await prisma.brand.findFirst()

      if (!defaultBrand) {
         defaultBrand = await prisma.brand.create({
            data: {
               title: 'Default Brand',
               description: 'Default brand for products',
            },
         })
      }

      const body = await req.json()
      const {
         title,
         description,
         price,
         discount,
         stock,
         isFeatured,
         isAvailable,
         categoryId,
         images,
      } = body

      // Ensure all required fields are provided
      if (!title || !description || !price || !stock || !categoryId) {
         return new NextResponse('Missing required fields', { status: 400 })
      }

      // Create product with found or created brand
      const product = await prisma.product.create({
         data: {
            title,
            description,
            price: Number(price), // Ensure price is a number
            discount: Number(discount || 0),
            stock: Number(stock),
            isFeatured: Boolean(isFeatured),
            isAvailable: Boolean(isAvailable),
            images: images || [],
            categories: {
               connect: { id: categoryId },
            },
            brand: {
               connect: { id: defaultBrand.id },
            },
         },
         include: {
            categories: true,
            brand: true,
         },
      })

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCTS_POST]', error)

      // More specific error messages based on the error type
      if (error instanceof Error) {
         return new NextResponse(error.message, { status: 500 })
      }

      return new NextResponse('Internal error', { status: 500 })
   }
}
export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { searchParams } = new URL(req.url)
      const categoryId = searchParams.get('categoryId') || undefined
      const isFeatured = searchParams.get('isFeatured') === 'true'

      const products = await prisma.product.findMany({
         where: {
            categories: {
               some: {
                  id: categoryId,
               },
            },
            isFeatured: isFeatured ? true : undefined,
         },
         include: {
            categories: true,
         },
      })

      return NextResponse.json(products)
   } catch (error) {
      console.error('[PRODUCTS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
