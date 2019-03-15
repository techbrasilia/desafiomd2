const { User, Appointment } = require('../models')
const moment = require('moment')
const { Op } = require('sequelize')

class AppointmentController {
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)
    return res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date
    })

    return res.redirect('/app/dashboard')
  }

  async index (req, res) {
    return res.render('appointments/index')
  }

  async agendamentos (req, res) {
    const date = moment(parseInt(req.query.date))

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      },
      include: [User]
    })

    const usuarios = await User.findAll()

    const agendamento = appointments.map(retorno => {
      const data = retorno.date
      const cliente = usuarios.find(a => a.id === retorno.user_id)
      return {
        usuario: cliente,
        data: moment(data).format('D/M/Y')
      }
    })

    return res.render('appointments/appointments', { agendamento })
  }
}

module.exports = new AppointmentController()
