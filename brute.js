// TODO - Search for false-positives in the results by connecting to the Twitter API.

var args = process.argv.slice(2)
  , mode = args.shift();

switch (mode) {
  case 'twitter':
    bruteForce('twitter', args, 'https://twitter.com/', ['post', 'session', 'join', 'apps', 'auth', 'list', 'root', 'phone']);
    break;

  case 'github':
    bruteForce('github', args, 'https://github.com/', ['c','session', 'join', 'apps']);
    break;

  default:
    console.log(mode + ' is an unsupported mode.');
}

function bruteForce(nameSpace, dictionaries, url, reservedWords) {
  var request = require('request')
    , fs = require('fs')
    , async = require('async')
    , timestamp = require('console-timestamp')
    , progress = require('progress')
    , available = fs.createWriteStream('./' + nameSpace + '.available')
    , fileNames = dictionaries
    , handles = []
    , log

    // Queue of requests with a pool of 10 async tasks.
    , q = async.queue(function (task, callback) {

        request.head(url + task.name, function (err, res) {

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
                log = log || fs.createWriteStream('./' + nameSpace + '.log');
                log.write(timestamp('[DD-MM-YY hh:mm:ss] ') + message + '\n');
              }

              bar.tick();
              if (bar.complete) {
                console.log('\nComplete!\n');
              }

              callback();
            };

        if (handle == false) {
          postHandle();
        } else if (handle.length < 4) {
          postHandle('Ignoring ' + handle + ' because all handles of 3 characters or less are taken.');
        } else if (handle.length > 15) {
          postHandle('Ignoring ' + handle + ' because Twitter handles must be less than 15 characters.');
        } else if (reservedWords.indexOf(handle) > 0) {
          postHandle('Ignoring ' + handle + ' because it\'s reserved by Twitter.');
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
}