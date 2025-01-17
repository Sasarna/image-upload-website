const Photo = require('../models/Photo.js');
const fs = require('fs');
const { request } = require('http');
const path = require('path');

exports.getAllPhotos =  async (req, res) => {

    // const photos = await Photo.find({}).sort('-dateCreated');
    //  res.render('index', {
    //      photos
    //  });

    const page = req.query.page || 1;
    const photosPerPage = 3;

    const totalPhotos = await Photo.find().countDocuments();

    const photos = await Photo.find({})
    .sort('-dateCreated')
    .skip((page -1) * photosPerPage)
    .limit(photosPerPage)


    res.render('index' , {
        photos: photos,
        current: page,
        pages: Math.ceil((totalPhotos / photosPerPage))
    });

}

exports.getPhoto = async (req, res) => {
    console.log(req.params.id);
    const photo = await Photo.findById(req.params.id);
    res.render('photo', {
        photo
    });
}

exports.createPhoto =  async (req, res) => {

    //console.log(req.files.image)
    //await Photo.create(req.body)
    //res.redirect('/');

    const uploadDir = path.join(__dirname, 'public', 'uploads');

    if(!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // { recursive: true } ile alt dizinler de oluşturulabilir
    }

    let uploadeImage = req.files.image;
    let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name

    uploadeImage.mv(uploadPath,
        async () => {
            await Photo.create({
                ...req.body ,
                image: '/uploads/' + uploadeImage.name
            })
            res.redirect('/');
        }
    )
}

exports.updatePhoto =  async (req , res) => {
    const photo = await Photo.findOne({_id: req.params.id});
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.save();

    res.redirect(`/photos/${req.params.id}`);
}

exports.deletePhoto = async (req , res) => {
    const photo = await Photo.findByIdAndDelete({_id: req.params.id});
    let deletedImage = __dirname + '/../public' + photo.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndDelete(req.params.id);
    res.redirect('/');
}

