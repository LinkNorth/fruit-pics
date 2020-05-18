const db = require('../db');
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

function getUsers() {
  return db('users').select('name', 'email', 'id');
}

function getImagesForUser(userId, page, size) {
  if (!page) page = 1;
  if (!size) size = 12;
  size = Math.min(100, size);
  return db('users_images').select('image_id').where({user_id: userId})
    .limit(size)
    .offset((page - 1) * size)
    .orderBy('created_at', 'desc')
    .then(rels => {
      return {
        page,
        size,
        images: rels.map(x => x.image_id),
      }
    });
}

function getImageById(imageId) {
  return db('users_images').select('image_id', 'user_id', 'created_at', 'updated_at', 'description', 'title').where({image_id: imageId})
    .then(images => {
      if (images.length === 1) return images[0];
      return null;
    })
    .then(image => {
      if (!image) return image;
      return Promise.all([
        db('likes').where({image_id: image.image_id}).count('id').then(x => parseInt(x[0].count)),
        db('comments').select('comments.id', 'comments.user_id', 'comments.comment', 'comments.created_at', 'users.name AS user_name')
          .where({image_id: image.image_id})
          .innerJoin('users', 'users.id', 'comments.user_id')
      ])
      .then(data => {
        image.likes = data[0];
        image.comments = data[1];
        return image;
      });
    });
}

function addImage(userId, imageId, title, description) {
  return db('users_images').insert({user_id: userId, image_id: imageId, title, description});
}

function checkImagePermission(userId, imageId) {
  return Promise.resolve(true);
  /*
  return db('users_images').where({user_id: userId, image_id: imageId})
    .then(rels => {
      return rels.length === 1;
    });
    */
}

function getHome(userId, page, size) {
  if (!page) page = 1;
  if (!size) size = 12;
  size = Math.min(100, size);
  return db('users_images')
    .select('image_id')
    .whereIn('user_id', function() {
      this.from('users_followers').select('following_id').where('follower_id', userId);
    })
    .limit(size)
    .offset((page - 1) * size)
    .orderBy('created_at', 'desc')
    .then(rels => {
      return {
        page,
        size,
        images: rels.map(x => x.image_id),
      }
    });
}

function followUser(followerId, followingId) {
  return db('users_followers').insert({follower_id: followerId, following_id: followingId});
}
function unfollowUser(followerId, followingId) {
  return db('users_followers').where({follower_id: followerId, following_id: followingId}).del();
}


function getFollowers(userId) {
  return db('users_followers').where({follower_id: userId});
}

function doesFollow(followerId, followingId) {
  if (followerId === followingId) return Promise.resolve(false);
  return db('users_followers').where({follower_id: followerId, following_id: followingId})
  .then(res => {
    return res.length === 1;
  });
}

function createComment(imageId, userId, comment) {
  return db('comments').insert({image_id: imageId, user_id: userId, comment: comment}); 
}

function likeImage(imageId, userId) {
  return db('likes').where({image_id: imageId, user_id: userId})
    .then(likes => {
      if (likes.length > 0) {
        // Unlike
        return db('likes').where({image_id: imageId, user_id: userId}).del(); 
      } else {
        // Like
        return db('likes').insert({image_id: imageId, user_id: userId});
      }
    });
}

module.exports = {
  createUser,
  validateUser,
  getUserById,
  getUsers,
  addImage,
  getImageById,
  checkImagePermission,
  getImagesForUser,
  getHome,
  followUser,
  unfollowUser,
  doesFollow,
  getFollowers,
  createComment,
  likeImage,
};
