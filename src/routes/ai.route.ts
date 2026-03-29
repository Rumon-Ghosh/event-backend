import express from 'express';
import { aiController } from '../controller/ai.controller';

const router = express.Router();

router.post('/suggest', aiController.getAISuggestions);

export const AiRoutes = router;
