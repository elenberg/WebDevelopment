var express = require('express');
var exphbs = require('express-handlebars');
var url = require('url');
var http = require('http');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var instagram = require('instagram-node').instagram();
var MongoClient = require('mongodb').MongoClient

// Global Variables //
var app = express();

var cid = 'f81f407862d44b03a130dfb1c020c5ff';
var clsec = 'd337b5c6f52f4b3a8270d83c2d88ef18';

var redirect_uri = 'http://localhost:8080/handleauth';
var homepage_uri = 'http://localhost:8080/dashboard';
var mongo_uri = 'mongodb://igUser:correcthorsebatterystapler@ds043027.mongolab.com:43027/instagram_db';

// Element Initializations //
app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname));
app.use(cookieParser());

app.use(session({
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 300 * 600 * 10000,
  activeDuration: 50 * 600 * 10000,
  httpOnly: true,
  secure: true,
  ephemeral: true,
  resave: true,
  saveUninitialized: true
}));

instagram.use({
  client_id: cid,
  client_secret: clsec
});

// Authentication Handling //
var redirect_uri = 'http://localhost:8080/handleauth';
var homepage_uri = 'http://localhost:8080/dashboard';
var igResults = {};

//Handles Authentication //
exports.handleauth = function(req, res) {
  instagram.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log("Body: " + err.body);
      res.redirect("/");
    }

    else {
      instagram.use({access_token: result.access_token});
      req.session.instaToken = result.access_token;
      req.session.user_id = result.user.id;
      req.session.username = result.user.username;
      req.session.full_name = result.user.full_name;
      req.session.profile_picture = result.user.profile_picture;
      req.session.dbInfo = {};
      req.session.save();

      getUserProfile(req.session);
      console.log("Previous page: " + req.session.previous_page);

      if(req.session.previous_page == undefined){
        res.redirect("/dashboard");
      }
      else {
        var page = req.session.previous_page;
        req.session.previous_page = undefined;
        req.session.save();
        res.redirect(page);
      }
    }
  });
};

function getUserProfile(session){
  MongoClient.connect(mongo_uri, function(err, db) {
    if (session.username)
    {
      var userExists = false;
      var cursor = db.collection("ig_users").find({"username":"testUser"}); //session.username});
      cursor.each(function(err, doc)
      {
        if (doc)
        {
          console.log("Found user " + doc.username);
          userExists = true;
          session.dbInfo = JSON.parse(JSON.stringify(doc));
          session.save();
        }

        if (!userExists)
        {
          console.log("Adding " + session.username + " to MongoDB");
          var defaultUser =
          {
              "username" : session.username,
              "name" : session.full_name,
              "email" : "",
              "bio" : "",
              "searches" : []
          };
          db.collection('ig_users').insertOne(defaultUser, function(err, result){});
        }

        db.close();
      });
    }
  });
};



// Page Display Functions //
function welcome(req, res) {
  if (req.session.instaToken) {
    res.redirect("/dashboard");
  }

  else {
    res.render('welcome', {layout: 'welcomeLayout'});
  }
};

function dashboard(req, res) {
  if(req.session.instaToken) {
    req.session.loggedIn = true;
    instagram.user_media_recent(req.session.user_id, function(err, medias, pagination, remaining, limit) {
      res.render('dashboard', {
        layout:'base',
        gram: medias,
        title: req.session.username
      })
    })
  }

  else {
    req.session.previous_page = '/dashboard';
    req.session.save();
    res.redirect('/');
  }
};

function profile(req, res) {
  var userProfile = getUserProfile(req.session);
  if(req.session.instaToken) {
    instagram.user_media_recent(req.session.user_id, function(err, medias, pagination, remaining, limit) {
        res.render('profile', {
          layout: 'profileLayout',
          title: req.session.username,
          profile_picture: req.session.profile_picture,
         });
    });
  }

  else {
    req.session.previous_page = '/profile';
    req.session.save();
    res.redirect('/');
  }
};

function search(req, res) {
  if(req.session.instaToken)
  {
    console.log(req.session.dbInfo);
    if (req.params.tags)
    {
      instagram.tag_media_recent(req.params.tags, function(err, medias, pagination, remaining, limit) {
      res.render('search',
          {
            layout: 'base',
            savedSearches: req.session.dbInfo.searches,
            gram: medias,
            title: req.session.username
          })
      })
    }
    else
    {
      instagram.media_popular(function(err, medias, remaining, limit) {
      res.render('search',
          {
            layout: 'base',
            savedSearches: req.session.dbInfo.searches,
            gram: medias,
            title: req.session.username
          })
      })
    }

  }

  else
  {
    req.session.previous_page = '/search';
    req.session.save();
    res.redirect('/');
  }
};

function saveSearchTerm(req, res) {
    console.log(req.params.term);
};

function removeSearchTerm(req, res) {
    console.log(req.params.term);
};

// Page action functions //
function redirAPI(req, res) {
  instagram.use({
    client_id: cid,
    client_secret: clsec
  });

  res.redirect(instagram.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

// EVERETT: The session IS being destroyed (otherwise it would immediately redirect to '/dashboard' when this function
// comnpletes), however the connection to the instagram server is NOT and it is immediately recreated. No idea why.
function logout(req, res) {
  req.session.destroy();
  res.redirect("/");
};

// Page Routes //
//All Routes here.
app.get('/', welcome);
app.get('/redirect', redirAPI);
app.get('/dashboard', dashboard);
app.get('/profile', profile);
app.get('/search', search);
app.get('/search%', search);
app.get('/search%:tags', search);
app.get('/logout', logout);
app.get('/handleauth', exports.handleauth);
app.post('/saveSearch%:term', saveSearchTerm);
app.post('/removeSearch%:term', removeSearchTerm);

// Invalid URL Handling //
app.use(function(req, res, next) {
  res.redirect("/");
  next();
});

// Server Handling //
app.listen(8080, function(err) {
  if(err) {
    console.log("Error");
  }

  else {
    console.log("Listening on port 8080");
  }
});
