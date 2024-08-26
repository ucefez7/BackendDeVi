const express = require('express');
const {
  getUsers,
  getUserById,
  createOrLoginUser,
  updateUser,
  deleteUser,
  searchUsersByName,
} = require('../controllers/userController');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');

const router = express.Router();


//router.post('/', userAuthMiddleware, createOrLoginUser);
router.post('/', createOrLoginUser);
// router.get('/', userAuthMiddleware, getUsers);
router.get('/', getUsers);
// router.get('/:id', userAuthMiddleware, getUserById);
router.get('/:id', getUserById);
// router.get('/search', userAuthMiddleware, searchUsersByName);
router.get('/search',searchUsersByName);
router.post('/', userAuthMiddleware, createOrLoginUser);
router.put('/:id', userAuthMiddleware, updateUser);
router.delete('/:id', userAuthMiddleware, deleteUser);

module.exports = router;
