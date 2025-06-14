// src/app/api/ai-agent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { openai } from './sdk';
import { productAdvisorFunction, checkInventoryFunction, irrelevantQuestion } from './schema-functions';
import { recommend_product, check_inventory, handleIrrelevantQuestion } from './functions';

const FUNCTIONS_MAP: Record<string, any> = {
    recommend_product, check_inventory, handleIrrelevantQuestion
};

export async function POST(req: NextRequest) {
    const body = await req.json();
    const userQuery = body.query;

    const startTime = performance.now();
    const chat = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: userQuery }],
        tools: [
            { type: 'function', function: productAdvisorFunction },
            { type: 'function', function: checkInventoryFunction },
            { type: 'function', function: irrelevantQuestion }
        ],
        tool_choice: 'auto',
    });
    const endTime = performance.now();
    console.log(`OpenAI chat completion took ${endTime - startTime}ms`);

    const message = chat.choices[0].message;

    if (message.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0]; // chỉ xử lý 1 call đầu tiên
        const { name, arguments: args } = toolCall.function;
        const parsedArgs = JSON.parse(args || '{}');

        const result = await FUNCTIONS_MAP[name](parsedArgs);
        return NextResponse.json({ ...result });
    }

    return NextResponse.json({ answer: message.content });
}
