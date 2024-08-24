const express = require('express');
const {
  getUsers,
  getUserById,
  createOrLoginUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');

const router = express.Router();

router.get('/', userAuthMiddleware, getUsers);
router.get('/:id', userAuthMiddleware, getUserById);
router.post('/', userAuthMiddleware, createOrLoginUser);
router.put('/:id', userAuthMiddleware, updateUser);
router.delete('/:id', userAuthMiddleware, deleteUser);

module.exports = router;
