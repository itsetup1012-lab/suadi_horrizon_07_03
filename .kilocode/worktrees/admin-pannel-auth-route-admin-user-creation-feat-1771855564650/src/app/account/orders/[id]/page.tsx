'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Package, MapPin, CreditCard, Bell, ArrowLeft, Truck, CheckCircle, Clock, Package as PackageIcon, XCircle, FileText, RotateCcw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { getOrderById, Order } from '@/api/user';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated, user, isInitialized } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [showSupportDialog, setShowSupportDialog] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [supportMessage, setSupportMessage] = useState('');

    // Calculate subtotal from items
    const calculateSubtotal = () => {
        if (!order) return 0;
        return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Fetch order from API
    useEffect(() => {
        const fetchOrder = async () => {
            if (!isInitialized) return;
            if (!isAuthenticated) {
                router.push('/login?redirect=/account/orders');
                return;
            }

            const orderId = params.id;
            if (!orderId) {
                setError('Order ID not found');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await getOrderById(orderId as string);
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Failed to load order details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [isInitialized, isAuthenticated, router, params.id]);

    // Handle Download Invoice
    const handleDownloadInvoice = () => {
        if (!order) return;
        const invoiceDate = order.createdAt ? formatDate(order.createdAt) : 'N/A';
        const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice - ${order._id}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; }
        .invoice-container { max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #2563eb; }
        .company-name { font-size: 28px; font-weight: bold; color: #2563eb; }
        .invoice-title { font-size: 24px; color: #666; }
        .invoice-info { text-align: right; }
        .invoice-info p { margin: 4px 0; }
        .label { font-weight: bold; color: #666; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 14px; font-weight: bold; color: #2563eb; text-transform: uppercase; margin-bottom: 10px; }
        .address { line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #e5e7eb; }
        td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .text-right { text-align: right; }
        .totals { margin-left: auto; width: 300px; }
        .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .totals-row.total { font-size: 18px; font-weight: bold; border-bottom: 2px solid #2563eb; margin-top: 8px; padding-top: 12px; }
        .footer { margin-top: 60px; text-align: center; color: #666; font-size: 12px; }
        @media print {
            body { padding: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div>
                <div class="company-name">Saudi Horizon</div>
                <div>Heavy Equipment Marketplace</div>
            </div>
            <div class="invoice-info">
                <div class="invoice-title">INVOICE</div>
                <p><span class="label">Invoice #:</span> INV-${order._id}</p>
                <p><span class="label">Order #:</span> ${order._id}</p>
                <p><span class="label">Date:</span> ${formatDate(order.createdAt)}</p>
                <p><span class="label">Status:</span> ${order.status}</p>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Bill To</div>
            <div class="address">
                <strong>${order.shippingAddress?.name || 'Customer'}</strong><br>
                ${order.shippingAddress?.street1 || ''}<br>
                ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zip || ''}<br>
                ${order.shippingAddress?.country || ''}
            </div>
        </div>

        <div class="section">
            <div class="section-title">Items</div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th class="text-right">Qty</th>
                        <th class="text-right">Unit Price</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                    <tr>
                        <td>${item.product?.name || 'Product'}</td>
                        <td class="text-right">${item.quantity}</td>
                        <td class="text-right">${(item.price || 0).toLocaleString()}</td>
                        <td class="text-right">${((item.quantity || 0) * (item.price || 0)).toLocaleString()}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="totals">
                <div class="totals-row">
                    <span>Subtotal</span>
                    <span>$${calculateSubtotal().toLocaleString()}</span>
                </div>
                <div class="totals-row">
                    <span>Shipping</span>
                    <span>$${(0).toLocaleString()}</span>
                </div>
                <div class="totals-row">
                    <span>Tax</span>
                    <span>$${(0).toLocaleString()}</span>
                </div>
                <div class="totals-row total">
                    <span>Total</span>
                    <span>$${order.totalAmount.toLocaleString()}</span>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Thank you for your business!</p>
            <p>Saudi Horizon Equipment &bull; Riyadh, Saudi Arabia</p>
        </div>
    </div>
    
    <div class="no-print" style="text-align: center; margin-top: 40px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
        <p style="margin-bottom: 15px;"><strong>To save as PDF:</strong> Press Ctrl+P (or Cmd+P on Mac) and select "Save as PDF"</p>
        <button onclick="window.print()" style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">Print / Save as PDF</button>
    </div>
</body>
</html>`;

        // Open invoice in new window
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(invoiceHTML);
            printWindow.document.close();
            toast.success('Invoice opened in new window. Use Ctrl+P to save as PDF.');
        } else {
            toast.error('Please allow popups to download invoice');
        }
    };

    // Handle Return Request
    const handleSubmitReturn = () => {
        if (!returnReason.trim()) {
            toast.error('Please provide a reason for the return');
            return;
        }
        toast.success('Return request submitted successfully. We will contact you within 24-48 hours.');
        setShowReturnDialog(false);
        setReturnReason('');
    };

    // Handle Contact Support
    const handleSubmitSupport = () => {
        if (!supportMessage.trim()) {
            toast.error('Please enter your message');
            return;
        }
        toast.success('Message sent to support. We will respond within 24 hours.');
        setShowSupportDialog(false);
        setSupportMessage('');
    };

    React.useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?redirect=/account/orders');
        }
    }, [isAuthenticated, isInitialized, router]);

    if (!isInitialized || !isAuthenticated) {
        return null;
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ordered':
                return <PackageIcon className="w-5 h-5" />;
            case 'processing':
                return <Clock className="w-5 h-5" />;
            case 'shipped':
                return <Truck className="w-5 h-5" />;
            case 'out_for_delivery':
                return <Truck className="w-5 h-5" />;
            case 'delivered':
                return <CheckCircle className="w-5 h-5" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5" />;
            default:
                return <Clock className="w-5 h-5" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'text-green-500';
            case 'cancelled':
                return 'text-red-500';
            case 'out_for_delivery':
                return 'text-blue-500';
            default:
                return 'text-yellow-500';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error || 'Order not found'}</p>
                    <Button onClick={() => router.push('/account/orders')}>Back to Orders</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-6xl mx-auto px-4">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/account')}>Account</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/account/orders')}>Orders</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>{order?._id}</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/account/orders')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-3xl font-bold">Order {order?._id}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-2 font-medium ${getStatusColor(order?.status || '')}`}>
                            {getStatusIcon(order?.status || '')}
                            {(order?.status || '').charAt(0).toUpperCase() + (order?.status || '').slice(1).replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order?.items.map((item: any) => (
                                    <div key={item._id || Math.random()} className="flex gap-4 p-4 border rounded-lg">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product?.image || '/images/category_hydraulics.jpg'}
                                                alt={item.product?.name || 'Product'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{item.product?.name || 'Product'}</h3>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            <p className="font-medium mt-2">${(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Order Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                    {getStatusIcon(order?.status || '')}
                                    <div>
                                        <p className={`font-medium ${getStatusColor(order?.status || '')}`}>
                                            {(order?.status || '').charAt(0).toUpperCase() + (order?.status || '').slice(1).replace('_', ' ')}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Placed on {order?.createdAt ? formatDate(order.createdAt) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${calculateSubtotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>${(0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>${(0).toLocaleString()}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>${(order?.totalAmount || 0).toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium">{order?.shippingAddress?.name || 'N/A'}</p>
                                <p className="text-muted-foreground">{order?.shippingAddress?.street1 || 'N/A'}</p>
                                <p className="text-muted-foreground">
                                    {order?.shippingAddress?.city || 'N/A'}, {order?.shippingAddress?.state || 'N/A'} {order?.shippingAddress?.zip || 'N/A'}
                                </p>
                                <p className="text-muted-foreground">{order?.shippingAddress?.country || 'N/A'}</p>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium">Payment: {order?.shippingAddress?.email || 'N/A'}</p>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="space-y-2">
                            <Button className="w-full" variant="outline" onClick={handleDownloadInvoice}>
                                <FileText className="h-4 w-4 mr-2" />
                                Download Invoice
                            </Button>
                            <Button className="w-full" variant="outline" onClick={() => setShowReturnDialog(true)}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Request Return
                            </Button>
                            <Button className="w-full" variant="outline" onClick={() => setShowSupportDialog(true)}>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Return Request Dialog */}
            <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Return</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for your return request. Our team will review it within 24-48 hours.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="return-reason">Reason for Return</Label>
                            <Textarea
                                id="return-reason"
                                placeholder="Please describe the issue with your order..."
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowReturnDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitReturn}>
                            Submit Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Contact Support Dialog */}
            <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Contact Support</DialogTitle>
                        <DialogDescription>
                            Send us a message about your order. We'll respond within 24 hours.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="support-message">Your Message</Label>
                            <Textarea
                                id="support-message"
                                placeholder="How can we help you with this order?"
                                value={supportMessage}
                                onChange={(e) => setSupportMessage(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSupportDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitSupport}>
                            Send Message
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
