const hasAuth = (req, res, next) => {
  // sends user to login page if they are not logged in
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    next();
  }
};

module.exports = hasAuth;
