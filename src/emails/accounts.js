const sgMail=require('@sendgrid/mail');

const sendgridAPIKey='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';

sgMail.setApiKey(sendgridAPIKey);


sgMail.send({
    to:'dineshmittal1618@gmail.com',
    from:'dineshmittal1618@gmail.com',
    subject:'HEllO Their!',
    text:'Hii'
}).catch(e=>console.log(e)
)