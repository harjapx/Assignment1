const express = require('express');
const router = express.Router();
const { createDiscussion, updateDiscussion, deleteDiscussion, getDiscussionsByText, getDiscussionsByTags, getDiscussion } = require('../controllers/discussionController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, createDiscussion);
router.put('/:id', auth, updateDiscussion);
router.delete('/:id', auth, deleteDiscussion);
router.get('/search/text', auth, getDiscussionsByText);
router.get('/search/tags', auth, getDiscussionsByTags);
router.get('/:id', getDiscussion);


module.exports = router;
