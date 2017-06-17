var fs = require('fs')
var expressa = require('expressa')
var auth = require('expressa/auth')
var jwt = require('jsonwebtoken');

module.exports = function(lib,argv) {
  if ( argv['_'].length == 1 )
    lib.error("no user email provided",true,true)

  var email = argv['_'][1]
  if (!fs.existsSync( process.cwd()+'/data' ) )
    lib.error("data-dir not found..are you in a expressa-app directory?",true)

  var expressa = require('expressa');
  expressa.addListener('ready', function() {
    expressa.db.users.find({'email': email})
      .then(function(users) {
        if (users.length == 0) {
          console.error('user does not exist.')
          process.exit()
        }
        var user = users[0];
        token = jwt.sign(user, expressa.settings.jwt_secret, {});
        console.log('Here is the id:')
        console.log(token)
        process.exit()
      }, function(err) {
        console.error(err)
        console.error('failed to get user')
      })
  });
  return this

}.bind({})
