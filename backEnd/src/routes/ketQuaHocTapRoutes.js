import express from 'express';
import {  updateDiemSinhVien,getBangDiemCaNhan,getDiemByLopHocPhan,dangKyMonHoc,getDiemSinhVienTrongLop } from '../controllers/ketQuaHocTapController.js';

const router = express.Router();

router.get('/lophocphan/:lopHocPhanId', getDiemByLopHocPhan);
router.put('/update-diem', updateDiemSinhVien);

router.get('/sinhvien/:sinhVienId', getBangDiemCaNhan);
router.post('/dang-ky-mon-hoc', dangKyMonHoc);
router.get('/chitiet/:lopHocPhanId/:sinhVienId', getDiemSinhVienTrongLop);


export default router;