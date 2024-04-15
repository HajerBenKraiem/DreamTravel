const authController = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Fonction pour créer un jeton JWT
const createToken = (user) => {
    const payload = {
        id: user._id.toString(),
        isAdmin: user.isAdmin
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
};

// Créer un nouvel utilisateur REGISTER
authController.post('/register', async (req, res) => {
    try {
        const isExisting = await User.findOne({ email: req.body.email });
        if (isExisting) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const user = await User.create({ ...req.body, password: hashedPassword })
        await user.save()
        
        const token = createToken(user);
        const { password, ...others } = user._doc
        
        return res.status(201).json({ ...others, token });
    } catch (error) {
        return res.status(500).json({ error: error.message }); 
    }
});

// Login
authController.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ msg: "Invalid Account doesn't exist" });
        }

        const comparePass = await bcrypt.compare(req.body.password, user.password);
        if (!comparePass) {
            return res.status(404).json({ msg: "Invalid credentials" });
        }

        const { password, ...others } = user._doc;
        const token = createToken(user);

        return res.status(200).json({ others, token });
    } catch (error) {
        return res.status(500).json({ error: error.message }); 
    }
});

module.exports = authController;
