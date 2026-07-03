import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { stripe } from '@/lib/stripe';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/db/models/Product';
import path from 'path';
import fs from 'fs';

// Fallback to JSON if DB lacks product
function getProductsFromJSON(): any[] {
    try {
        const productsPath = path.join(process.cwd(), 'products.json');
        const data = fs.readFileSync(productsPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const { items } = await request.json();

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
        }

        let totalAmountCents = 0;

        for (const item of items) {
            // Find item in DB
            let dbProduct = await Product.findOne({ _id: item._id });

            // Fallback if not found in DB
            if (!dbProduct) {
                const jsonProducts = getProductsFromJSON();
                const found = jsonProducts.find(p => p._id === item._id);
                if (found) dbProduct = found;
            }

            if (!dbProduct) {
                return NextResponse.json({ error: `Product ${item._id} not found` }, { status: 404 });
            }

            const unitAmount = Math.round(dbProduct.price * 100);
            totalAmountCents += unitAmount * item.quantity;
        }

        // Add 15% VAT matching the cart UI
        const taxCents = Math.round(totalAmountCents * 0.15);
        const finalTotalCents = totalAmountCents + taxCents;

        // Create a PaymentIntent for Express Checkout
        const paymentIntent = await stripe.paymentIntents.create({
            amount: finalTotalCents,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            description: 'Industrial Equipment Procurement - Saudi Horizon',
            metadata: {
                itemCount: items.length.toString(),
            },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error('Stripe PaymentIntent Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
