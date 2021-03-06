const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const USER_IMAGES_FOLDER = './user-images';

const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const fileUpload = require('express-fileupload');
const uuid = require('uuid');

const app = express();

app.use(express.static('../client/build'));
app.use(morgan('dev'));

const usersModel = require('./users/usersModel');
const db = require('./db');

const store = new KnexSessionStore({
  knex: db,
  tablename: 'sessions' // optional. Defaults to 'sessions'
});

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true },
  store: store
}));

app.get(['/', '/login', '/upload', '/register', '/users', '/users/:id'], (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const apiRouter = express.Router();

apiRouter.use(express.json());
apiRouter.use(express.urlencoded());
apiRouter.use(fileUpload());

apiRouter.get('/images/:id/', (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).end();
  }

  let imageId = req.params.id;

  let userId = req.session.user_id;

  usersModel.checkImagePermission(userId, imageId)
    .then(ok => {
      if (ok) {
        usersModel.getImageById(imageId)
        .then(imageData => {
          res.json({data: imageData});
        });
      } else {
        res.status(401).end();
      }
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

apiRouter.get('/images/:id/raw', (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).end();
  }

  let imageId = req.params.id;

  let userId = req.session.user_id;

  usersModel.checkImagePermission(userId, imageId)
    .then(ok => {
      if (ok) {
        let filePath = path.join(USER_IMAGES_FOLDER, imageId);
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.status(401).end();
      }
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });

});

apiRouter.post('/upload', (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).end();
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let file = req.files.file;
  let title = req.body.title;
  let description = req.body.description;

  // Use the mv() method to place the file somewhere on your server
  let fileId = uuid.v4();
  let ext = path.extname(file.name);
  let allowedExtensions = ['.jpeg', '.png', '.jpg', '.gif'];

  if (allowedExtensions.indexOf(ext) === -1) {
    return res.status(400).end();    
  }

  file.mv(path.join(USER_IMAGES_FOLDER, fileId + ext), function(err) {
    if (err) { 
      return res.status(500).send(err);
    }

    usersModel.addImage(req.session.user_id, fileId + ext, title, description)
      .then(() => {
        res.redirect('/');
      })
      .catch(e => {
        console.error(e);
        return res.status(500);
      });
  });
});

apiRouter.post('/login', (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).end();
  }

  usersModel.validateUser(email, password)
    .then(userData => {
      if (userData === null) {
        return res.redirect('/login?error=1');
      } else {
        req.session.user_id = userData.id;
        res.redirect('/');
      }
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

apiRouter.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    res.redirect('/login');
  });
});

apiRouter.post('/register', (req, res) => {
  const {name, email, password, confirmpassword} = req.body;

  if (!name || !email || !password || password !== confirmpassword) {
    return res.status(400).end();
  }
  
  // Create user
  usersModel.createUser({name, email, password})
    .then(() => {
      res.redirect('/login');
    })
    .catch(e => {
      console.error(e);
      res.error(500).end();
    });
});

const usersRoutes = require('./users/usersRoutes');

apiRouter.get('/users/', usersRoutes.getUsersRoute);
apiRouter.get('/users/home', usersRoutes.getHome);
apiRouter.get('/users/:id', usersRoutes.getUserByIdRoute);
apiRouter.get('/users/:id/images', usersRoutes.getUserImages);
apiRouter.post('/users/:followingId/follow', usersRoutes.followUser);
apiRouter.delete('/users/:followingId/follow', usersRoutes.unfollowUser);
apiRouter.post('/images/:id/comment', usersRoutes.createComment);
apiRouter.post('/images/:id/like', usersRoutes.likeImage);

app.use('/api', apiRouter);

app.listen(8090, function() {
  console.log('Started on 8090');
});
