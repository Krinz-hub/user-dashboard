import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', TaskController.getTasks);
router.post('/', validate(createTaskSchema), TaskController.createTask);
router.get('/:id', TaskController.getTaskById);
router.patch('/:id', validate(updateTaskSchema), TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;
