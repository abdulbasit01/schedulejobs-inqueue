const Invoice = require('./models/invoice');
const generateRandomInvoice = () => {
    const invoiceNumbers = ['INV001', 'INV002', 'INV003', 'INV004', 'INV005'];
    const amounts = [100.50, 200.75, 150.00, 300.25, 75.00];
    const customerNames = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Emma Lee'];

    const randomInvoiceNumber = invoiceNumbers[Math.floor(Math.random() * invoiceNumbers.length)];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
    const randomCustomerName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const randomStatus = ['active', 'inactive', 'cancelled', 'completed'];
    return {
        invoice_number: randomInvoiceNumber,
        amount: randomAmount,
        customer_name: randomCustomerName,
        created_at: new Date(),
        status: randomStatus[Math.floor(Math.random() * randomStatus.length)]
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
        console.log(`${result.length} documents inserted.`);
    } finally {
        // Close the connection
    }
}


// app.js
const express = require('express');
const mongoose = require('mongoose');
const { scheduleJob, stopJob, startJob, runJobManually, loadJobs } = require('./utils/jobScheduler');
const Job = require('./models/job');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/scheduler', { useUnifiedTopology: true });

app.post('/jobs', async (req, res) => {
    const { name, cronTime, task, startTime, endTime } = req.body;
    const job = new Job({ name, cronTime, task, startTime, endTime, status: 'active' });
    await job.save();
    await scheduleJob(job);
    res.status(201).send(job);
});

app.post('/jobs/:name/stop', async (req, res) => {
    const { name } = req.params;
    await stopJob(name);
    await Job.updateOne({ name }, { status: 'inactive' });
    res.send({ message: `Job "${name}" stopped` });
});

app.post('/jobs/:name/start', async (req, res) => {
    const { name } = req.params;
    await startJob(name);
    res.send({ message: `Job "${name}" started` });
});

app.post('/jobs/:name/run', async (req, res) => {
    const { name } = req.params;
    await runJobManually(name);
    res.send({ message: `Job "${name}" run manually` });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
    // loadJobs(); // Load and schedule jobs on startup
    main()
});
