const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testEmail() {
    console.log('Testing SMTP connection...');
    console.log('Host:', process.env.SMTP_HOST || 'smtp.zoho.com');
    console.log('Port:', process.env.SMTP_PORT || '465');
    console.log('User:', process.env.SMTP_USER);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.zoho.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        authMethod: 'LOGIN',
        greetingTimeout: 15000,
        debug: true,
        logger: true,
    });

    try {
        await transporter.verify();
        console.log('SMTP connection verified successfully!');

        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Send to self
            subject: 'SMTP Test - Saudi Horizon',
            text: 'This is a test email to verify SMTP configuration.',
            html: '<b>This is a test email to verify SMTP configuration.</b>',
        });

        console.log('Test email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('SMTP test failed:', error);
    }
}

testEmail();
