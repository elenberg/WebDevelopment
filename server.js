var express = require('express');
var exphbs = require('express-handlebars');
var url = require('url');
var http = require('http');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var instagram = require('instagram-node').instagram();

// Global Variables //
var app = express();

var cid = 'f81f407862d44b03a130dfb1c020c5ff'
var clsec = 'd337b5c6f52f4b3a8270d83c2d88ef18'

var redirect_uri = 'http://localhost:8080/handleauth';
var homepage_uri = 'http://localhost:8080/dashboard';

// Element Initializations //
app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname));
app.use(cookieParser());

app.use(session({
  cookieName: 'session',
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
exports.handleauth = function(req, res) {
  instagram.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("It looks like the credentials weren't valid.");
    }

    else {
      instagram.use({access_token: result.access_token});
      req.session.instaToken = result.access_token;
      req.session.user_id = result.user.id;
      req.session.username = result.user.username;
      req.session.full_name = result.user.full_name;
      req.session.profile_picture = result.user.profile_picture;
      req.session.save()
      console.log(req.session.previous_page);

      if(req.session.previous_page == undefined){
        res.redirect("/dashboard");
      }

      else {
        var page = req.session.previous_page
        req.session.previous_page = undefined;
        req.session.save();
        res.redirect(page);
      }
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
    instagram.user_media_recent(req.session.user_id, function(err, medias, pagination, remaining, limit) {
      res.render('dashboard', {
        layout:'base',
        gram: medias,
        title: req.session.username
      })
    })
  }

  else {
    res.redirect('/');
    req.session.previous_page = '/dashboard';
    req.session.save();
  }
};

function profile(req, res) {
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
  if(req.session.instaToken) {
    instagram.user_media_recent(req.session.user_id, function(err, medias, pagination, remaining, limit) {
      res.render('search', {
        layout:'base',
        searchResults: medias,
        gram: medias,
        title: req.session.username
      })
    })
  }

  else {
    req.session.previous_page = '/search';
    req.session.save();
    res.redirect('/');

  }
};

// Page Action Functions //
function redirAPI(req, res) {
  instagram.use({
    client_id: cid,
    client_secret: clsec
  });

  res.redirect(instagram.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
}

function logout(req, res) {
  req.session.destroy(function(err) {/* cannot access session here */})
  res.redirect("/");
};

// Page Routes //
app.get('/', welcome);
app.get('/redirect', redirAPI);
app.get('/dashboard', dashboard);
app.get('/profile', profile);
app.get('/search', search);
app.get('/logout', logout);
app.get('/handleauth', exports.handleauth);

// Invalid URL Handling //
app.use(function(req, res, next) {
  res.redirect("/");
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
