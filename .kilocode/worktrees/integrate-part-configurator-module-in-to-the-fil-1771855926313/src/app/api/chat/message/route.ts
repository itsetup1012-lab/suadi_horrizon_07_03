import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, history } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Construct conversation history
        const conversation = history || [];
        conversation.push({ role: 'user', content: message });

        // System prompt for the chatbot
        const systemPrompt = {
            role: 'system',
            content: `You are the intelligent assistant for 'Saudi Horizon'. 
You help users find construction machinery parts, book services, and manage orders.
- Be professional, concise, and helpful.
- When showing products, summarize key specs and price.
- If a user wants to buy, guide them to the product page (mock link /product/:id).
- For appointments, assume the user is authenticated.`
        };

        const fullMessages = [systemPrompt, ...conversation];

        // TODO: Integrate with Gemini API or other AI service
        // For now, returning a simple mock response
        const reply = `Thank you for your message: "${message}". Our AI chatbot integration is ready for Gemini API. Please configure GEMINI_API_KEY in your environment variables.`;

        return NextResponse.json({ reply });
    } catch (error: unknown) {
        console.error('Chat route error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat' },
            { status: 500 }
        );
    }
}
