const router = require('express').Router()
const {User} = require('../db/models')
const {isAdmin, isAdminOrUser} = require('../adminMiddleware')

router.get('/', isAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId', isAdminOrUser, async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email']
    })
    res.json(user)
  } catch (err) {
    next(err)
  }
})

module.exports = router
