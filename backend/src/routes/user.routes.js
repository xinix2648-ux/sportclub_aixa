const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', authorizeRole(['admin']), userController.create);
router.put('/:id', authorizeRole(['admin']), userController.update);
router.delete('/:id', authorizeRole(['admin']), userController.remove);

module.exports = router;