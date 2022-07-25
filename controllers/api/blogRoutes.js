const router = require('express').Router();
const req = require('express/lib/request');
const { Blog } = require('../../models');
const hasAuth = require('../../utils/auth');

router.post('/', hasAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', hasAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(400).json({ message: 'No blog post with this id was found.' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
