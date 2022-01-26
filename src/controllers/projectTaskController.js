const {ProjectTask, UserProject } = require('../models');

exports.create = async (req, res) => {
    try {
        const newProjectTask = new ProjectTask({
            name: req.body.name,
            quantity: req.body.quantity,
            performed: 0,
            project: req.body.projectId
        });
        const savedTask = await newProjectTask.save();
        res.status(201).json(savedTask);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getAll = async (req, res) => {
    try {
        const list = await ProjectTask.find({}).populate('project').sort('-createdAt');
        res.status(200).json(list);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getOne = async (req, res) => {
    try {
        const projectTask = await ProjectTask.findById(req.params.id).populate('project');
        res.status(200).json(projectTask);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.update = async (req, res) => {
    try {
        const projectTask = await ProjectTask.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }
        );
        res.status(200).json(projectTask);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.delete = async (req, res) => {
    try {
        await UserProject.deleteMany({projectTask: req.params.id});
        await ProjectTask.findByIdAndDelete(req.params.id);
        res.status(200).json('Deleted');
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}