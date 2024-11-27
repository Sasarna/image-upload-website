'use strict';

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const Photo = require('./models/Photo.js');
const photoController = require('./controllers/photoControllers.js');
const pageController = require('./controllers/pageControllers.js');

const { METHODS } = require('http');

const PORT = 3000;

//* Connect Db

mongoose.connect('mongodb://localhost/pcat-test-db')
    .then(() => console.log('MongoDB bağlantısı başarılı!'))
    .catch(err => console.error('MongoDB bağlantısı başarısız:', err));

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(fileUpload());

app.use(methodOverride('_method' , {
    methods:['POST' , 'GET']
}));

app.get('/' , photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id' , photoController.updatePhoto);
app.delete('/photos/:id' , photoController.deletePhoto);

app.get('/about', pageController.getAboutPage);
app.get('/add_post', pageController.getAddPostPage);
app.get('/photos/edit/:id' , pageController.getEditPhotoPage);

app.listen(PORT, () => {
    console.log(`server localhost: ${PORT} port near passed...`);
});
