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
        {
          model: Comment,
          attributes: ['content', 'user_id', 'date_created'],
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    // const commentData = await Comment.findAll({
    //   where: {
    //     blog_id: req.params.id,
    //   },
    //   include: [
    //     {
    //       model: Blog,
    //       model: User,
    //     },
    //   ],
    // });

    const blog = blogData.get({ plain: true });
    // const comments = commentData.map((comment) => comment.get({ plain: true }));

    res.render('blog', {
      ...blog,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile', hasAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', async (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  res.render('login');
});


module.exports = router;
