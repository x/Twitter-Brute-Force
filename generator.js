var fs = require('fs')
  , output = fs.createWriteStream('./' + process.argv[3] || 'output')
  , length = parseInt(process.argv[2])
  , alphabet = ('abcdefghijklmnopqrstuvwxyz').split('')

  , compose = function(str) {
    if(str.length < length) {
      alphabet.forEach(function(letter) {
        compose(str + letter)
      })
    } else {
      output.write(str + '\n')
    }
  }

compose('')
