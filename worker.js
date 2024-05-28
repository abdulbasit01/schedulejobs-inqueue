const { Worker } = require('bullmq')

const worker = () => new Worker('email-queue', async (job) => {
    console.log('message received', job.id)
    return await sendEmail(5 * 1000)
}, {
    connection: {
        host: "localhost",
        port: 6379
    }
})

const sendEmail = (ms) => new Promise((res, rej) => setTimeout(() => res(), ms))
module.exports = worker