var fs = require('fs')
var expressa = require('expressa')
var auth = require('expressa/auth')

module.exports = function(lib,argv) {
  if ( argv['_'].length == 1 )
    lib.error("no email provided",true,true)
  if ( argv['_'].length == 2 )
    lib.error("no password provided",true,true)

  var email = argv['_'][1]
  var password = argv['_'][2]
  if (!fs.existsSync( process.cwd()+'/data' ) )
    lib.error("data-dir not found..are you in a expressa-app directory?",true)

  var expressa = require('expressa');
  expressa.addListener('ready', function() {
    var u = {
      email: email,
      password: auth.createHash(''+password),
      roles: ['Admin']
    }
    expressa.db.users.create(u)
      .then(function() {
        console.log('super user created')
        process.exit()
      }, function(err) {
        console.error(err)
        console.error('failed to create user')
      })
  });
  return this

}.bind({})
