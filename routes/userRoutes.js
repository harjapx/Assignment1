const express = require('express');
const router = express.Router();
const { createUser, updateUser, deleteUser, getUsers, searchUser, followUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', createUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
router.get('/', getUsers);
router.get('/search', authMiddleware, searchUser);
router.post('/follow', authMiddleware, followUser);


module.exports = router;
