const User = require('../models/user')

const getDonors = async () => {
    const allUsers = [] = await User.find({
        blood_group: req.user.blood_group
    })
    const reqUsers = allUsers.filter(user => user._id.toString() != req.user._id.toString())
    if (reqUsers.length === 0) {
        return res.status(401).send({
            message: 'No Donors Found!'
        })
    }
    reqUsers.forEach((user) => sendMail.notifyDonorMail(user, req.user))
    res.send({
        message: 'successfully sent!'
    })
}