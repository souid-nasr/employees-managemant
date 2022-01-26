const { Project, ProjectTask, UserProject } = require('../models');

exports.create = async (req, res) => {
    try {
        const newProject = new Project({
            name: req.body.name
        });
        const savedProject = await newProject.save();
        savedProject._doc.quantity = 0;
        savedProject._doc.performed = 0;
        savedProject._doc.projectTasks = [];
        res.status(201).json(savedProject);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getAll = async (req, res) => {
    try {
        const list = await Project.find({}).sort('-createdAt');
        for (const project of list) {
            const projectTasks = await ProjectTask.find({project: project._id});
            project._doc.quantity = projectTasks.reduce(
                (total, item) => total + Number(item.quantity),
                0
            );
            project._doc.performed = projectTasks.reduce(
                (total, item) => total + Number(item.performed),
                0
            );
            project._doc.projectTasks = projectTasks;
        }
        res.status(200).json(list);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getOne = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        const projectTasks = await ProjectTask.find({project: project._id});
        project._doc.quantity = projectTasks.reduce(
            (total, item) => total + Number(item.quantity),
            0
        );
        project._doc.performed = projectTasks.reduce(
            (total, item) => total + Number(item.performed),
            0
        );
        project._doc.projectTasks = projectTasks;
        res.status(200).json(project);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.update = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }
        );
        res.status(200).json(project);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.delete = async (req, res) => {
    try {
        await ProjectTask.deleteMany({project: req.params.id});
        await UserProject.deleteMany({project: req.params.id});
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json('Deleted');
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}