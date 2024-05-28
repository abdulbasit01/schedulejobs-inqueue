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
const { CronJob } = require('cron')
const init = require('./producer')
const worker = require('./worker')
const app = express();
app.use(express.json());
let task;


app.get('/hit-endpoint', async (req, res) => {
    const id = await init()
    res.json(`done message executed ${id}`)
});
app.get('/execute-manually', async (req, res) => {
    const id = await init()
    res.json(`done message executed ${id}`)
});
const taskFunction = () => {
    console.log('Running the scheduled task...');
};
const scheduleTask = () => {
    task = new CronJob(
        '32 15 * * *',
        function () {
            worker()
            console.log('You will see the message execution');
        },
        null,
        true,
    );
    console.log('task scheduled')
};
app.post('/start', (req, res) => {
    new CronJob(
        '* * * * *',
        function () {
            worker()
            console.log('You will see the message execution');
        },
        null,
        true,
    );
    res.send('Cron job started and executed manually');
});
// Endpoint to stop the cron job
app.post('/stop', (req, res) => {
    if (task.running) {
        task.stop();
        res.send('Cron job stopped');
    } else {
        res.send('Cron job is not running');
    }
});

// Endpoint to manually execute the cron job
app.post('/execute', (req, res) => {
    taskFunction();
    res.send('Cron job executed manually');
});

app.get('/status', (req, res) => {
    res.send(`Cron job is ${task.running ? 'running' : 'not running'}`);
});
app.listen(3000, async () => {
    scheduleTask();
    console.log('server started at 3000')

    // new CronJob(
    //     '32 15 * * *',
    //     function () {
    //         worker()
    //         console.log('You will see the message execution');
    //     },
    //     null,
    //     true,
    // );
});
