import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        // 1. Tạo embedding câu hỏi
        const embeddingRes = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query,
        });

        const queryVector = embeddingRes.data[0].embedding;

        // 2. Tìm kiếm tương tự trong Pinecone
        const index = pinecone.index(process.env.PINECONE_INDEX_NAME!).namespace('products');
        const searchResponse = await index.query({
            vector: queryVector,
            topK: 5,
            includeMetadata: true,
        });

        // 3. Lấy kết quả sản phẩm trả về
        const matches = searchResponse.matches || [];
        const products = matches.map(match => match.metadata);

        return NextResponse.json({ products });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Lỗi khi tìm kiếm' }, { status: 500 });
    }
}
