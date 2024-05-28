const mongoose = require('mongoose');

// Define schema
const invoiceSchema = new mongoose.Schema({
    invoice_number: { type: String, required: true },
    amount: { type: Number, required: true },
    customer_name: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    status: { type: String, default: 'active' }
});

// Create model
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
