import { getEmbedding } from "@/lib/embedding-utils";
import { pinecone } from "./sdk";
import { openai } from "./sdk";
import { ProductVariant } from "@/types/product";

export async function recommend_product({ query }: { query: string }) {
    // 1. Lấy embedding từ câu hỏi
    const startTime2 = performance.now();
    const embeddingRes = await getEmbedding(query);
    const endTime2 = performance.now();
    console.log(`Get embedding took ${endTime2 - startTime2}ms`);

    // 2. Lấy top 5 sản phẩm từ Pinecone
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME!).namespace('products');

    const startTime = performance.now();
    const result = await index.query({
        vector: embeddingRes,
        topK: 4,
        includeMetadata: true,
    });
    const endTime = performance.now();
    console.log(`Pinecone query took ${endTime - startTime}ms`);

    const products = result.matches?.map((match) => match.metadata) ?? [];

    // 3. Tạo prompt tư vấn
    const productSummaries = products.map((p, i) =>
        `${i + 1}. ${p?.name} (slug: ${p?.slug}) - Giá: ${p?.price.toLocaleString()} VND - Danh mục: ${p?.category}`
    ).join('\n');

    const prompt = `
Bạn là trợ lý tư vấn thời trang.

Khách hàng hỏi: "${query}"

Dưới đây là các sản phẩm có thể tư vấn:
${productSummaries}

Hãy chọn tối đa 4 sản phẩm phù hợp nhất. Trả về kết quả theo định dạng JSON như sau:

{
  "recommended_slugs": ["slug-1", "slug-2"],
  "reason": "Giải thích lý do chọn các sản phẩm trên dựa theo yêu cầu khách hàng. Giải thích một cách tự nhiên như đối thoại giữa người tư vấn với khách hàng"
}

Chỉ chọn từ các sản phẩm trong danh sách. Không bịa thêm.
  `.trim();

    // 4. Gọi GPT để lấy JSON kết quả
    const startTime1 = performance.now();
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'Bạn là trợ lý tư vấn thời trang.' },
            { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
    });
    const endTime1 = performance.now();
    console.log(`OpenAI chat completion took ${endTime1 - startTime1}ms`);

    const content = completion.choices[0].message.content ?? '{}';
    const parsed = JSON.parse(content);

    const selectedSlugs = parsed.recommended_slugs ?? [];
    const advice = parsed.reason ?? 'Dưới đây là các sản phẩm gợi ý cho bạn.';

    // 5. Lọc sản phẩm theo slug
    const recommendations = products.filter(p => selectedSlugs.includes(p?.slug));

    // 6. Trả về kết quả
    return {
        answer: advice,
        recommendations,
    };
}

export async function check_inventory({ slug }: { slug: string }) {
    function generateInventorySummary(product: any): string {
        const groupedByColor: Record<string, ProductVariant[]> = {};

        // Gom các biến thể theo màu
        for (const variant of product.variants) {
            if (!groupedByColor[variant.color]) {
                groupedByColor[variant.color] = [];
            }
            groupedByColor[variant.color].push(variant);
        }

        let summary = `Sản phẩm "${product.name}" hiện có các biến thể trong kho:\n`;

        for (const color in groupedByColor) {
            summary += `- Màu ${color}:\n`;
            const variants = groupedByColor[color];

            for (const { size, quantity } of variants) {
                summary += `  • Size ${size}: còn ${quantity} sản phẩm\n`;
            }
        }

        return summary;
    }

    // Gọi API backend lấy số lượng tồn kho
    let url = `${process.env.NEXT_PUBLIC_API_BACKEND}/api/v1/products/${slug}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        throw new Error('Lỗi khi lấy dữ liệu tồn kho');
    }

    const data = await res.json();

    const product = data.data;
    const summary = generateInventorySummary(product);

    console.log(summary);

    return {
        answer: summary,
    };
}

export async function handleIrrelevantQuestion({ query }: { query: string }) {

    return {
        answer: `Xin lỗi, tôi là một trợ lý thời trang và không thể trả lời câu hỏi: "${query}". 
  Vui lòng đặt câu hỏi liên quan đến thời trang, phối đồ, tư vấn sản phẩm hoặc các chủ đề tương tự.`,
        suggested_topics: [
            "Gợi ý phối đồ theo mùa",
            "Chọn trang phục theo dáng người",
            "Tư vấn thời trang công sở",
            "Xu hướng thời trang năm nay",
            "Phân biệt các loại chất liệu vải"
        ]
    };
}
