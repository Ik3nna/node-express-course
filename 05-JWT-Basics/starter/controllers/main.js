const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../errors')

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    // Just for demo, normallu provided by DB!!
    const id = new Date().getDate()

    // Try to keep payload small
    // Ensure that the secret is a long, complex, and unguessable string value!!!
    const token = jwt.sign(
        {id, username},
        process.env.JWT_SECRET,
        {expiresIn: '30d'}
    )

    res.status(200).json({ msg: 'User created', token })
}

const dashboard = async (req, res) => {
    const luckyNumber = Math.floor(Math.random()*100);
 
    res.status(200).json({
        msg: `Hello, ${req.user.username}`, 
        secret: `Here is your authorized data, your lucky number is ${luckyNumber}`
    })
}

module.exports = {
    login,
    dashboard 
}