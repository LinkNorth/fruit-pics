const db = require('./db');
const crypto = require('crypto');

function createUser(user) {
  user.password = createHash(user.password);
  return db('users').insert(user);
}

function createHash(str) {
  let hash = crypto.createHash('sha512');
  hash.update(str);
  return hash.digest('hex');
}

function validateUser(email, password) {
  let hashpw = createHash(password);
  return db('users').select('id').where({email: email, password: hashpw})
    .then(users => {
      if (users.length === 1) return users[0];
      return null;
    });
}

function getUserById(id) {
  return db('users').select('name', 'email', 'id').where({id: id})
    .then(users => {
      if (users.length === 1) {
        let user = users[0];
        return user;
      }
      return null;
    });
}

function getImagesForUser(userId) {
  return db('users_images').select('image_id').where({user_id: userId})
    .then(rels => {
      return rels.map(x => x.image_id);
    });
}

function addImage(userId, imageId) {
  return db('users_images').insert({user_id: userId, image_id: imageId});
}

function checkImagePermission(userId, imageId) {
  return db('users_images').where({user_id: userId, image_id: imageId})
    .then(rels => {
      return rels.length === 1;
    });
}

module.exports = {
  createUser,
  validateUser,
  getUserById,
  addImage,
  checkImagePermission,
  getImagesForUser,
};
