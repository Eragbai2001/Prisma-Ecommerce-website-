// app/api/banners/[bannerId]/route.ts
import { NextResponse } from 'next/server';

export async function PATCH(
   req: Request,
   { params }: { params: { bannerId: string } }
 ) {
   console.log('PATCH request received for banner:', params.bannerId);
   
   try {
     const body = await req.json();
     console.log('Request body:', body);
 
     const { label, image, categories } = body;
     console.log('Updating with:', { label, image, categories });
 
     const banner = await prisma.banner.update({
       where: { id: params.bannerId },
       data: {
         label,
         image,
         // Only include categories if they exist
         ...(categories && {
           categories: {
             set: categories.map((categoryId: string) => ({ id: categoryId })),
           },
         }),
       },
     });
 
     console.log('Updated banner:', banner);
     return NextResponse.json(banner);
   } catch (error) {
     console.error("Error updating banner:", error);
       return new NextResponse("Failed to update banner", { status: 500 });
     }
   }
   export async function DELETE(
      req: Request,
      { params }: { params: { bannerId: string } }
    ) {
      console.log('Delete request received for banner:', params.bannerId); // Add this log
    
      try {
        await prisma.banner.delete({
          where: { 
            id: params.bannerId 
          },
        });
    
        return new NextResponse(null, { status: 204 });
      } catch (error) {
        console.error("Error deleting banner:", error);
        return new NextResponse("Failed to delete banner", { status: 500 });
      }

 }