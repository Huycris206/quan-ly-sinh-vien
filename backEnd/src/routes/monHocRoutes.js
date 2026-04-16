import express from "express";
import {createMonHoc, deleteMonHoc, getAllMonHoc, getMonHocById, updateMonHoc} from "../controllers/monHocController.js";

const router =express.Router();

router.get('/',getAllMonHoc);
router.get('/:id',getMonHocById);
router.put('/:id',updateMonHoc);
router.post('/',createMonHoc);
router.delete('/:id',deleteMonHoc);

export default router