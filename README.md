# Pocket - Article Reading Time
A Chrome extension that displays the estimated time to read an article on [Pocket](https://getpocket.com/).

## Motivation
I like how [Medium](https://medium.com/) provides an estimate for how long an article will take to read. However, I read most articles on Pocket, which lacks this feature.

## Challenges

**The Pocket Article View API is currently only open to certain partners**

I resort to scraping the page to grab the article content

**The Pocket website is a single page**

I don't want to have to click a Chrome page action icon to initiate the process.

Unfortunately, Chrome injects JavaScript for extensions when a page first loads, but not for single page navigation afterwards.
This means I have to prematurely inject the script and do my best to watch for changes in the DOM that indicate when an article loads or changes.