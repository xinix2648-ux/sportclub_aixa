const { Router } = require('express');
const sportController = require('../controllers/sport.controller');
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate);
router.get('/', sportController.getAll);
router.get('/:id', sportController.getById);
router.post('/', authorizeRole(['admin']), sportController.create);
router.put('/:id', authorizeRole(['admin']), sportController.update);
router.delete('/:id', authorizeRole(['admin']), sportController.remove);
router.patch('/:id/status', authorizeRole(['admin']), sportController.changeStatus);

module.exports = router;