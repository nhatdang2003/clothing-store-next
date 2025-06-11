import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { getColorText } from '@/lib/utils';
import { getEmbedding } from '@/lib/embedding-utils';

// 1. Khởi tạo OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

// 2. Khởi tạo Pinecone client
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

function extractProductSummary(product: any) {
    // Tạo đoạn text tóm tắt thông tin chính của sản phẩm để embed
    const summaryText = `
    Sản phẩm: ${product.name}.
    Loại: ${product.categoryName}.
    Giá: ${product.price.toLocaleString()} VND.
    Mô tả: ${product.description}.
    Size: ${Array.from(new Set(product.variants.map((v: any) => v.size))).join(',')}.
    Màu: ${Array.from(new Set(product.variants.map((v: any) => v.color))).join(',')}.
  `.trim();

    // Metadata lưu trong Pinecone
    const metadata = {
        productId: product.id,
        name: product.name,
        category: product.categoryName,
        price: product.price,
        slug: product.slug,
        size: Array.from(new Set(product.variants.map((v: any) => v.size))).join(','),
        color: Array.from(new Set(product.variants.map((v: any) => v.color))).join(','),
        image: product.images[0],
    };

    return { summaryText, metadata };
}

// 3. API Route: POST /api/vector-sync
export async function POST(req: NextRequest) {
    try {
        // Gọi API backend Spring Boot lấy danh sách sản phẩm
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/v1/products?page=0&size=1000`);
        const data = await res.json();
        if (data.statusCode !== 200) {
            return NextResponse.json({ error: 'Lỗi khi lấy dữ liệu sản phẩm' }, { status: 500 });
        }
        const products = data.data.data;

        const vectors = [];

        for (const product of products) {
            // Tách phần summary và metadata
            const { summaryText, metadata } = extractProductSummary(product);

            // Tạo embedding từ đoạn summary
            const embeddingRes = await getEmbedding(summaryText);

            vectors.push({
                id: `product-${product.slug}`,
                values: embeddingRes,
                metadata,
            });
        }

        // Lấy index Pinecone có namespace 'products'
        const index = pinecone.index(process.env.PINECONE_INDEX_NAME!).namespace('products');

        // Upsert vectors vào Pinecone
        await index.upsert(vectors);

        return NextResponse.json({ message: 'Đồng bộ thành công', count: vectors.length });
    } catch (error) {
        console.error('Lỗi đồng bộ:', error);
        return NextResponse.json({ error: 'Lỗi khi xử lý dữ liệu' }, { status: 500 });
    }
}
