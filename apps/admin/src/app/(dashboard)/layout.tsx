'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar'

export default function DashboardLayout({
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
        <div>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48">
                {children}
            </div>
        </div>
    )
}