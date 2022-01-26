const jwt = require('jsonwebtoken');
const { User, UserProject, UserPlace, ProjectTask, Project, Place } = require('../models');
//lot
exports.create = async (req, res) => {
    const {
        phoneNumber,
        idNumber,
    } = req.body;
    try {
        let user = await User.findOne({phoneNumber: phoneNumber});
        if (user) return res.status(403).json('Phone number already registered for another account');

        user = await User.findOne({idNumber: idNumber});
        if (user) return res.status(403).json('Id number already registered for another account');

        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        const token = jwt.sign({
            id: savedUser._id
        }, process.env.TOKEN_SECRET_KEY);

        res.status(201).json({
            user: savedUser,
            token
        });
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getAll = async (req, res) => {
    try {
        const list = await User.find({}).sort('-createdAt');
        for (const user of list) {
            const project = await UserProject.find({
                user: user._id
            }).sort('-createdAt');
            user._doc.project = project;
        }
        res.status(200).json(list)
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getOne = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const userProject = await UserProject.find({
            user: req.params.id
        }).populate('project').populate('projectTask').sort('-createdAt');
        const userPlaceVisit = await UserPlace.find({
            user: req.params.id
        }).populate('place').sort('-createdAt');

        user._doc.performed = userProject;
        user._doc.placeVisited = userPlaceVisit;

        res.status(200).json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.update = async (req, res) => {
    const {
        phoneNumber,
        idNumber,
    } = req.body;
    try {
        let user = await User.findOne({phoneNumber: phoneNumber});
        if (user && user._id.toString() !== req.params.id) return res.status(403).json('Phone number already registered for another account');

        user = await User.findOne({idNumber: idNumber});
        if (user && user._id.toString() !== req.params.id) return res.status(403).json('Id number already registered for another account');

        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }
        );
        res.status(200).json(updateUser);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await UserProject.deleteMany({user: id});
        await UserPlace.deleteMany({user: id});
        await User.findByIdAndDelete(id);
        res.status(200).json('Deleted');
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// add performed to user

exports.performed = async (req, res) => {
    try {
        const {
            userId,
            projectId,
            projectTaskId
        } = req.body;
        const newProject = new UserProject({
            user: userId,
            project: projectId,
            projectTask: projectTaskId
        });
        const savedUserProject = await newProject.save();
        await ProjectTask.findOneAndUpdate({
            _id: projectTaskId
        },{
            $inc: { performed: +1 }
        });

        savedUserProject._doc.project = await Project.findById(projectId);
        savedUserProject._doc.projectTask = await ProjectTask.findById(projectTaskId);
        res.status(201).json(savedUserProject);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// get places of user

exports.getAllPlace = async (req, res) => {
    try {
        const list = await Place.find({
            creator: req.params.userId
        });
        res.status(200).json(list);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// user check in place

exports.checkinPlace = async (req, res) => {
    try {
        const newVisit = new UserPlace({
            user: req.user._id,
            place: req.body.placeId
        });
        const savedUserPlace = await newVisit.save();
        res.status(201).json(savedUserPlace);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// get place that user checked in

exports.placeVisited = async (req, res) => {
    try {
        const list = await UserPlace.find({user: req.params.userId}).populate('place');
        res.status(200).json(list);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}