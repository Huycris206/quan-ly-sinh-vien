import express from 'express';
import {  getDiemByLopHocPhan, getBangDiemCaNhan,dangKyHocPhan,getAllKetQuaHocTap,nhapDiemHocPhan } from '../controllers/ketQuaHocTapController.js';

const router = express.Router();

router.get('/', getAllKetQuaHocTap);
router.get('/:idLop', getDiemByLopHocPhan);
router.get('/:idSinhVien', getBangDiemCaNhan);
router.post('/dang-ky-mon', dangKyHocPhan);
router.put('/nhap-diem', nhapDiemHocPhan);


export default router;