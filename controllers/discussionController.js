const Discussion = require('../models/discussionModel');

exports.createDiscussion = async (req, res) => {
  const { text, image, hashtags } = req.body;
  const userId = req.user.id;

  try {
    const newDiscussion = new Discussion({
      user: userId,
      text,
      image,
      hashtags
    });

    const discussion = await newDiscussion.save();
    res.json(discussion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateDiscussion = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const discussion = await Discussion.findByIdAndUpdate(id, updates, { new: true });
    if (!discussion) {
      return res.status(404).json({ msg: 'Discussion not found' });
    }
    res.json(discussion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteDiscussion = async (req, res) => {
  const { id } = req.params;

  try {
    const discussion = await Discussion.findByIdAndDelete(id);
    if (!discussion) {
      return res.status(404).json({ msg: 'Discussion not found' });
    }
    res.json({ msg: 'Discussion deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getDiscussionsByTags = async (req, res) => {
  const { tags } = req.query;

  if (!tags) {
    return res.status(400).json({ msg: 'Please provide tags to search for' });
  }

  const tagsArray = tags.split(',').map(tag => tag.trim()); // Split tags by comma and trim whitespace

  try {
    const discussions = await Discussion.find({ tags: { $in: tagsArray } });

    if (!discussions.length) {
      return res.status(404).json({ msg: 'No discussions found' });
    }

    res.json(discussions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getDiscussionsByText = async (req, res) => {
  const { searchText } = req.query;

  if (!searchText) {
    return res.status(400).json({ msg: 'Please provide a search text' });
  }

  try {
    const regex = new RegExp(searchText, 'i'); // 'i' flag makes the search case-insensitive
    const discussions = await Discussion.find({ text: regex });

    if (!discussions.length) {
      return res.status(404).json({ msg: 'No discussions found' });
    }

    res.json(discussions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getDiscussion = async (req, res) => {
  const { id } = req.params;

  try {
    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return res.status(404).json({ msg: 'Discussion not found' });
    }

    // Increment view count when discussion is viewed
    discussion.viewCount++;
    await discussion.save();

    res.json(discussion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};