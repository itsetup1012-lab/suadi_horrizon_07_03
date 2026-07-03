const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Manually setting up alias for path @/
// Since this is a simple script, we'll just mock the sendEmail or rely on relative imports if we can, 
// but userNotifications.ts uses @/lib/mail.
// I'll just use a test script that replicates the logic.

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function testResetEmail() {
    try {
        console.log('Tested with:');
        console.log('Host:', process.env.SMTP_HOST);
        console.log('User:', process.env.SMTP_USER);

        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: 'varunvijay007@zohomail.in',
            subject: 'Reset Password Test',
            html: '<h1>Test</h1>'
        });
        console.log('Email sent:', info.messageId);
    } catch (err) {
        console.error('Error:', err);
    }
}

testResetEmail();
