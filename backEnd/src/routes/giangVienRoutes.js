import express from 'express';
import { createGiangVien, deleteGiangVien,getAllGiangVien, getGiangVienById, updateGiangVien } from '../controllers/giangVienController.js';

const router = express.Router();

router.get('/', getAllGiangVien);
router.get('/:id', getGiangVienById);
router.post('/', createGiangVien);
router.put('/:id', updateGiangVien);
router.delete('/:id', deleteGiangVien);

export default router;