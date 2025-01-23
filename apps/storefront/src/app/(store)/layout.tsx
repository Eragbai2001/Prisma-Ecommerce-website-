'use client'

import Footer from '@/components/native/Footer'
import Header from '@/components/native/nav/parent'
import { useEffect, useState } from 'react'

export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      setIsLoading(false)
   }, [])

   if (isLoading) {
      return null // or a loading spinner
   }
   return (
      <>
         <Header />
         <div className="px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
            {children}
         </div>
         <Footer />
      </>
   )
}
