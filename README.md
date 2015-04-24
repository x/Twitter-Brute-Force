# Available Twitter Handles
*Adapted from [x's](https://github.com/x) [Twitter Brute Force](https://github.com/x/Twitter-Brute-Force).*

--------------------------------------------------------------------------------------------

**Forked by**: [@NicholasRBowers](http://twitter.com/NicholasRBowers)

**Original Author:**
* [Twitter Brute Force](https://github.com/x/Twitter-Brute-Force) by [Devon Peticolas](https://github.com/x) @ Chartbeat

--------------------------------------------------------------------------------------------

Available Twitter Handles is a little script that takes a new-line-separated dictionary and hammers the fuck out Twitter to find which words are available as twitter handles.

To avoid rate limiting, this script does __not__ use the Twitter REST API, it instead queries for the presumed profile's status code. As a result it generates false-positives on reserved account names.


## Usage

### brute.js

The main script, brute.js takes multiple dictionaries as arguments.

Available handles go to a file called ```available```.

```
node brute.js dictionary1 dictionary2 dictionary3
```

brute.js responds to ```SIGUSR1``` with the current number of handles processed.


### generate.js

The other script, generate.js generates all permutations of the alphabet up to k characters.

Takes some number k and the output file.

```
node generate.js 3 permutations3
```

_note that this is O(n^k) runtime_


### brute_names.js

A name generation script was further added by [FlavFS](https://github.com/FlavSF). It requires a ```first.csv``` and ```last.csv``` to be in the immediate directory.

## Dictionaries

I've pushed the dictionaries that I've been using to a separate repo called [Twitter-Brute-Force-Dictionaries](https://github.com/dpeticol/Twitter-Brute-Force-Dictionaries)


## Results

In case you're interested, here are some results.

All 4-letter twitter available twitter handles with no more than two consonants next to each other (pronounceable?)

http://peticol.as/twitter-handles/4-letter-ok-sounding.txt

251,453 english words currently available from brute-forcing the [RIDYHEW](http://www.codehappy.net/wordlist.htm) list

http://peticol.as/twitter-handles/english-words.txt