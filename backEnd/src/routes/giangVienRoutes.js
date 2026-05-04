import express from 'express';
import { createGiangVien, 
    deleteGiangVien,
    getAllGiangVien, 
    getGiangVienById,
    updateGiangVien,
    getLopHocPhanByGiangVienView } from '../controllers/giangVienController.js';

const router = express.Router();

router.get('/', getAllGiangVien);
router.get('/:id', getGiangVienById);
router.post('/', createGiangVien);
router.put('/:id', updateGiangVien);
router.delete('/:id', deleteGiangVien);

router.get('/:id/lophocphan', getLopHocPhanByGiangVienView);

export default router;