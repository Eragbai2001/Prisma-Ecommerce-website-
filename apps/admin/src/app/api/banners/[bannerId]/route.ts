import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { bannerId } = req.query

   if (req.method === 'GET') {
      try {
         const banner = await prisma.banner.findUnique({
            where: { id: String(bannerId) },
         })

         if (!banner) {
            return res.status(404).json({ error: 'Banner not found' })
         }

         res.status(200).json(banner)
      } catch (error) {
         console.error('Error fetching banner:', error)
         res.status(500).json({ error: 'Failed to fetch banner' })
      }
   } else if (req.method === 'PATCH') {
      try {
         const { label, image, categories } = req.body

         const banner = await prisma.banner.update({
            where: { id: String(bannerId) },
            data: {
               label,
               image,
               categories: {
                  set: categories.map((categoryId: string) => ({ id: categoryId })),
               },
            },
         })

         res.status(200).json(banner)
      } catch (error) {
         console.error('Error updating banner:', error)
         res.status(500).json({ error: 'Failed to update banner' })
      }
   } else if (req.method === 'DELETE') {
      try {
         await prisma.banner.delete({
            where: { id: String(bannerId) },
         })

         res.status(204).end()
      } catch (error) {
         console.error('Error deleting banner:', error)
         res.status(500).json({ error: 'Failed to delete banner' })
      }
   } else {
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
   }
}