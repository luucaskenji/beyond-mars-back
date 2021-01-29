const Photo = require('../models/Photo');
const NotFoundError = require('../errors/NotFoundError');

class PhotosController {
    async postLike(id) {
        const photo = await Photo.findByPk(id);

        if (photo) {
            photo.likes++;
            
            return await photo.save();
        }
        else return await Photo.create({ id });
    }

    async postDislike(id) {
        const photo = await Photo.findByPk(id);

        if (photo) {
            if (photo.likes > 0) {
                photo.likes--;
                await photo.save();
            }

            return photo;
        }
        else throw new NotFoundError('Photo not found on database');
    }

    async getLikes(id) {
        const photo = await Photo.findByPk(id, {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        return photo || { id, likes: 0 };
    }
}

module.exports = new PhotosController();