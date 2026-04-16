import express from 'express';
import { createKetQuaHocTap, deleteKetQuaHocTap, getAllKetQuaHocTap, getKetQuaHocTapById, updateKetQuaHocTap } from '../controllers/ketQuaHocTapController.js';

const router = express.Router();

router.get('/', getAllKetQuaHocTap);
router.get('/:id', getKetQuaHocTapById);
router.post('/', createKetQuaHocTap);
router.put('/:id', updateKetQuaHocTap);
router.delete('/:id', deleteKetQuaHocTap);

export default router;