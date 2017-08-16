#!/usr/bin/env node
var fs = require('fs');
var mongo = require('mongodb').MongoClient
var assert = require('assert')
var glob = require('glob')
var path = require('path')
var dir = path.resolve(__dirname,'./../data/users/')
module.exports = function(lib,argv){
  var url = argv._[2]
  var collectionname = argv._[1]
  var arr = []
  mongo.connect(url,(err,db)=>{
    assert.equal(null,err)
    console.log('connections established')
    glob(process.cwd()+"/data/"+collectionname+"/*.json",(err,files)=>{
      if(err){
        console.log(err,'new error')
        return
      }
      files.forEach((file)=>{ 
        var content = fs.readFileSync(file)
        var json = JSON.parse(content)
        db.collection(collectionname,function(err,collection){
          var promise = new Promise((resolve,reject)=>{
            collection.insert(json, {w: 1}, function(err, records){
              if(err) 
                reject(err)
              else
                resolve()
            })
          })
          arr.push(promise)
        })    
      })
      Promise.all(arr)
      .then((res)=>{
        db.close()
      })
      .catch((err)=>{
        console.log(err)
      })
    })
  })
  return this
}.bind({})