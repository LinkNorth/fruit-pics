const usersModel = require('./usersModel');

function getUsersRoute(req, res) {
  usersModel.getUsers()
    .then(users => {
      res.json({users});
    })
    .catch(err => {
      console.error(err);
      res.error(500).end();
    });
}

function getUserByIdRoute(req, res) {
  let userId = req.params.id;
  if (userId === 'self') {
    if (!req.session.user_id) {
      return res.status(400).end();
    }
    userId = req.session.user_id;
  }

  Promise.all([
    usersModel.getUserById(userId),
    usersModel.doesFollow(req.session.user_id, userId)
  ])
    .then(data => {
      const [user, doesFollow] = data;
      user.doesFollow = doesFollow;
      res.json({user});
    })
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}

function getUserImages(req, res) {
  let userId = req.params.id;
  if (userId === 'self') {
    if (!req.session.user_id) {
      return res.status(400).end();
    }
    userId = req.session.user_id;
  }

  let size = parseInt(req.query.size);
  let page = parseInt(req.query.page);

  usersModel.getImagesForUser(userId, page, size)
    .then(data => {
      res.send({
        images: data.images, 
        meta: {
          size: data.size, 
          page: data.page,
          done: data.images.length < data.size,
        }});
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
}

function followUser(req, res) {
  if (!req.session.user_id) {
    return res.status(400).end();
  }
  let followerId = req.session.user_id;
  let followingId = parseInt(req.params.followingId);
  if (!followerId || !followingId || followerId === followingId) {
    return res.status(400).end();
  }

  usersModel.followUser(followerId, followingId)
    .then(() => {
      res.status(201).end();
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
}

function unfollowUser(req, res) {
  if (!req.session.user_id) {
    return res.status(400).end();
  }
  let followerId = req.session.user_id;
  let followingId = parseInt(req.params.followingId);
  if (!followerId || !followingId || followerId === followingId) {
    return res.status(400).end();
  }

  usersModel.unfollowUser(followerId, followingId)
    .then(() => {
      res.status(204).end();
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
}

function getHome(req, res) {
  if (!req.session.user_id) {
    return res.status(400).end();
  }
  userId = req.session.user_id;

  let size = parseInt(req.query.size);
  let page = parseInt(req.query.page);

  usersModel.getHome(userId, page, size)
    .then(data => {
      res.send({
        images: data.images, 
        meta: {
          size: data.size, 
          page: data.page,
          done: data.images.length < data.size,
        }});
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
}

module.exports = {
  getUsersRoute,
  getUserByIdRoute,
  getUserImages,
  getHome,
  followUser,
  unfollowUser,
};
