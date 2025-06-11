export const productAdvisorFunction = {
    name: 'recommend_product',
    description: 'Tư vấn sản phẩm dựa trên câu hỏi của người dùng',
    parameters: {
        type: 'object',
        properties: {
            query: {
                type: 'string',
                description: 'Câu hỏi hoặc yêu cầu của người dùng về sản phẩm',
            },
        },
        required: ['query'],
    },
};

export const checkInventoryFunction = {
    name: 'check_inventory',
    description: 'Kiểm tra số lượng tồn kho của sản phẩm sau khi đã lấy được slug của sản phẩm',
    parameters: {
        type: 'object',
        properties: {
            slug: { type: 'string', description: 'Slug của sản phẩm, ví dụ: ao-khoac-1' },
        },
        required: ['slug'],
    },
};
