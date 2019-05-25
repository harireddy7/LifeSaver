var request = require('request');
require('dotenv').config()

const sendSms = (donors, requestor, bGroup) => {

    const donorContacts = []
    donors.forEach(donor => donorContacts.push(donor.mobile.toString()))

    const msg = `Hey there,\nNew ping for you as below person needs blood that matches with your group\n
Name: ${requestor.name},\nBlood Group: ${bGroup},\nContact: ${requestor.mobile},\nLocation: ${requestor.location},\n\nRegards,\nLifeSaver`

    //https://api.msg91.com/api/sendhttp.php?mobiles=Mobile no.&authkey=$authentication_key&route=4&sender=TESTIN&message=Hello! This is a test message&country=91

    request({
        uri: `${process.env.SMS_URL_PAGE}?mobiles=${donorContacts.join(',')}&authkey=${process.env.AUTH_KEY}&route=4&sender=${process.env.SENDERID}&message=${msg}&country=91`,
    }, function (error, response, body) {
        console.log(body)
    });

}

module.exports = {
    sendSms: sendSms
}
