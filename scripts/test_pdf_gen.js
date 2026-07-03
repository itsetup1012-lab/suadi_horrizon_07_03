const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable').default || require('jspdf-autotable');
const fs = require('fs');

async function test() {
    try {
        const doc = new jsPDF();
        doc.text("Hello World", 10, 10);

        autoTable(doc, {
            head: [['Column 1', 'Column 2']],
            body: [['Data 1', 'Data 2']],
            startY: 20
        });

        const buffer = Buffer.from(doc.output('arraybuffer'));
        fs.writeFileSync('test_out.pdf', buffer);
        console.log("PDF generated successfully: " + buffer.length + " bytes");
    } catch (e) {
        console.error("FAILED TO GENERATE PDF: ", e);
    }
}

test();
