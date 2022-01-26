const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
const { Admin, User, Place, Project, ProjectTask, UserProject } = require('../models');

exports.login = async (req, res) => {
    try {
        const admin = await Admin.findOne({
            username: req.body.username
        });
        if (!admin) return res.status(401).json('Wrong username');
        const decryptedPass = CryptoJs.AES.decrypt(
            admin.password,
            process.env.PASSWORD_SECRET_KEY
        ).toString(CryptoJs.enc.Utf8);
        if (decryptedPass !== req.body.password) return res.status(401).json('Wrong password');

        const token = jwt.sign({
            id: admin._id
        }, process.env.TOKEN_SECRET_KEY);
        admin.password = undefined;

        res.status(200).json({
            token,
            admin
        });
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// admin dashboard summary data
exports.summary = async (req, res) => {
    try {
        const totalUser = await User.find({}).count();
        const totalPlace = await Place.find({}).count();

        // count user who has been performed
        const userPerformed = await UserProject.aggregate([{
            $group: { _id: "$user" }
        }]).count("user");

        // count total project hour
        const totalProjectHour = await ProjectTask.aggregate([{
            $group: {
                _id: null,
                quantity: { $sum: "$quantity" }
            }
        }]);

        // count total used project TASK
        const totalProjectHourUsed = await ProjectTask.aggregate().group({
            _id: null,
            performed: { $sum: "$performed" }
        });

        // get latest project task
        const latestProjectTask = await ProjectTask.find({}).sort('-createdAt').limit(4).populate('project');

        // count user who has 3 project TASK
        const userWithLeave = await UserProject.aggregate().group({
            _id: "$user",
            quantity: { $sum: +1 }
        }).match({"quantity": { $gte: 3 }}).count('count');

        // count user who has >= 5 PROJECT TASK
        const userWithoutLeave = await UserProject.aggregate().group({
            _id: "$user",
            quantity: { $sum: +1 }
        }).match({"quantity": { $gte: 5 }}).count('count');

        res.status(200).json({
            totalUser,
            totalPlace,
            userPerformed: userPerformed[0] ? userPerformed[0].user : 0,
            availableProjectHour: (totalProjectHour[0] ? totalProjectHour[0].quantity : 0) - (totalProjectHourUsed[0] ? totalProjectHourUsed[0].performed : 0),
            latestProjectTask,
            userPerformedAnalyst: {
                totalUser,
                userWithoutLeave: userWithoutLeave[0] ? userWithoutLeave[0].count : 0,
                userWithLeave: userWithLeave[0] ? userWithLeave[0].count : 0,
                userWithZeroDose: totalUser - (userPerformed[0] ? userPerformed[0].user : 0)
            }
        });
    } catch(err) {
        console.log(err);
        res.status(500).json(err)
    }
}