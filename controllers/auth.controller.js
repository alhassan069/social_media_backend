require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const newToken = (user) => {
    return jwt.sign({ user: user }, process.env.JWT_ACCESS_KEY);
};

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(406).json({ message: "Error! Name, email or password missing." });
    }

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        console.log(error)
    }

    if (existingUser) {
        return res.status(400).json({ message: "User already exists. Login instead." });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
    });


    try {
        await user.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "failed", message: error.message });
    }

    const token = newToken(user);

    return res.status(201).json({ token, id: user._id, name: user.name })
}

const authenticateUser = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        console.log(error)
    };

    if (!existingUser) {
        return res.status(404).json({ message: "User does not exist. Signup instead." });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password." });
    };

    const token = newToken(existingUser);

    return res.status(200).json({ token });
}

module.exports = { signup, authenticateUser };