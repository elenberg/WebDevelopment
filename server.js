var express = require('express');
var url = require('url');
var app = express();
var http = require('http');
var exphbs = require('express-handlebars');
var instagram = require('instagram-node').instagram();
var session = require('express-session');
var cookieParser = require('cookie-parser');

var cid = 'f81f407862d44b03a130dfb1c020c5ff'
var clsec = 'd337b5c6f52f4b3a8270d83c2d88ef18'

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname));
app.use(cookieParser());

app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true,
  resave: false,
  saveUninitialized: true
}));

instagram.use({
  client_id: cid,
  client_secret: clsec
});

var redirect_uri = 'http://localhost:8080/handleauth';
var homepage_uri = 'http://localhost:8080/dashboard';

//Handles authentication.
exports.handleauth = function(req, res) {
  instagram.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    }
    else {
      instagram.use({access_token: result.access_token});
      req.session.instaToken = result.access_token;
      req.session.user_id = result.user.id;
      req.session.username = result.user.username;
      req.session.full_name = result.user.full_name;
      req.session.profile_picture = result.user.profile_picture;
      req.session.save()
      res.redirect(homepage_uri);
    }
  });

};
function logout(req,res){
  req.session.destroy(function(err) {
  // cannot access session here
})
  res.redirect('/');

};
app.get('/handleauth', exports.handleauth);


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

  }
};

function welcome(req, res) {

  if (req.session.instaToken == undefined) {
    res.render('welcome', {layout: 'welcomeLayout'});
  }

  else {
    res.redirect("/dashboard");
  }
};

function profile(req, res) {

  if(req.session.instaToken) {
    instagram.user_media_recent(req.session.user_id, function(err, medias, pagination, remaining, limit) {
        res.render('profile', {profile_picture: req.session.profile_picture });//Add your function here
    });
  }

  else {
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
    res.redirect('/');

  }
};

function redirAPI(req, res) {
  instagram.use({
    client_id: cid,
    client_secret: clsec
  });
  res.redirect(instagram.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
}
//All Routes here.
app.get('/', welcome);
app.get('/redirect', redirAPI);
app.get('/dashboard', dashboard);
app.get('/profile', profile);
app.get('/search', search);
app.get('/logout', logout);


app.use(function(req, res, next) {
  res.redirect('/');
});

app.listen(8080, function(err) {
  if(err){
    console.log("Error");
  }
  else{
    console.log("Listening on port 8080");
  }

});
