var request = require('request')
  , fs = require('fs')
  , async = require('async')
  , log = fs.createWriteStream('./error-log')
  , available = fs.createWriteStream('./available')

  , q = async.queue(function(task, callback) {
      request('http://www.twitter.com/' + task.name, function (err, res) {
        if(res.statusCode == 404) {
          available.write(task.name + '\n')
        }
        callback(err)
      })
    }, 10)

process.argv.splice(2).forEach(function(fileName) {
  
  fs.readFile('./' + fileName, 'utf8', function(err, data) {
    if(err) {
      return console.log(err);
    }
    data.split('\n').forEach(function(line) {
      if(line.length > 1) {
        q.push({name: line}, function(err) {
          if(err) {
            log.write('\n\nsomething weird happened with '+line+'\n')
            log.write(err)
          }
        })
      }
    })
  })
})
