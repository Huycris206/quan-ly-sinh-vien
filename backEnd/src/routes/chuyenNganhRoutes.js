import express from 'express';
import { createChuyenNganh, deleteChuyenNganh, getAllChuyenNganh, getChuyenNganhById, updateChuyenNganh } from '../controllers/chuyenNganhController.js';

const router = express.Router();

router.get('/', getAllChuyenNganh);
router.get('/:id', getChuyenNganhById);
router.post('/', createChuyenNganh);
router.put('/:id', updateChuyenNganh);
router.delete('/:id', deleteChuyenNganh);

export default router;