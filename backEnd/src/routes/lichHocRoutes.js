import {createLichHoc, updateLichHoc, deleteLichHoc, getAllLichHoc,getLichHocById} from '../controllers/lichHocController.js';
import express from 'express';

const router = express.Router();

router.get('/', getAllLichHoc);
router.get('/:id', getLichHocById);
router.post('/', createLichHoc);
router.put('/:id', updateLichHoc);
router.delete('/:id', deleteLichHoc);

export default router;