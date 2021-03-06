const router = require('express').Router()
const {User, Shoe, Order, OrderShoes} = require('../db/models')
const {isAdminOrUser, isAdmin} = require('../adminMiddleware')
module.exports = router

// This is for a logged in user
router.post('/', async (req, res, next) => {
  try {
    let [order, _] = await Order.findOrCreate({
      where: {userId: req.user.id, isCart: true},
      include: {
        model: Shoe
      }
    })
    const shoe = await Shoe.findByPk(req.body.id)
    await order.addShoe(shoe)
    order = await Order.findOne({where: {id: order.id}, include: {model: Shoe}})
    res.json(order.shoes)
  } catch (error) {
    next(error)
  }
})

router.put('/:method/:shoeId', async (req, res, next) => {
  try {
    const {method, shoeId} = req.params
    const shoe = await Shoe.findByPk(shoeId)
    const order = await Order.findOne({where: {userId: req.user.id}})
    const orderShoes = await OrderShoes.findOne({
      where: {shoeId: shoe.id, orderId: order.id}
    })
    switch (method) {
      case 'increment':
        await orderShoes.update({quantity: orderShoes.quantity + 1})
        res.json(shoe)
        break
      case 'decrement':
        if (orderShoes.quantity > 1)
          await orderShoes.update({quantity: orderShoes.quantity - 1})
        else await order.removeShoe(shoe)
        res.json(shoe)
        break
      case 'remove':
        await order.removeShoe(shoe)
        res.json(shoe)
        break
      default:
        res.json(shoe)
    }
  } catch (error) {
    console.error(error)
  }
})

router.get('/userCart', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json(req.session.cart)
    }
    const user = await User.findByPk(req.user.id)
    const findCart = await Order.findOne({
      where: {userId: user.id, isCart: true},
      include: [Shoe]
    })

    findCart.isCart === true ? res.json(findCart) : res.json({shoes: []})
  } catch (error) {
    console.error(error)
  }
})

// POST to add item to guest cart
router.post('/guest', async (req, res, next) => {
  try {
    const order = await Order.create({where: {isCart: true}})
    const shoe = await Shoe.findByPk(req.body.id)
    order.addShoe(shoe)
    if (!JSON.stringify(req.session.cart).includes(JSON.stringify(req.body)))
      req.session.cart = [...req.session.cart, req.body]
    return res.json(req.session.cart)
  } catch (error) {
    next(error)
  }
})

// GET all orders for one user
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.params.id
    const theOrders = await Order.findAll({
      where: {
        userId,
        isCart: false
      },
      include: [Shoe]
    })
    res.json(theOrders)
  } catch (error) {
    next(error)
  }
})
