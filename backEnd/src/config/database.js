import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Nạp các biến môi trường từ file .env
dotenv.config();

// Khởi tạo kết nối Sequelize sử dụng thông tin từ .env
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_SERVER,
        dialect: 'mssql', // Bắt buộc để Sequelize biết đang dùng SQL Server
        port: 1433,
        logging: false,   // Đặt thành console.log nếu bạn muốn xem các câu lệnh SQL sinh ra
        dialectOptions: {
            options: {
                instanceName: process.env.DB_INSTANCE, // Dành cho SQLEXPRESS
                encrypt: false, 
                trustServerCertificate: true
            }
        },
        pool: {
            max: 5,       // Tối đa 5 kết nối cùng lúc
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Hàm kiểm tra kết nối (gọi ở file chạy chính của server như server.js hoặc app.js)
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Đã kết nối thành công tới SQL Server bằng Sequelize!');
        
        
    } catch (error) {
        console.error('❌ Lỗi kết nối CSDL:', error);
        process.exit(1); 
    }
};

// Export mặc định biến sequelize để file models/index.js import vào sử dụng
export default sequelize;