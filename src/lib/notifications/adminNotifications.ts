import connectDB from '@/lib/db/mongodb';
import Notification from '@/lib/db/models/Notification';
import mongoose from 'mongoose';
import { sendEmail } from '@/lib/mail';

// Settings schema (same as in settings route)
const SettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

/**
 * Check if a specific notification type is enabled in admin settings
 */
async function isNotificationEnabled(settingKey: string): Promise<boolean> {
    try {
        const notifSettings = await Settings.findOne({ key: 'notifications' });
        if (!notifSettings || !notifSettings.value) {
            // Default: enabled for orders, low stock, quotes; disabled for new users & marketing
            const defaults: Record<string, boolean> = {
                orderNotifications: true,
                lowStockAlerts: true,
                newUserRegistrations: true,
                quoteRequests: true,
                marketingEmails: false,
            };
            return defaults[settingKey] ?? true;
        }
        // If the key exists in settings, use it; otherwise default to true
        return notifSettings.value[settingKey] ?? true;
    } catch (err) {
        console.error('Error checking notification settings:', err);
        return true; // Fail open — create notification if settings can't be read
    }
}

/**
 * Create an admin notification (respects admin notification settings)
 */
export async function createAdminNotification(
    type: string,
    title: string,
    message: string,
    settingKey?: string
): Promise<void> {
    try {
        await connectDB();

        // If a settingKey is provided, check if this notification type is enabled
        if (settingKey) {
            const enabled = await isNotificationEnabled(settingKey);
            if (!enabled) {
                return; // Notification type is disabled, skip
            }
        }

        await Notification.create({
            type,
            title,
            message,
            isRead: false,
        });
    } catch (err) {
        // Don't let notification failures break the main flow
        console.error('Failed to create notification:', err);
    }
}

// ---- Convenience methods for common notification types ----

export async function notifyNewOrder(orderId: string, totalAmount: number, customerEmail?: string) {
    const customer = customerEmail || 'a customer';
    await createAdminNotification(
        'order',
        'New Order Received',
        `Order #${orderId.slice(-8).toUpperCase()} placed by ${customer} — SAR ${totalAmount.toLocaleString()}`,
        'orderNotifications'
    );
}

export async function notifyNewUser(userName: string, userEmail: string) {
    await createAdminNotification(
        'user',
        'New User Registered',
        `${userName} (${userEmail}) just created an account`,
        'newUserRegistrations'
    );
}

export async function notifyLowStock(productName: string, currentStock: number) {
    const severity = currentStock === 0 ? 'OUT OF STOCK' : `only ${currentStock} left`;
    await createAdminNotification(
        'inventory',
        `Low Stock Alert: ${productName}`,
        `${productName} is ${severity}. Consider restocking soon.`,
        'lowStockAlerts'
    );
}

export async function notifyQuoteRequest(companyName: string, contactPerson: string, details?: any) {
    console.log(`System Notification: Processing new quote from ${companyName}`);
    const title = 'New Quote Request';
    const message = `${companyName} (${contactPerson}) submitted a quote request.`;

    try {
        // Create in-app notification
        await createAdminNotification(
            'quote',
            title,
            message,
            'quoteRequests'
        );
        console.log('System Notification: In-app record created.');
    } catch (err) {
        console.error('System Notification: Error creating in-app record:', err);
    }

    // Send email notification to admin
    try {
        if (!process.env.SMTP_USER) {
            console.warn('System Notification: SMTP_USER not configured, skipping email.');
            return;
        }

        console.log(`System Notification: Sending email to admin (${process.env.SMTP_USER})...`);
        const result = await sendEmail({
            to: process.env.SMTP_USER,
            subject: `[NEW QUOTE] ${companyName}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee;">
                    <h2 style="color: #c5a059; border-bottom: 2px solid #c5a059; padding-bottom: 10px;">New Quote Request Received</h2>
                    <p style="margin-top: 20px;">A new business inquiry has been submitted via the website.</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Company:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${companyName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Contact Person:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactPerson}</td>
                        </tr>
                        ${details?.email ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${details.email}</td></tr>` : ''}
                        ${details?.phone ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${details.phone}</td></tr>` : ''}
                        ${details?.items ? `<tr><td style="padding: 10px; vertical-align: top; font-weight: bold;">Items:</td><td style="padding: 10px;">${details.items.replace(/\n/g, '<br/>')}</td></tr>` : ''}
                    </table>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <p style="margin: 0; font-size: 14px;"><strong>Admin Note:</strong> You can view and manage this request in the <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/quotes" style="color: #c5a059; text-decoration: none;">Admin Dashboard</a>.</p>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0 20px;" />
                    <p style="font-size: 11px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} Saudi Horizon. All rights reserved.</p>
                </div>
            `
        });

        if (result.success) {
            console.log('System Notification: Admin email sent successfully.');
        } else {
            console.error('System Notification: Admin email failed:', result.error);
        }
    } catch (err) {
        console.error('System Notification: Unexpected error in email flow:', err);
    }
}
