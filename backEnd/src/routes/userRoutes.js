import express from 'express'
import { getAllUsers, getUserById, deleteUser,updateUser } from '../controllers/usercontroller.js'

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

export default router;