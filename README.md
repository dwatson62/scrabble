Scrabble
=======================

[![Code Climate](https://codeclimate.com/github/dwatson62/scrabble/badges/gpa.svg)](https://codeclimate.com/github/dwatson62/scrabble) [![Build Status](https://travis-ci.org/dwatson62/scrabble.svg?branch=master)](https://travis-ci.org/dwatson62/scrabble)

![scrabble-logo](https://github.com/dwatson62/scrabble/blob/master/public/images/scrabble-logo.jpg)

## Synopsis

Making Scrabble in Angular. Because why not. Available at [https://scrabble62.herokuapp.com/](https://scrabble62.herokuapp.com/)

Current Version:

![screenshot](https://github.com/dwatson62/scrabble/blob/master/public/images/screenshot.jpg)

Currently a one player game, players can score points for a valid word, and 0 points for an invalid word.

To play the game, click on a letter of your choice and the centre tile. You may only place tiles next to previously laid ones. Once you have finished placing your word, click "Play Word" to submit. If you change your mind, the "Clear" button will reset your selection. You can swap an unwanted letter by selecting it, and then clicking "Swap Letter". Bonus points can be scored by placing letters on the appropriate tiles, or by using all your letters in one turn. Selecting a blank tile and then a position on the board will display a popup, where you can choose what letter to replace it with. Blanks score 0 points.

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

During development environment, you have the option of toggling the game rules. Clicking the 'Game Rules' button will use regular scrabble rules. With it off, you are free to place tiles wherever you like.

## To run the tests after installation

#### Unit tests

- ``` npm test ```

#### Feature tests

In seperate windows:

- ``` npm start ```
- ``` webdriver-manager update ``` then ``` webdriver-manager start ```
- ``` protractor spec/e2e/conf.js ```

## To do

- Allow players to make hook words
- Implement a better game over

## Technologies Used

- Node JS
- Angular, Express, UnderscoreJS
- Karma, Jasmine, Protractor
