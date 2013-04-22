var request = require('request')
  , fs = require('fs')
  , async = require('async')
  , available = fs.createWriteStream('./available')
  , fileNames = process.argv.splice(2)
  , processed = 0
  , log
  , reservedWords = ['post', 'session', 'join', 'apps', 'auth', 'list', 'root', 'phone']

  /* queue of requests with a pool of 10 async */
  , q = async.queue(function(task, callback) {
      request.head('http://www.twitter.com/' + task.name, function (err, res) {
        if(res && res.statusCode == 404) {
          available.write(task.name + '\n')
        }
        callback(err)
      })
    }, 10)

/* catch sigusr1 for an update */
process.on('SIGUSR1', function(){
  console.log(processed +' handles have been processed')
})

/* read all dictionaries */
fileNames.forEach(function(fileName) {
  fs.readFile('./' + fileName, 'utf8', function(err, data) {
    if(err) { return console.log(err) }
    
    /* split file by lines */
    data.split('\n').forEach(function(line) {
      if(line < 4) { 
        console.log('ignoring '+line+' because 3 or less handles are all taken')
        return
      }
      if(reservedWords.indexOf(line) > 0) {
        console.log('ignoring '+line+' because it\'t a reserved by twitter')
        return
      }

      /* push each word */
      q.push({name: line}, function(err) {
        if(err) {
          log = log || fs.createWriteStream('./error-log')
          log.write('\n\nsomething weird happened with '+line+'\n')
          log.write(err)
        }
        processed++
      })
    })
  })
})
