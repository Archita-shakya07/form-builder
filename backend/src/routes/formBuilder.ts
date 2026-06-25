// backend/src/routes/formBuilder.ts
import { Router } from 'express';
import { createForm, getUserForms, getFormResponses, saveResponse } from '../controllers/formBuilderController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/submit/:formId', saveResponse);

// Protected routes
router.post('/create', authMiddleware, createForm);
router.get('/my-forms', authMiddleware, getUserForms);
router.get('/responses/:formId', authMiddleware, getFormResponses);

export default router;