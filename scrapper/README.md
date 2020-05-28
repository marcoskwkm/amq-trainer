# AMQ Song List Scrapper

This script will collect the list of all songs from your anime list in AMQ. Note that since this comes from the expand library list, songs that have all versions uploaded will not appear.

## How to use

Open AMQ and log in. Paste the contents of `scripts.js` in the console and go to expand library. A download popup for `songlist.json` should show up. The contents of this file have the following structure:

```js
[{
  "annId": number,
  "name": string,
  "songs": [{
    "annSongId": number,
    "name": string,
    "type": number, // 1 for OP, 2 for ED or 3 for IN
    "number": number,
    "artist": string,
    "examples": { // the URLs for the songs
      "480": string | undefined,
      "720": string | undefined,
      "mp3": string | undefined,
    },
    "versions", //not relevant
}]
```
