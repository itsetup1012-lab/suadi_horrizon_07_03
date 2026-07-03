import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

// ─── Saudi Horizon brand palette ────────────────────────────────────────────
const COLORS = {
    navy: [10, 22, 40] as [number, number, number],       // #0A1628
    gold: [197, 160, 89] as [number, number, number],     // #C5A059
    darkGold: [139, 105, 20] as [number, number, number], // #8B6914
    white: [255, 255, 255] as [number, number, number],
    lightGray: [248, 249, 250] as [number, number, number],
    mediumGray: [107, 114, 128] as [number, number, number],
    borderLine: [229, 231, 235] as [number, number, number],
};

// ─── ZATCA Company details ─────────────────────────────────────────────────
const SELLER = {
    name: 'Saudi Horizon CO -',
    nameAr: 'شركة الافق السعودية',
    vatNumber: '314220735100003',
    crNumber: '7051614738',
    address: 'Bldg 8550, Omar Bin Al Khattab St, Dallah Industrial, Dammam 34225',
    tagline: 'Heavy Equipment Parts Supplier',
    website: 'www.saudihorizon.online',
    email: 'info@saudihorizon.online',
};

export interface InvoiceData {
    invoiceNumber: string;
    date: string;
    dueDate?: string;
    customer: {
        name: string;
        company?: string;
        email: string;
        phone?: string;
        address?: string;
    };
    items: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }>;
    subtotal: number;
    vatRate: number;
    vatAmount: number;
    totalAmount: number;
    currency: string;
    notes?: string;
    status: string;
}

// ─── ZATCA TLV QR Code Generator ───────────────────────────────────────────
// Tags: 1=Seller, 2=VAT#, 3=Timestamp, 4=Total, 5=VAT Amount
function generateZATCATLV(data: InvoiceData): string {
    const encoder = new TextEncoder();

    function tlv(tag: number, value: string): Uint8Array {
        const valueBytes = encoder.encode(value);
        const result = new Uint8Array(2 + valueBytes.length);
        result[0] = tag;
        result[1] = valueBytes.length;
        result.set(valueBytes, 2);
        return result;
    }

    const parts = [
        tlv(1, SELLER.name),
        tlv(2, SELLER.vatNumber),
        tlv(3, new Date().toISOString()),
        tlv(4, data.totalAmount.toFixed(2)),
        tlv(5, data.vatAmount.toFixed(2)),
    ];

    const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const part of parts) {
        combined.set(part, offset);
        offset += part.length;
    }

    return Buffer.from(combined).toString('base64');
}

