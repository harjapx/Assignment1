const Comment = require('../models/commentModel');
const Discussion = require('../models/discussionModel');

exports.createComment = async (req, res) => {
  const { discussionId, text } = req.body;
  const userId = req.user.id;

  try {
    const newComment = new Comment({
      user: userId,
      discussion: discussionId,
      text
    });

    const comment = await newComment.save();
    await Discussion.findByIdAndUpdate(discussionId, { $push: { comments: comment.id } });
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(id, updates, { new: true });
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    if (comment.user.toString() !== userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // await comment.remove();
    await Discussion.findByIdAndUpdate(comment.discussion, { $pull: { comments: comment.id } });
    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
