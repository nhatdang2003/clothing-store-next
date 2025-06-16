"use client"

import Link from 'next/link'
import { useRecommendProductsQuery } from '@/hooks/use-product-query'
import ProductCard from '../shared/Product'
import { ArrowRightIcon } from 'lucide-react'

const RecommendProduct = () => {
    const { data: products } = useRecommendProductsQuery();

    return (
        <div className="container max-w-6xl mx-auto px-4 pb-8 relative">
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-bold'>Dành riêng cho bạn</h2>
                <Link href='/shop' className='text-sm text-gray-500 flex items-center gap-2 hover:text-primary'>
                    Xem tất cả <ArrowRightIcon className='w-4 h-4' />
                </Link>
            </div>
            <div className='grid grid-cols-2 md:hidden lg:grid lg:grid-cols-4 gap-4 mt-4'>
                {
                    products?.slice(0, 8).map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                }
            </div>
            <div className='hidden md:grid md:grid-cols-3 lg:hidden gap-4 mt-4'>
                {
                    products?.slice(0, 9).map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                }
            </div>
        </div>
    )
}

export default RecommendProduct