// ─── Main PDF Generator ────────────────────────────────────────────────────
export async function generateInvoicePDFServer(data: InvoiceData): Promise<Buffer> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    // ═══════════════════════════════════════════════════════════════════════
    // HEADER — Dark navy bar with Saudi Horizon branding
    // ═══════════════════════════════════════════════════════════════════════
    doc.setFillColor(...COLORS.navy);
    doc.rect(0, 0, pageWidth, 42, 'F');

    // --- LOGO & HEADER ---
    try {
        const logoPath = path.join(process.cwd(), 'public', 'logo.png');
        if (fs.existsSync(logoPath)) {
            const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
            // The provided logo is roughly horizontal but tall because of white space.
            // 50x35 fits well in the 42mm header
            doc.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', margin, 2, 50, 38);
        }
    } catch (err) {
        console.error('Logo loading failed:', err);
        // Fallback to text if logo fails
        doc.setTextColor(...COLORS.gold);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('SAUDI HORIZON', margin, 18);
    }

    // TAX INVOICE label (right side — ZATCA requires this)
    doc.setTextColor(...COLORS.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('TAX INVOICE', pageWidth - margin, 16, { align: 'right' });

    // Invoice Number
    doc.setTextColor(139, 157, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(data.invoiceNumber, pageWidth - margin, 25, { align: 'right' });

    // Status Badge
    const statusColors: Record<string, { bg: [number, number, number]; text: [number, number, number] }> = {
        draft: { bg: [254, 243, 199], text: [146, 64, 14] },
        sent: { bg: [219, 234, 254], text: [30, 64, 175] },
        paid: { bg: [209, 250, 229], text: [6, 95, 70] },
        overdue: { bg: [254, 226, 226], text: [153, 27, 27] },
        cancelled: { bg: [243, 244, 246], text: [55, 65, 81] },
    };
    const statusStyle = statusColors[data.status.toLowerCase()] || statusColors.draft;

    doc.setFillColor(...statusStyle.bg);
    const badgeWidth = 25;
    doc.roundedRect(pageWidth - margin - badgeWidth, 30, badgeWidth, 6, 1, 1, 'F');
    doc.setTextColor(...statusStyle.text);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(data.status.toUpperCase(), pageWidth - margin - (badgeWidth / 2), 34, { align: 'center' });

    // ═══════════════════════════════════════════════════════════════════════
    // SELLER & BUYER INFO — Two-column layout
    // ═══════════════════════════════════════════════════════════════════════
    let y = 55;

    // --- SELLER INFO (Left) ---
    doc.setTextColor(...COLORS.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('FROM (SELLER)', margin, y);
    y += 6;

    doc.setTextColor(...COLORS.navy);
    doc.setFontSize(10);
    doc.text(SELLER.name, margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.mediumGray);
    doc.text(SELLER.address, margin, y);
    y += 4;
    doc.text(`VAT: ${SELLER.vatNumber}`, margin, y);
    y += 4;
    doc.text(`CR: ${SELLER.crNumber}`, margin, y);
    y += 7;

    // --- BUYER INFO (Left, below seller) ---
    doc.setTextColor(...COLORS.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('BILL TO (BUYER)', margin, y);
    y += 6;

    doc.setTextColor(...COLORS.navy);
    doc.setFontSize(10);
    doc.text(data.customer.name, margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.mediumGray);

    if (data.customer.company) {
        doc.text(data.customer.company, margin, y);
        y += 4;
    }
    doc.text(data.customer.email, margin, y);
    y += 4;
    if (data.customer.phone) {
        doc.text(data.customer.phone, margin, y);
        y += 4;
    }
    if (data.customer.address) {
        const addrLines = doc.splitTextToSize(data.customer.address, 80);
        doc.text(addrLines, margin, y);
        y += (addrLines.length * 4);
    }

    // --- INVOICE DETAILS (Right column) ---
    let rightY = 55;
    doc.setTextColor(...COLORS.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('INVOICE DETAILS', pageWidth / 2 + 10, rightY);
    rightY += 7;

    const details = [
        ['Invoice Date:', data.date],
        ['Due Date:', data.dueDate || 'Upon Receipt'],
        ['Currency:', data.currency],
        ['VAT Rate:', `${data.vatRate}%`],
        ['Payment:', 'Bank Transfer / Online'],
    ];

    details.forEach(([label, value]) => {
        doc.setTextColor(...COLORS.mediumGray);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(label, pageWidth / 2 + 10, rightY);
        doc.setTextColor(...COLORS.navy);
        doc.setFont('helvetica', 'normal');
        doc.text(value, pageWidth / 2 + 45, rightY);
        rightY += 5;
    });

    y = Math.max(y, rightY) + 8;

    // ═══════════════════════════════════════════════════════════════════════
    // ITEMS TABLE — Professional with VAT column
    // ═══════════════════════════════════════════════════════════════════════
    autoTable(doc, {
        startY: y,
        head: [['#', 'DESCRIPTION', 'QTY', 'UNIT PRICE', 'VAT', 'TOTAL (INC. VAT)']],
        body: data.items.map((item, i) => {
            const lineVat = +(item.total * data.vatRate / 100).toFixed(2);
            const lineTotal = +(item.total + lineVat).toFixed(2);
            return [
                i + 1,
                item.description.replace(/\\n/g, '\n'),
                item.quantity,
                `${data.currency} ${item.unitPrice.toLocaleString('en-SA', { minimumFractionDigits: 2 })}`,
                `${data.currency} ${lineVat.toLocaleString('en-SA', { minimumFractionDigits: 2 })}`,
                `${data.currency} ${lineTotal.toLocaleString('en-SA', { minimumFractionDigits: 2 })}`
            ];
        }),
        headStyles: {
            fillColor: COLORS.navy,
            textColor: COLORS.gold,
            fontSize: 8,
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 8 },
            1: { halign: 'left' },
            2: { halign: 'center', cellWidth: 15 },
            3: { halign: 'right', cellWidth: 35 },
            4: { halign: 'right', cellWidth: 30 },
            5: { halign: 'right', cellWidth: 35, fontStyle: 'bold' }
        },
        styles: {
            fontSize: 8,
            cellPadding: 3,
            lineColor: COLORS.borderLine,
            lineWidth: 0.1,
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250]
        },
        margin: { left: margin, right: margin }
    });

    // @ts-ignore
    y = doc.lastAutoTable.finalY + 8;

    // ═══════════════════════════════════════════════════════════════════════
    // TOTALS — Right-aligned summary
    // ═══════════════════════════════════════════════════════════════════════
    const totalsLeft = pageWidth - margin - 85;

    doc.setFontSize(9);
    doc.setTextColor(...COLORS.mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal (Excl. VAT):', totalsLeft, y);
    doc.setTextColor(...COLORS.navy);
    doc.text(`${data.currency} ${data.subtotal.toLocaleString('en-SA', { minimumFractionDigits: 2 })}`, pageWidth - margin, y, { align: 'right' });
    y += 6;

    doc.setTextColor(...COLORS.mediumGray);
    doc.text(`VAT (${data.vatRate}%):`, totalsLeft, y);
    doc.setTextColor(...COLORS.navy);
    doc.text(`${data.currency} ${data.vatAmount.toLocaleString('en-SA', { minimumFractionDigits: 2 })}`, pageWidth - margin, y, { align: 'right' });
    y += 8;

    // Grand Total Box
    doc.setFillColor(...COLORS.navy);
    doc.rect(totalsLeft - 5, y - 4, 90, 12, 'F');

    doc.setTextColor(...COLORS.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TOTAL DUE (INC. VAT):', totalsLeft, y + 4);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(`${data.currency} ${data.totalAmount.toLocaleString('en-SA', { minimumFractionDigits: 2 })}`, pageWidth - margin, y + 4, { align: 'right' });
    y += 20;

    // ═══════════════════════════════════════════════════════════════════════
    // NOTES (left) + QR CODE (right)
    // ═══════════════════════════════════════════════════════════════════════
    const qrStartY = y;

    // Notes (left side)
    if (data.notes) {
        doc.setTextColor(...COLORS.gold);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('NOTES', margin, y);
        y += 5;

        doc.setTextColor(...COLORS.mediumGray);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const noteLines = doc.splitTextToSize(data.notes, 90);
        doc.text(noteLines, margin, y);
    }

    // QR Code (right side — ZATCA compliant TLV)
    try {
        const tlvBase64 = generateZATCATLV(data);
        const qrDataUrl = await QRCode.toDataURL(tlvBase64, {
            width: 200,
            margin: 1,
            color: { dark: '#0A1628', light: '#FFFFFF' },
            errorCorrectionLevel: 'M',
        });
        const qrSize = 35;
        const qrX = pageWidth - margin - qrSize;
        const qrY = qrStartY;

        // QR code border
        doc.setDrawColor(...COLORS.borderLine);
        doc.setLineWidth(0.3);
        doc.rect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 12, 'S');

        // Add QR image
        doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

        // QR label
        doc.setTextColor(...COLORS.mediumGray);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.text('ZATCA E-Invoice QR', qrX + qrSize / 2, qrY + qrSize + 4, { align: 'center' });
        doc.text('Scan to verify', qrX + qrSize / 2, qrY + qrSize + 8, { align: 'center' });
    } catch (qrErr) {
        console.error('QR Code generation failed:', qrErr);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // FOOTER — Company info + compliance notice
    // ═══════════════════════════════════════════════════════════════════════
    const footerY = pageHeight - 28;
    doc.setDrawColor(...COLORS.borderLine);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    doc.setFontSize(7);
    doc.setTextColor(...COLORS.mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text(`${SELLER.name}  •  ${SELLER.tagline}  •  VAT: ${SELLER.vatNumber}`, pageWidth / 2, footerY + 5, { align: 'center' });
    doc.text(`${SELLER.website}  •  ${SELLER.email}  •  ${SELLER.address}`, pageWidth / 2, footerY + 10, { align: 'center' });

    doc.setFontSize(6);
    doc.setTextColor(160, 160, 160);
    doc.text('This is a computer-generated tax invoice in accordance with ZATCA e-invoicing regulations.', pageWidth / 2, footerY + 16, { align: 'center' });

    return Buffer.from(doc.output('arraybuffer'));
}
