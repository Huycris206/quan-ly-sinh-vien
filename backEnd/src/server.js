import express from 'express';
import { connectDB } from './config/database.js';
import { SinhVien, ChuyenNganh, Nganh, User } from './models/index.js';
import sinhVienRoute from './routes/sinhVienRoutes.js';
import userRoute from './routes/userRoutes.js';
import nghanhRoute from './routes/nganhRoutes.js';
import monHocRoute from './routes/monHocRoutes.js'
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
connectDB();
//chayThu();

app.use('/api/monhoc',monHocRoute);
app.use('/api/nganh', nghanhRoute);
app.use('/api/sinhvien', sinhVienRoute);
app.use('/api/user', userRoute);

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});