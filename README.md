# Twitter Brute Force

Twitter Brute Force is a nice little script that takes a new-line-seperated dictionary and hammers the fuck out twitter to find which words are available as twitter handles.

It does this by simply taking a _word_, requesting http://www.twitter.com/_word_ and checking if the status code is 404. The reason it  doesn't use Twitter's REST API is because Twitter rate-limits user lookups, so yeah, fuck that shit. As a result, banned or unavailable names show up as available so just make sure you check.

## Usage

The main script, brute.js takes multiple libraries as arguments.

Output goes to a file called output, errors go to error-log.

```
node brute.js library1 library2 library3
```

The other script, generate.js generates all permutations of the alphebet up to k characters.

Takes some number k and the output file.

```
node generate.js 3 all-three-letter-combinations
```

_note that this is O(n^k) runtime_
