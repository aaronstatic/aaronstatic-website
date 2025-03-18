import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ContactMessage } from '@/lib/types/ContactMessage';

// Validate reCAPTCHA token with Google
async function validateRecaptcha(token: string): Promise<boolean> {
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            throw new Error('reCAPTCHA secret key is not configured');
        }

        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${secretKey}&response=${token}`,
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('reCAPTCHA validation error:', error);
        return false;
    }
}

// Send notification via Pushover
async function sendPushoverNotification(message: ContactMessage): Promise<boolean> {
    try {
        const userKey = process.env.PUSHOVER_USER_KEY;
        const appToken = process.env.PUSHOVER_APP_TOKEN;

        if (!userKey || !appToken) {
            throw new Error('Pushover credentials are not configured');
        }

        const response = await fetch('https://api.pushover.net/1/messages.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: appToken,
                user: userKey,
                title: `New Contact Form Message from ${message.name}`,
                message: `Email: ${message.email}\n\nMessage: ${message.message}`,
                priority: 0,
            }),
        });

        const data = await response.json();
        return data.status === 1;
    } catch (error) {
        console.error('Pushover notification error:', error);
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { name, email, message, token } = body;

        // Validate form data
        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Validate reCAPTCHA
        const isValidRecaptcha = await validateRecaptcha(token);
        if (!isValidRecaptcha) {
            return NextResponse.json(
                { success: false, message: 'reCAPTCHA validation failed' },
                { status: 400 }
            );
        }

        // Get IP address if available
        const ipAddress = request.headers.get('x-forwarded-for') || 
                         request.headers.get('x-real-ip') || 
                         'unknown';

        // Create contact message object
        const contactMessage: ContactMessage = {
            name,
            email,
            message,
            ipAddress: ipAddress as string,
            createdAt: new Date(),
        };

        // Save to MongoDB
        const db = await getDb();
        await db.collection('contact_messages').insertOne(contactMessage);

        // Send Pushover notification
        await sendPushoverNotification(contactMessage);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred while processing your request' },
            { status: 500 }
        );
    }
} 