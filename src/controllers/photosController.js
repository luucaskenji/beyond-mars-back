const Photo = require('../models/Photo');

class PhotosController {
    async postLike(id) {
        const photo = await Photo.findByPk(id);

        if (photo) {
            photo.likes = photo.likes + 1;
            
            return await photo.save();
        }
        else return await Photo.create({ id });
    }
}

module.exports = new PhotosController();