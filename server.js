var express = require('express');
var exphbs = require('express-handlebars');
var url = require('url');
var http = require('http');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var instagram = require('instagram-node').instagram();
var MongoClient = require('mongodb').MongoClient
var formidable = require('formidable')

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
      console.log("Full Name: " + req.session.full_name);
      req.session.profile_picture = result.user.profile_picture;
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
    if (err) {
      alert("Error while fetching user profile");
    }

    if (session.username) {
      var userFound = false;
      var cursor = db.collection("ig_users").find({"username":session.username});
      cursor.each(function(err, doc) {
        if (doc)
        {
          userFound = true;
        }
        if (!doc && !userFound) {
          console.log("Adding " + session.username + " to MongoDB");
          var defaultUser = {
              "username" : session.username,
              "name" : session.full_name,
              "email" : "",
              "bio" : "",
              "searches" : [] };
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
  if(req.session.instaToken) {
    instagram.user_media_recent(req.session.user_id, function(err, medias, pagination, remaining, limit) {
      res.render('profile', {
        layout: 'profileLayout',
        title: req.session.username,
        profile_picture: req.session.profile_picture,
        full_name: req.session.full_name
       });
    });
  }

  else {
    req.session.previous_page = '/profile';
    req.session.save();
    res.redirect('/');
  }
};

function updateProfile(req, res){
  MongoClient.connect(mongo_uri, function(err, db) {
    if (req.session.username) {
      var cursor = db.collection("ig_users").find({"username":req.session.username}); //session.username});
      cursor.each(function(err, doc)
      {
        if (err) {
          alert("Error in save search term section");
        }

        if (doc) {
            db.collection("ig_users").update({"username":req.session.username},
              {$set: {name:req.query.name,
              email:req.query.email,
              bio:req.query.bio}});

        }

        db.close();
      });
    }
  });
  }


  function fetchProfile(req, res){
    MongoClient.connect(mongo_uri, function(err, db) {
      if (req.session.username) {
        var cursor = db.collection("ig_users").find({"username":req.session.username});
        cursor.each(function(err, doc)
        {
          if (err) {
            alert("Error in save search term section");
          }

          if (doc) {
              res.send(doc);
              console.log(doc);
          }

          db.close();
        });
      }
    });
    }

function search(req, res) {
  if(req.session.instaToken)
  {
    console.log(req.session.dbInfo);
    if (req.params.tags)
    {
      instagram.tag_media_recent(req.params.tags, function(err, medias, pagination, remaining, limit) {
        res.render('search', {
              layout: 'base',
              gram: medias,
              title: req.session.username
        });
      });
    }
    else
    {
      instagram.media_popular(function(err, medias, remaining, limit) {
        res.render('search', {
              layout: 'base',
              gram: medias,
              title: req.session.username
        });
      });
    }
  }

  else
  {
    req.session.previous_page = '/search';
    req.session.save();
    res.redirect('/');
  }
};

function updateSearch(req, res){
  MongoClient.connect(mongo_uri, function(err, db) {
    if (req.session.username) {
      var cursor = db.collection("ig_users").find({"username":req.session.username}); //session.username});
      cursor.each(function(err, doc)
      {
        if (err) {
          alert("Error in remove search term section");
        }

        if (doc) {
          res.send(doc.searches);
        }

        db.close();
      });
    }
  });
};

function removeSearchTerm(req, res){
  MongoClient.connect(mongo_uri, function(err, db) {
    if (req.session.username) {
      var cursor = db.collection("ig_users").find({"username":req.session.username}); //session.username});
      cursor.each(function(err, doc)
      {
        if (err) {
          alert("Error in remove search term section");
        }

        if (doc) {
          var index = doc.searches.indexOf(req.query.search);
          if (index > -1) {
            doc.searches.splice(index, 1);
            db.collection("ig_users").update({"username":req.session.username},
              {$set: {searches:doc.searches}});
            res.send(doc.searches);
          }
        }

        db.close();
      });
    }
  });
};

function saveSearchTerm(req, res){
  MongoClient.connect(mongo_uri, function(err, db) {
    if (req.session.username) {
      var cursor = db.collection("ig_users").find({"username":req.session.username}); //session.username});
      cursor.each(function(err, doc)
      {
        if (err) {
          alert("Error in save search term section");
        }

        if (doc) {
          var index = doc.searches.indexOf(req.query.search);
          if (index == -1) {
            doc.searches.push(req.query.search);
            db.collection("ig_users").update({"username":req.session.username},
              {$set: {searches:doc.searches}});
            res.send(doc.searches);
          }
        }

        db.close();
      });
    }
  });
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
app.get('/saveSearch', saveSearchTerm);
app.get('/removeSearch', removeSearchTerm);
app.get('/updateSearch', updateSearch);
app.get('/updateProfile', updateProfile);
app.get('/fetchProfile', fetchProfile);

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
