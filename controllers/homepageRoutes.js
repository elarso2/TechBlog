const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const hasAuth = require('../utils/auth');

router.get('/', (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    res.render('homepage', {
      blogs,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blog/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: 'username',
        },
      ],
    });

    const commentData = await Comment.findAll({
      where: {
        blog_id: req.params.id,
      },
      include: [
        {
          model: Blog,
          model: User,
        },
      ],
    });

    const blogs = blogData.get({ plain: true });
    const comments = commentData.map((comment) => comment.get({ plain: true }));

    res.render('blog', {
      ...blogs,
      comments,
      blog_id: req.params.id,
      current_user: req.params.user_id,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
