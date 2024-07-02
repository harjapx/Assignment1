const express = require('express');
const router = express.Router();
const { likeDiscussion, unlikeDiscussion, likeComment, unlikeComment } = require('../controllers/likeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/discussion', authMiddleware, likeDiscussion);
router.delete('/discussion', authMiddleware, unlikeDiscussion);
router.post('/comment', authMiddleware, likeComment);
router.delete('/comment', authMiddleware, unlikeComment);

module.exports = router;
