# Twitter Brute Force

Twitter Brute Force is a little script that takes a new-line-seperated dictionary and hammers the fuck out twitter to find which words are available as twitter handles.

To avoid rate limiting, this script does __not__ use the Twitter REST API, it instead queries for the presumed profile's status code. As a result it generates false-positives on reserved account names.

## Usage

The main script, brute.js takes multiple dictionaries as arguments.

Available handles go to a file called ```available```.

```
node brute.js dictionary1 dictionary2 dictionary3
```

brute.js responds to ```SIGUSR1``` with the current number of handles processed.

The other script, generate.js generates all permutations of the alphebet up to k characters.

Takes some number k and the output file.

```
node generate.js 3 permutations3
```

_note that this is O(n^k) runtime_

## Results

In case you're interested, here are some results.

All 4-letter twitter available twitter handles with no more than two consonants next to each other (pronouncable?)

http://peticol.as/twitter-handles/4-letter-ok-sounding.txt

251,453 english words currently available from brute-forcing the (RIDYHEW)[http://www.codehappy.net/wordlist.htm] list

http://peticol.as/twitter-handles/english-words.txt
