const Invoice = require('./models/invoice');
const generateRandomInvoice = () => {
    const invoiceNumbers = ['INV001', 'INV002', 'INV003', 'INV004', 'INV005'];
    const amounts = [100.50, 200.75, 150.00, 300.25, 75.00];
    const customerNames = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Emma Lee'];

    const randomInvoiceNumber = invoiceNumbers[Math.floor(Math.random() * invoiceNumbers.length)];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
    const randomCustomerName = customerNames[Math.floor(Math.random() * customerNames.length)];

    return {
        invoice_number: randomInvoiceNumber,
        amount: randomAmount,
        customer_name: randomCustomerName,
        created_at: new Date()
    };
};

// Connect to MongoDB and insert bulk random values
async function main() {

    try {

        // Generate random invoices in bulk
        const bulkInvoices = [];
        const numInvoices = 10000;

        for (let i = 0; i < numInvoices; i++) {
            bulkInvoices.push(generateRandomInvoice());
        }

        const result = await Invoice.insertMany(bulkInvoices);
        console.log(`${result.insertedCount} documents inserted.`);
    } finally {
        // Close the connection
    }
}
