import express from 'express';
import { createChuongTrinhDaoTao, deleteChuongTrinhDaoTao, getAllChuongTrinhDaoTao, getChuongTrinhDaoTaoById, updateChuongTrinhDaoTao } from '../controllers/chuongTrinhDaoTaoController.js';


export const router = express.Router();

router.get('/', getAllChuongTrinhDaoTao);
router.get('/:id', getChuongTrinhDaoTaoById);
router.post('/', createChuongTrinhDaoTao);
router.put('/:id', updateChuongTrinhDaoTao);
router.delete('/:id', deleteChuongTrinhDaoTao);

export default router;