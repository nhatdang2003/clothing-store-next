// src/lib/embedding-utils.ts
import { openai } from '@/app/api/ai-agent/sdk';

export async function getEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        dimensions: 256
    });

    return response.data[0].embedding;
}
