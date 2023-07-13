const mongoose = require('mongoose');


const connectDB= async ()=>{
    mongoose.connect('mongodb+srv://Xel0w:Test1234@cluster0.1yteva8.mongodb.net/securite', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => {
        mongoose.set("debug", true)
    console.log('Connexion à la base de données MongoDB établie avec succès.');
    })
    .catch(error => {
    console.error('Erreur lors de la connexion à la base de données MongoDB :', error);
    });
}

module.exports = connectDB;