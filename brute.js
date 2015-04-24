// TODO - Search for false-positives in the results by connecting to the Twitter API.

var request = require('request')
  , fs = require('fs')
  , async = require('async')
  , timestamp = require('console-timestamp')
  , progress = require('progress')
  , available = fs.createWriteStream('./available')
  , fileNames = process.argv.splice(2)
  , handles = []
  , log
  , reservedWords = ['post', 'session', 'join', 'apps', 'auth', 'list', 'root', 'phone']

  // Queue of requests with a pool of 10 async tasks.
  , q = async.queue(function (task, callback) {

      request.head('https://twitter.com/' + task.name, function (err, res) {

        if(res && res.statusCode === 404) {
          available.write(task.name + '\n');
        }

        callback(err);
      });
    }, 10);

// Read all the dictionaries.
async.each(fileNames, function (fileName, callback) {

    fs.readFile('./' + fileName, 'utf8', function (err, data) {

      if(err) {
        callback(err);

      } else {
        // Split file by lines (removing extra spaces/tabs) and add to handles pool.
        handles = handles.concat(data.replace(/( |\t)+/g, '').split('\n'));
        callback();
      }
    });
  }, function (err) {

    // Create progress bar.
    var bar = new progress('  Analyzing [:bar] [:current / :total] :percent ETA ~:etas', {
          complete: '=',
          incomplete: ' ',
          width: 30,
          total: handles.length
        });

    // Process each of the handles.
    async.each(handles, function (handle, callback) {

      var postHandle = function (message) {
            if (message) {
              log = log || fs.createWriteStream('./log');
              log.write(timestamp('[DD-MM-YY hh:mm:ss]') + message);
            }

            bar.tick();
            if (bar.complete) {
              console.log('\nComplete!\n');
            }

            callback();
          };

      if(handle == false) {
        postHandle();
      } else if(handle < 4) {
        postHandle('Ignoring ' + handle + ' because all handles of 3 characters or less are taken.\n');
      } else if (handle > 15) {
        postHandle('Ignoring ' + handle + ' because Twitter handles must be less than 15 characters.\n');
      } else if(reservedWords.indexOf(handle) > 0) {
        postHandle('Ignoring ' + handle + ' because it\'s reserved by Twitter.\n');
      } else {
        // Fill the async request queue.
        q.push({name: handle}, function (err) {

          if(err) {
            postHandle('Something weird happened with ' + handle + ':\n' + err);

          } else {
            postHandle();
          }
        });
      }
    }, function (err, message) {

        if (err) {
          console.log('Failed: ' + err);
        }
    });
  }
);