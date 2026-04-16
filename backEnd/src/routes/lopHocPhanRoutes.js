import express from "express";
import { createLopHocPhan, deleteLopHocPhan, getAllLopHocPhan, getLopHocPhanById, updateLopHocPhan } from "../controllers/lopHocPhanController.js";

const router = express.Router();

router.get('/', getAllLopHocPhan);
router.get('/:id', getLopHocPhanById);
router.post('/', createLopHocPhan);
router.put('/:id', updateLopHocPhan);
router.delete('/:id', deleteLopHocPhan);

export default router;