import express from 'express'
import { getAllUsers, getUserById, deleteUser, updateUser, login, createUser } from '../controllers/taiKhoancontroller.js'

const router = express.Router();

router.post('/login', login);
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

export default router;