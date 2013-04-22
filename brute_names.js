var request = require('request')
  , fs = require('fs')
  , async = require('async')
  , available = fs.createWriteStream('./available')
  , processed = 0
  , log
  , reservedWords = ['post', 'session', 'join', 'apps', 'auth', 'list', 'root', 'phone']

  /* queue of requests with a pool of 10 async */
  , q = async.queue(function(task, callback) {
      request('http://www.twitter.com/' + task.name, function (err, res) {
        if(res && res.statusCode == 404) {
          available.write(task.name + '\n')
        }
        callback(err)
      })
    }, 10)


/* read all dictionaries */
fileFirst = fs.readFileSync('./first.csv', 'utf8')
fileLast = fs.readFileSync('./last.csv', 'utf8')


fileFirst.split('\n').forEach(function(lineFirst) {
    if(lineFirst < 4) return;
    if(reservedWords.indexOf(lineFirst) > 0) return;
    fileLast.split('\n').forEach(function(lineLast) {
        
        /* push each first name with 3 different combinations */
        q.push({name: lineFirst})
        q.push({name: lineFirst + lineLast})

    })
})
