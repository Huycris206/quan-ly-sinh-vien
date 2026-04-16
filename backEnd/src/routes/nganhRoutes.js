import express from 'express';
import { createNganh, deleteNganh, getAllNganh, getNganhById, updateNganh } from '../controllers/nganhController.js';

const router = express.Router();

router.get('/', getAllNganh);
router.get('/:id', getNganhById);
router.post('/', createNganh);
router.delete('/:id', deleteNganh);
router.put('/:id', updateNganh);

export default router;