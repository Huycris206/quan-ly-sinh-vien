import express from "express";
import {
  createSinhVien,
  deleteSinhVien,
  getAllSinhVien,
  getSinhVienById,
  updateSinhVien,
} from "../controllers/sinhVienController.js";

const router = express.Router();

// 1. Lấy danh sách tất cả sinh viên
router.get("/", getAllSinhVien);
// 2. Lấy thông tin chi tiết 1 sinh viên theo ID
router.get("/:id", getSinhVienById);    
// 3. Thêm mới sinh viên
router.post("/", createSinhVien);
// 4. Xóa sinh viên (Soft Delete)
router.delete("/:id", deleteSinhVien);
// 5. Cập nhật thông tin sinh viên
router.put("/:id", updateSinhVien);

export default router;