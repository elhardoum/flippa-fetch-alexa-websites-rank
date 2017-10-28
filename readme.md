# Flippa Fetch Alexa Websites Rank Chrome Extension

If you are using Flippa to browse listings and websites for sale, then you'll surly want to get to know if a website has Alexa traffic or not before you can look into the listing further. This extension will save you time as it batch-fetches the rank for the listings available on the page.

This extension works on the websites pages only, specifically any route matching `https://flippa.com/websites*`. Here are the nodes that it looks for in a page:

```js
const SELECTORS = [
  '.ListingResults___listingName',
  '.CardSlider___track .grid__col--bleed-y .text--semibold a',
  '.Section___type_a .grid--bleed .grid__col-6:first-child .text--semibold',
];
```

## Installation

Just like any other custom chrome extension:

1. Download and extract this library or clone via command-line
2. in `chrome://extensions/`, enable developer mode, then click `Load unpacked extensions`
3. Select the folder `flippa-fetch-alexa-websites-rank` which you just cloned/downloaded.

## Quick Usage Guide

1. You'll open Flippa on your Chrome browser and head to the websites page.
2. After the page is loaded, you'll see a counter in red attached to the extension icon (Flippa favicon actually). The counter indicates how many sites are on this page that the extension can fetch ranks for.
3. You click on the extension, it will begin fetching ranks via Alexa API or from the local cache, and you'll see updates indicated in the extension icon counter.