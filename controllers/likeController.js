const Like = require('../models/likeModel');
const Discussion = require('../models/discussionModel');
const Comment = require('../models/commentModel');

exports.likeDiscussion = async (req, res) => {
  const { discussionId } = req.body;
  const userId = req.user.id;

  try {
    let like = await Like.findOne({ user: userId, discussion: discussionId });
    if (like) {
      return res.status(400).json({ msg: 'User already liked this discussion' });
    }

    like = new Like({ user: userId, discussion: discussionId });
    await like.save();
    await Discussion.findByIdAndUpdate(discussionId, { $push: { likes: userId } });
    res.json(like);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.unlikeDiscussion = async (req, res) => {
  const { discussionId } = req.body;
  const userId = req.user.id;

  try {
    const like = await Like.findOneAndDelete({ user: userId, discussion: discussionId });
    if (!like) {
      return res.status(400).json({ msg: 'User has not liked this discussion' });
    }

    await Discussion.findByIdAndUpdate(discussionId, { $pull: { likes: userId } });
    res.json({ msg: 'Discussion unliked' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.likeComment = async (req, res) => {
  const { commentId } = req.body;
  const userId = req.user.id;

  try {
    let like = await Like.findOne({ user: userId, comment: commentId });
    if (like) {
      return res.status(400).json({ msg: 'User already liked this comment' });
    }

    like = new Like({ user: userId, comment: commentId });
    await like.save();
    await Comment.findByIdAndUpdate(commentId, { $push: { likes: userId } });
    res.json(like);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.unlikeComment = async (req, res) => {
  const { commentId } = req.body;
  const userId = req.user.id;

  try {
    const like = await Like.findOneAndDelete({ user: userId, comment: commentId });
    if (!like) {
      return res.status(400).json({ msg: 'User has not liked this comment' });
    }

    await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } });
    res.json({ msg: 'Comment unliked' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
