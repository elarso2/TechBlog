const router = require('express').Router();
const { Blog, User } = require('../../models');
const hasAuth = require('../../utils/auth');

// get all blogs
router.get('/', hasAuth, async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      where: { user_id: req.session.user_id },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const userBlogs = blogData.map((blog) => blog.get({ plain: true }));
    res.render('blog', { userBlogs });
  } catch (err) {
    res.status(404).json(err);
  }
});

// post a blog
router.post('/', hasAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      name: req.body.name,
      content: req.body.content,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete a blog
router.delete('/:id', hasAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog post with this id was found.' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
