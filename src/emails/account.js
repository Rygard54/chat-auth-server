const sgMail = require('@sendgrid/mail'); //we require the library

sgMail.setApiKey(process.env.SENDGRID_API_KEY); //we tell sgMail to set the APIKey

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to:email,
        from:'c.roman.5458@gmail.com',
        subject:"Welcome to What A Chat",
        text: `Welcome to the app ${name}. let me know how you get along with the app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to:email,
        from:'c.roman.5458@gmail.com',
        subject:"Goodbye from What A Chat",
        text:`Goodbye ${name} hope you come back soon`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}