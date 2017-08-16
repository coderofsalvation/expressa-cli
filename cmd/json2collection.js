var fs = require('fs');
var schemize = require('schemize').default;

module.exports = function(lib,argv){
  var collectionname = argv['_'][1]
  var jsonfile = argv['_'][2]
  var storage = argv['_'][3]
  var has_owner = argv['_'][4]
  if( !jsonfile )
    lib.error("no collection provided",true,true)
  if( !collectionname )
    lib.error("no json file provided",true,true)
  if( !storage )
    lib.error("no storage method provided",true,true)
  if( !has_owner )
    lib.error("no owner method provided",true,true)
  if (!fs.existsSync( process.cwd()+'/data' ) ) 
    lib.error("data-dir not found..are you in a expressa-app directory?",true)
  if (!fs.existsSync(jsonfile) )
    lib.error("jsonfile not found..please pass absolute path",true)

  var json = require(jsonfile)
  var collectionfile = process.cwd()+"/data/collection/"+collectionname+".json"

  var expressa = require('expressa');
  expressa.addListener('ready', function() {
    var collection = {
      "_id": collectionname,
      "schema": schemize(json),
      "storage": storage,
      "documentsHaveOwners": has_owner.toLowerCase() === 'true',
      "meta": {
        "updated": new Date().toISOString(),
        "created": new Date().toISOString()
      }
    }
    var reqMock = {
      hasPermission: function() {
        return true;
      },
    }
    reqMock.settings = expressa.settings;
    expressa.notify('post', reqMock, 'collection', collection)
      .then(function(allowed) {
        expressa.db.collection.create(collection)
          .then(function() {
            console.log("created: "+collectionfile)
            process.exit()
          }, function(err) {
            console.error(err)
            console.error('failed to create collection')
          })
      });
  });

  return this

}.bind({})
