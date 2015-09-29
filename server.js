var express = require('express');
var url = require('url');
var app = express();
var http = require('http');
var instagram = require('instagram-node').instagram();
//var RedisStore = require('connect-redis')(express);
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

/*getting errors everytime I enabled RedisStore or Mongo-store. Not sure why.

app.use(session({
  store: new RedisStore({
    db: 'instagramapp',
    host: '127.0.0.1',
    port: 3365,
    prefix: 'sess'
  })
}));
*/


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

  client_id: 'f81f407862d44b03a130dfb1c020c5ff',
  client_secret: 'd337b5c6f52f4b3a8270d83c2d88ef18'

});

var redirect_uri = 'http://209.95.48.196:8080/handleauth';
var homepage_uri = 'http://209.95.48.196:8080/dashboard';

exports.authorize_user = function(req, res) {
  instagram.use({

    client_id: 'f81f407862d44b03a130dfb1c020c5ff',
    client_secret: 'd337b5c6f52f4b3a8270d83c2d88ef18'

  });
  res.redirect(instagram.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  instagram.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token + ' And more information' + result.user.id);
      instagram.use({access_token: result.access_token});
      req.session.instaToken = result.access_token;
      req.session.user_id = result.user.id;
      req.session.username = result.user.username;
      req.session.full_name = result.user.full_name;
      req.session.profile_picture = result.user.profile_picture;
      console.log('Yay lets use ' + req.session.user_id);
      res.redirect(homepage_uri);
    }
  });
};

app.get('/', function(req, res) {
  if(req.session.instaToken === undefined){
    console.log('Undefined isn\'t it?' + req.session.instaToken + ' ');
    res.redirect(homepage_uri);
  }
  else{
    res.redirect(instagram.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
  }
});

app.get('/handleauth', exports.handleauth);

app.get('/dashboard', function(req, res){

  console.log('access_token is ' + req.session.instaToken + ' \n');
  if(req.session.instaToken){//This always returns false. Trying to figure out why it isn't grabbing the session.

  instagram.user_media_recent(req.session.user_id, function(err, medias, pagination, remaining, limit) {
  res.render('public/pages/index.ejs', {gram: medias });
  });
  }
  else{
    //console.log('In else statement of dashboard\n' + req.cookies.name + ' Including cookies. Testing.');
    //For some reason it isn't grabbing the instagram.use from line 27. Not sure why.
    instagram.use({

      client_id: 'f81f407862d44b03a130dfb1c020c5ff',
      client_secret: 'd337b5c6f52f4b3a8270d83c2d88ef18'

    });
    res.redirect(instagram.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
  }
});
/*
http.createServer(app).listen(app.get(8080), function(){
  console.log("Express server listening on port " + app.get(8080));
});
*/
app.listen(8080, function(err){
  if(err){
    console.log("Error");
  }
  else{
    console.log("Listening");
  }

});
