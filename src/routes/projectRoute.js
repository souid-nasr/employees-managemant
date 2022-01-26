const router = require('express').Router();

const { projectController, projectTaskController } = require('../controllers');

const tokenHandler = require('../handlers/tokenHandler');

router.post(
    '/',
    tokenHandler.verifyAdminToken,
    projectController.create
);

router.get(
    '/',
    tokenHandler.verifyAdminToken,
    projectController.getAll
);

router.get(
    '/:id',
    tokenHandler.verifyAdminToken,
    projectController.getOne
);

router.put(
    '/:id',
    tokenHandler.verifyAdminToken,
    projectController.update
);

router.delete(
    '/:id',
    tokenHandler.verifyAdminToken,
    projectController.delete
);

// project task

router.post(
    '/tasks',
    tokenHandler.verifyAdminToken,
    projectTaskController.create
)

router.get(
    '/tasks/get-all',
    tokenHandler.verifyAdminToken,
    projectTaskController.getAll
)

router.get(
    '/tasks/:id',
    tokenHandler.verifyAdminToken,
    projectTaskController.getOne
)

router.put(
    '/tasks/:id',
    tokenHandler.verifyAdminToken,
    projectTaskController.update
)

router.delete(
    '/tasks/:id',
    tokenHandler.verifyAdminToken,
    projectTaskController.delete
)

module.exports = router;;