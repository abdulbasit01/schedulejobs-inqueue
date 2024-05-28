// jobScheduler.js
const { Queue, Worker, QueueScheduler } = require('bullmq');
const Redis = require('ioredis');
const Job = require('../models/job');
// Redis connection options with maxRetriesPerRequest set to null
const redisOptions = {
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null,
};
const redisConnection = new Redis(redisOptions);

const jobQueue = new Queue('jobQueue', { connection: redisConnection });

const scheduleJob = async (job) => {
    if (job.status === 'active') {
        await jobQueue.add(job.name, job.task, {
            repeat: { cron: job.cronTime },
            jobId: job.name,
        });
        console.log(`Scheduled job "${job.name}" with cron time "${job.cronTime}"`);
    }
};

const stopJob = async (name) => {
    await jobQueue.removeRepeatableByKey(name);
    console.log(`Stopped job "${name}"`);
};

const startJob = async (name) => {
    const job = await Job.findOne({ name });
    if (job) {
        job.status = 'active';
        await job.save();
        await scheduleJob(job);
    }
};

const runJobManually = async (name) => {
    const job = await Job.findOne({ name });
    if (job) {
        console.log(`Running job "${name}" manually`);
        await jobQueue.add(job.name, job.task, { jobId: `${name}-manual` });
    }
};

const worker = new Worker('jobQueue', async (job) => {
    const now = new Date();
    const dbJob = await Job.findOne({ name: job.name });
    if ((!dbJob.startTime || now >= dbJob.startTime) && (!dbJob.endTime || now <= dbJob.endTime)) {
        // Perform the actual task (replace with your implementation)
        console.log(`Executing task for job: ${job.name}`);
        await updateInvoiceTable(dbJob.task); // Placeholder function
    }
}, { connection: redisConnection });

const updateInvoiceTable = async (task) => {
    // Perform database operations here
    console.log(`Updating invoice table with task: ${task}`);
};

const loadJobs = async () => {
    const jobsFromDb = await Job.find();
    jobsFromDb.forEach(job => scheduleJob(job));
};

module.exports = {
    scheduleJob,
    stopJob,
    startJob,
    runJobManually,
    loadJobs,
};
