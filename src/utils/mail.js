const nodemailer = require('nodemailer')
require('dotenv')

const ADMIN = process.env.ADMIN
const PASS = process.env.PASS

const sendMail = {

    // transporter options
    transporter: nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: ADMIN,
            pass: PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    }),
    async welcomeMail (user) {
        await this.transporter.sendMail({
            from: 'LifeSaver',
            to: user.email,
            subject: 'Welcoming into LifeSaver family',
            html: `
                <div>
                    <p>Hey <strong style="text-transform: capitalize;">${user.name}</strong>,<br><br>
                    Thanks for coming along with us. Hope you have a great time here!<br><br>

                    Regards,<br>
                    LifeSaver
                </div>
            `
        }, (err, info) => {
            if (err) {
                return { message: 'Error sending E-mail!' }
            }
            return { message: 'E-mail successfully sent!', mailInfo: info }
        })
    },
    async goodbyeMail (user) {
        await this.transporter.sendMail({
            from: 'LifeSaver',
            to: user.email,
            subject: 'Departing from LifeSaver family',
            html: `
                <div>
                    <p>Hey <strong style="text-transform: capitalize;">${user.name}</strong>,<br><br>
                    Thanks for all your valuable time and memories with us. Hope you had a great time here!<br><br>

                    Adios,<br>
                    LifeSaver
                </div>
            `
        }, (err, info) => {
            if (err) {
                return { message: 'Error sending E-mail!' }
            }
            return { message: 'E-mail successfully sent!', mailInfo: info }
        })
    },
    async notifyDonorMail (donor, requestor, reqGroup) {
        await this.transporter.sendMail({
            from: 'LifeSaver',
            to: donor.email,
            subject: `New Ping from LifeSaver`,
            html: `
                <div>
                    <p>Hey <strong style="text-transform: capitalize;">${donor.name}</strong>,<br>
                    We got a ping for you as below person needs blood that matches with your blood type<br><br>

                    <p>Name: <span style="text-transform: capitalize;">${requestor.name}</span></p>
                    <p>Blood Group: ${reqGroup}</p>
                    <p>Contact: ${requestor.mobile}</p>
                    <p>Location: <span style="text-transform: capitalize;">${requestor.location}</span></p><br><br>

                    Regards,<br>
                    LifeSaver
                </div>
            `
        }, (err, info) => {
            if (err) {
                return { message: 'Error sending E-mail!' }
            }
            return { message: 'E-mail successfully sent!', mailInfo: info }
        })
    }

}

module.exports = {
    sendMail: sendMail
}
