const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const postRoute = require('./routes/posts');

const app = express();
app.use(express.json());
app.use('/posts', postRoute);


app.get('/', (req, res) => {
    res.send('REST API funcionando 🚀');
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
