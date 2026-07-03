const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generatePdfFromDb() {
    try {
        // 1. Connect to Database
        await mongoose.connect('mongodb://localhost:27017/saudi_horizon');
        console.log('--- STEP 1: Connected to MongoDB ---');

        const Collection = mongoose.connection.collection('invoices');

        // 2. Fetch Invoice Information directly from Database
        const invoice = await Collection.findOne({ invoiceNumber: 'INV-2026-0004' });

        if (!invoice) {
            console.error('Invoice not found in database!');
            process.exit(1);
        }

        console.log(`--- STEP 2: Fetched Invoice ${invoice.invoiceNumber} from DB ---`);
        console.log(`Customer: ${invoice.customer.name}`);
        console.log(`Address: ${invoice.customer.address || 'N/A'}`);
        console.log(`Amount: ${invoice.totalAmount} ${invoice.currency}`);

        // 3. Create PDF using the fetched information
        const doc = new PDFDocument({ margin: 50 });
        const filePath = path.join(process.cwd(), `DATABASE_FILE_${invoice.invoiceNumber}.pdf`);
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Header
        doc.fillColor('#0A1628').rect(0, 0, 612, 100).fill();
        doc.fillColor('#C5A059').fontSize(25).text('SAUDI HORIZON', 50, 40);
        doc.fillColor('#FFFFFF').fontSize(12).text('OFFICIAL INVOICE', 450, 45);

        // Content
        doc.fillColor('#000000').fontSize(14).text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 130);
        doc.fontSize(10).text(`Date: ${new Date().toLocaleDateString()}`, 50, 150);

        doc.moveDown();
        doc.fontSize(12).text('BILL TO:', { underline: true });
        doc.fontSize(11).text(invoice.customer.name);
        if (invoice.customer.company) doc.text(invoice.customer.company);
        if (invoice.customer.email) doc.text(invoice.customer.email);
        if (invoice.customer.phone) doc.text(invoice.customer.phone);

        doc.moveDown(2);
        doc.fontSize(12).text('ITEMS:', { underline: true });

        // Table Header
        const startY = doc.y + 10;
        doc.fontSize(10).text('Description', 50, startY);
        doc.text('Qty', 350, startY);
        doc.text('Price', 400, startY);
        doc.text('Total', 500, startY);
        doc.moveTo(50, startY + 15).lineTo(550, startY + 15).stroke();

        let currentY = startY + 25;
        invoice.items.forEach(item => {
            const desc = (item.description || '').replace(/\\n/g, '\n');
            doc.text(desc, 50, currentY, { width: 280 });
            doc.text(item.quantity.toString(), 350, currentY);
            doc.text(`${item.unitPrice.toLocaleString()} ${invoice.currency}`, 400, currentY);
            doc.text(`${item.total.toLocaleString()} ${invoice.currency}`, 500, currentY);
            currentY += doc.heightOfString(desc, { width: 280 }) + 10;
        });

        // Totals
        doc.moveTo(350, currentY).lineTo(550, currentY).stroke();
        currentY += 10;
        doc.text(`Subtotal:`, 400, currentY);
        doc.text(`${invoice.subtotal.toLocaleString()} ${invoice.currency}`, 500, currentY);

        currentY += 15;
        doc.text(`VAT (${invoice.vatRate}%):`, 400, currentY);
        doc.text(`${invoice.vatAmount.toLocaleString()} ${invoice.currency}`, 500, currentY);

        currentY += 20;
        doc.fontSize(14).fillColor('#C5A059').text(`TOTAL:`, 400, currentY);
        doc.text(`${invoice.totalAmount.toLocaleString()} ${invoice.currency}`, 500, currentY);

        // Notes
        if (invoice.notes) {
            doc.fillColor('#000000').fontSize(10).text('NOTES:', 50, currentY + 40, { underline: true });
            doc.text(invoice.notes, 50, currentY + 55, { width: 300 });
        }

        // Footer
        doc.fontSize(8).fillColor('#999999').text('This is a computer-generated document from the Saudi Horizon Database System.', 50, 720, { align: 'center' });

        doc.end();

        writeStream.on('finish', () => {
            console.log(`--- STEP 3: PDF Generated Successfully ---`);
            console.log(`File Path: ${filePath}`);
            process.exit(0);
        });

    } catch (err) {
        console.error('FAILED TO GENERATE PDF:', err);
        process.exit(1);
    }
}

generatePdfFromDb();
