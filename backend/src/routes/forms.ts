import { Router } from 'express';
import { submitForm, getAllForms, getFormById } from '../controllers/formController';

const router = Router();

router.post('/submit', submitForm);
router.get('/all', getAllForms);
router.get('/:id', getFormById);

export default router;