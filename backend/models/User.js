const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true }); // Ajout de timestamps pour suivre la création et la mise à jour

module.exports = mongoose.model('User', UserSchema); // Utilisation de 'User' (avec une majuscule) pour le nom du modèle et l'exporter
