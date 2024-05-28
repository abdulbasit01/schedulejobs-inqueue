const { Queue } = require('bullmq')

const notificationQueue = new Queue('email-queue');


async function init() {
    const response = await notificationQueue.add('email to person', {
        email: "name@dev.co",
        subject: 'test',
        body: 'email body in job queue'
    })
    
    console.log('job added to queue')
    return response.id
}

module.exports = init