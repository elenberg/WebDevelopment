var express = require('express');
var url = require('url');
var app = express();
var account = require('account');
var http = require('http');
var instagram = require('instagram-node').instagram();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

instagram.use({
  client_id: 'f81f407862d44b03a130dfb1c020c5ff',
  client_secret: 'd337b5c6f52f4b3a8270d83c2d88ef18'
});

//app.get('/authorize_user', exports.authorize_user);

//app.get('/handleauth', exports.handleauth);



app.get('/', function(req, res) {

            instagram.media_popular(function(err, medias, remaining, limit){
            res.render('public/pages/index.ejs', {gram: medias });
  });

});
/*
http.createServer(function (request, response) {
    // Parse the entire URI to get just the pathname
    var uri = url.parse(request.url).pathname, query;
        if (uri == "/account") //If it's mysite.com/account
        {
            request.setEncoding("utf8");
            request.content = '';
            ig.user_media_recent( function(err, medias, pagination, remaining, limit) {
            response.render('public/pages/userpage.ejs', {gram: medias });
            });

                        //call account.whatever() to route to your account     functionality
                        //send the response from it

        }
            else if (uri == "/") //It's mysite.com
            {
                instagram.media_popular(function(err, medias, remaining, limit){
                  response.render('public/pages/index.ejs', {gram: medias });
              });
            }
}).listen(8080, function(err){
  if(err){
    console.log("Error");
  }
  else{
    console.log("Listening");
  }

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
