Scrabble
=======================

[![Code Climate](https://codeclimate.com/github/dwatson62/scrabble/badges/gpa.svg)](https://codeclimate.com/github/dwatson62/scrabble) [![Build Status](https://travis-ci.org/dwatson62/scrabble.svg?branch=master)](https://travis-ci.org/dwatson62/scrabble)

![scrabble-logo](https://github.com/dwatson62/scrabble/blob/master/public/images/scrabble-logo.jpg)

## Synopsis

Making Scrabble in Angular. Because why not. Available at [https://scrabble62.herokuapp.com/](https://scrabble62.herokuapp.com/)

Current Version:

![screenshot](https://github.com/dwatson62/scrabble/blob/master/public/images/screenshot.jpg)

It is a one player game, players can place a word anywhere on the board and score points for a valid word, and 0 points for an invalid word.

Clicking the 'Game Rules' button will toggle regular scrabble rules. With it on, you have to start on the star tile, and all words must intersect. With it off, you are free to place wherever you like.

To play, click on a letter and the tile where you wish to place it. Once you have finished placing your word, click "Play Word" to submit. If you change your mind, the "Clear" button will reset your selection. You can swap an unwanted letter by selecting it, and then clicking "Swap Letter". Bonus points can be scored by placing letters on the appropriate tiles. Selecting a blank tile and then a position on the board will display a popup, where you can choose what letter to replace it with. Blanks score 0 points.

Words can currently intersect with each other horizontally and vertically. Cannot yet make hook words.

When the game runs low on letters, the console merely says game over.

The main scrabble controller is very large, and I would like to separate it out into separate ones, and to use an Angular Service to hold data. It's rather difficult to do now though, as the controller is rather complex.

## Installation

The program requires access to the wordnik dictionary API. To get your token, visit [http://developer.wordnik.com/](http://developer.wordnik.com/)

- ``` git clone https://github.com/dwatson62/scrabble ```
- ``` cd scrabble ```
- ``` touch .env ``` and then add ``` APIKEY=<your api key> ``` to the file
- ``` npm start ```(this will install all node modules and bower components, then start the server)
- Visit [http://localhost:3000](http://localhost:3000)

## To run the tests after installation

#### Unit tests

- ``` npm test ```

#### Feature tests

In seperate windows:

- ``` npm start ```
- ``` webdriver-manager update ``` then ``` webdriver-manager start ```
- ``` protractor spec/e2e/conf.js ```

## Technologies Used

- Node JS
- Angular, Express, UnderscoreJS
- Karma, Jasmine, Protractor
