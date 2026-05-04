import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {TaiKhoan} from '../models/index.js'; // Giả định đường dẫn import db của bạn


export const login = async (req, res) => {
    try {
        // Frontend gửi lên 'name' và 'password' (đã khớp với form Shadcn)
        const { name, password } = req.body;

        // 1. Kiểm tra dữ liệu đầu vào
        if (!name || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
        }

        // 2. Tìm tài khoản trong Database bằng Sequelize
        const user = await TaiKhoan.findOne({
            where: {
                TENDANGNHAP: name,
                DAXOA: false // Chỉ cho phép đăng nhập nếu tài khoản chưa bị xóa (soft delete)
            }
        });

        // 3. Xử lý khi không tìm thấy tài khoản
        if (!user) {
            return res.status(401).json({ message: 'Tên đăng nhập không đúng.' });
        }

        // 4. Kiểm tra mật khẩu bằng bcrypt.compare
        // Trích xuất mật khẩu đã băm (hash) từ database để so sánh với chuỗi người dùng nhập
        const isMatch = await bcrypt.compare(password, user.MATKHAU);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        // 5. Đăng nhập thành công -> Tạo JWT Token
        const payload = {
            id: user.ID,
            username: user.TENDANGNHAP,
            role: user.VAITRO
        };

        // Lấy secret key từ biến môi trường (.env)
        const JWT_SECRET = process.env.JWT_SECRET || 'chuoi-bao-mat-mac-dinh-can-thay-doi';
        
        // Tạo token có hạn sử dụng (ví dụ: 1 ngày)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        // 6. Trả về Token và thông tin user cho Frontend
        return res.status(200).json({
            message: 'Đăng nhập thành công',
            token: token,
            user: {
                id: user.ID,
                username: user.TENDANGNHAP,
                role: user.VAITRO,
                avatar: user.ANHDAIDIEN
            }
        });

    } catch (error) {
        console.error("Lỗi API Login:", error);
        return res.status(500).json({ message: 'Lỗi server nội bộ.' });
    }
};