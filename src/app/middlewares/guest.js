module.exports = (req, res, next) => {
  if (req.session && !req.session.user) {
    return next()
  }
  if (req.session && req.session.user && req.session.user.provider === true) {
    return res.redirect('/app/appointments/index')
  }

  return res.redirect('/app/dashboard')
}
