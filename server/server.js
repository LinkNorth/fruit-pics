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

const userModel = require('./userModel');
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

const apiRouter = express.Router();

apiRouter.use(express.json());
apiRouter.use(express.urlencoded());
apiRouter.use(fileUpload());

apiRouter.get('/', (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).end();
  }
  userModel.getUserById(req.session.user_id)
    .then(user => {
      if (user) {
        res.send({fruits: ['banana'], user_name: user.name});
      } else {
        res.status(404).end();
      }
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

apiRouter.get('/images', (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).end();
  }
  let userId = req.session.user_id;
  userModel.getImagesForUser(userId)
    .then(images => {
      res.send({images});
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

apiRouter.get('/images/:id', (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).end();
  }

  let imageId = req.params.id;

  let userId = req.session.user_id;

  userModel.checkImagePermission(userId, imageId)
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

    userModel.addImage(req.session.user_id, fileId + ext)
      .then(() => {
        res.redirect('/upload');
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

  userModel.validateUser(email, password)
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
  userModel.createUser({name, email, password})
    .then(() => {
      res.redirect('/login');
    })
    .catch(e => {
      console.error(e);
      res.error(500).end();
    });
});

app.use('/api', apiRouter);

app.listen(8090, function() {
  console.log('Started on 8090');
});
