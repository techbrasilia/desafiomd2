const { User } = require('../models')

class SessionController {
  async create (req, res) {
    return res.render('auth/signin')
  }

  async store (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email: email } })

    if (!user) {
      req.flash('error', 'usuario não encontrado')

      return res.redirect('/')
    }

    if (!(await user.checkPassword(password))) {
      req.flash('error', 'Senha incorreta')
      return res.redirect('/')
    }

    req.session.user = user

    if (req.session.user && req.session.user.provider === true) {
      return res.redirect('/app/appointments/index')
    }

    return res.redirect('/app/dashboard')
  }

  destroy (req, res) {
    req.session.destroy(() => {
      res.clearCookie('root')
      return res.redirect('/')
    })
  }
}

module.exports = new SessionController()
