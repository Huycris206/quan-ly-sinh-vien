import express from 'express';
import {  updateDiemSinhVien,getBangDiemCaNhan,getDiemByLopHocPhan,dangKyMonHoc } from '../controllers/ketQuaHocTapController.js';

const router = express.Router();

router.get('/:lopHocPhanId', getDiemByLopHocPhan);
router.put('/update-diem', updateDiemSinhVien);

router.get('/:sinhVienId', getBangDiemCaNhan);
router.post('/dang-ky-mon-hoc', dangKyMonHoc);


export default router;