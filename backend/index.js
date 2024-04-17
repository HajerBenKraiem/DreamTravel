const express = require('express');
const mongoose = require('mongoose');
const authController = require('./controllers/authController');
const roomController = require('./controllers/roomController');
const dotenv = require("dotenv").config();
const cors =require('cors');
const uploadController = require('./controllers/uploadController');
const app = express();

// Connexion à la base de données
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Db is successfully connected'))
  .catch(err => console.error('Erreur de connexion à la base de données :', err));
    //http://localhost:5000/images/FILENAMEHERE
// Middlewares
// Pour analyser le corps de la requête en tant qu'objet JSON

app.use(cors())
app.use(express.json());

// Pour analyser le corps de la requête encodé en tant que données URL
app.use(express.urlencoded({ extended: true })); 
// Utilisez les parenthèses correctement
app.use('/images',express.static('public/images'))
// Pour router les demandes commençant par '/auth' vers le contrôleur d'authentification
app.use('/auth', authController);

app.use('/room',roomController);
app.use('/upload',uploadController)

// Démarrage du serveur
app.listen(process.env.PORT, () => console.log('Server is running'));
