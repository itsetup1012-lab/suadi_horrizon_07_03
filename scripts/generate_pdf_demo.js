const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Mocking the behavior for a standalone script as we can't easily import TS/Next.js aliases here
// We'll use the same logic but local to this script to guarantee the result
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

async function generateOffline(invoice) {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(10, 22, 40);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(28);
    doc.text('SAUDI HORIZON', 20, 25);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('INVOICE', 160, 20);
    doc.setFontSize(14);
    doc.text(invoice.invoiceNumber, 160, 28);

    // Customer Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('BILL TO:', 20, 55);
    doc.setFontSize(12);
    doc.text(invoice.customer.name, 20, 65);
    if (invoice.customer.email) doc.text(invoice.customer.email, 20, 72);
    if (invoice.customer.phone) doc.text(invoice.customer.phone, 20, 79);

    // Items Table
    const tableRows = invoice.items.map(item => [
        item.description.replace(/\\n/g, '\n'), // Handle the newlines
        item.quantity.toString(),
        `${invoice.currency} ${item.unitPrice.toLocaleString()}`,
        `${invoice.currency} ${item.total.toLocaleString()}`
    ]);

    doc.autoTable({
        startY: 95,
        head: [['Description', 'Qty', 'Unit Price', 'Total']],
        body: tableRows,
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [10, 22, 40], textColor: [197, 160, 89] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // Totals
    doc.text(`Subtotal: ${invoice.currency} ${invoice.subtotal.toLocaleString()}`, 140, finalY);
    doc.text(`VAT (${invoice.vatRate}%): ${invoice.currency} ${invoice.vatAmount.toLocaleString()}`, 140, finalY + 8);
    doc.setFontSize(14);
    doc.text(`Total: ${invoice.currency} ${invoice.totalAmount.toLocaleString()}`, 140, finalY + 18);

    // Notes
    if (invoice.notes) {
        doc.setFontSize(10);
        doc.text('Notes:', 20, finalY);
        doc.setFontSize(9);
        const splitNotes = doc.splitTextToSize(invoice.notes, 100);
        doc.text(splitNotes, 20, finalY + 7);
    }

    return Buffer.from(doc.output('arraybuffer'));
}

async function run() {
    try {
        await mongoose.connect('mongodb://localhost:27017/saudi_horizon');
        console.log('Connected to MongoDB');

        const Collection = mongoose.connection.collection('invoices');
        const invoice = await Collection.findOne({ invoiceNumber: 'INV-2026-0004' });

        if (!invoice) throw new Error('Invoice not found');
        console.log(`Generating PDF for ${invoice.invoiceNumber}...`);

        const buffer = await generateOffline(invoice);
        const filePath = path.join(process.cwd(), `PDF_GEN_${invoice.invoiceNumber}.pdf`);
        fs.writeFileSync(filePath, buffer);

        console.log(`SUCCESS! PDF file created at: ${filePath}`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

run();
