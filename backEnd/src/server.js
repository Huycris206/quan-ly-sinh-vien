import express from 'express';
import { connectDB } from './config/database.js';

import lopHocPhanRoute from './routes/lopHocPhanRoutes.js';
import sinhVienRoute from './routes/sinhVienRoutes.js';
import userRoute from './routes/userRoutes.js';
import nghanhRoute from './routes/nganhRoutes.js';
import monHocRoute from './routes/monHocRoutes.js';
import chuyenNganhRoute from './routes/chuyenNganhRoutes.js';
import giangVienRoute from './routes/giangVienRoutes.js';
import authRoute from './routes/authRoutes.js';
// import ChuongTrinhDaoTaoRoute  from './routes/chuongTrinhDaoTaoRoutes.js';

import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
connectDB();
//chayThu();

// app.use('/api/chuongtrinhdaotao', ChuongTrinhDaoTaoRoute);
app.use('/api/auth', authRoute);
app.use('/api/giangvien', giangVienRoute);
app.use('/api/chuyennganh', chuyenNganhRoute);
app.use('/api/lophocphan', lopHocPhanRoute);
app.use('/api/monhoc',monHocRoute);
app.use('/api/nganh', nghanhRoute);
app.use('/api/sinhvien', sinhVienRoute);
app.use('/api/user', userRoute);

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});