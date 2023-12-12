(function () {

  var WordFind = function () {// Letters used to fill blank spots in the puzzle
    var letters = 'abcdefghijklmnoprstuvwyz';// The list of all the possible orientations
    var allOrientations = ['horizontal','horizontalBack','vertical','verticalUp',
                           'diagonal','diagonalUp','diagonalBack','diagonalUpBack'];
    var orientations = {
      horizontal:     function(x,y,i) { return {x: x+i, y: y  }; },
      horizontalBack: function(x,y,i) { return {x: x-i, y: y  }; },
      vertical:       function(x,y,i) { return {x: x,   y: y+i}; },
      verticalUp:     function(x,y,i) { return {x: x,   y: y-i}; },
      diagonal:       function(x,y,i) { return {x: x+i, y: y+i}; },
      diagonalBack:   function(x,y,i) { return {x: x-i, y: y+i}; },
      diagonalUp:     function(x,y,i) { return {x: x+i, y: y-i}; },
      diagonalUpBack: function(x,y,i) { return {x: x-i, y: y-i}; }
    };

    var checkOrientations = {
      horizontal:     function(x,y,h,w,l) { return w >= x + l; },
      horizontalBack: function(x,y,h,w,l) { return x + 1 >= l; },
      vertical:       function(x,y,h,w,l) { return h >= y + l; },
      verticalUp:     function(x,y,h,w,l) { return y + 1 >= l; },
      diagonal:       function(x,y,h,w,l) { return (w >= x + l) && (h >= y + l); },
      diagonalBack:   function(x,y,h,w,l) { return (x + 1 >= l) && (h >= y + l); },
      diagonalUp:     function(x,y,h,w,l) { return (w >= x + l) && (y + 1 >= l); },
      diagonalUpBack: function(x,y,h,w,l) { return (x + 1 >= l) && (y + 1 >= l); }
    };

  var skipOrientations = {
      horizontal:     function(x,y,l) { return {x: 0,   y: y+1  }; },
      horizontalBack: function(x,y,l) { return {x: l-1, y: y    }; },
      vertical:       function(x,y,l) { return {x: 0,   y: y+100}; },
      verticalUp:     function(x,y,l) { return {x: 0,   y: l-1  }; },
      diagonal:       function(x,y,l) { return {x: 0,   y: y+1  }; },
      diagonalBack:   function(x,y,l) { return {x: l-1, y: x>=l-1?y+1:y    }; },
      diagonalUp:     function(x,y,l) { return {x: 0,   y: y<l-1?l-1:y+1  }; },
      diagonalUpBack: function(x,y,l) { return {x: l-1, y: x>=l-1?y+1:y  }; }
    };

    var fillPuzzle = function (words, options) {

      var puzzle = [], i, j, len;
      console.log('options = ', options);// initialize the puzzle with blanks
      for (i = 0; i < options.height; i++) {
        puzzle.push([]);
        for (j = 0; j < options.width; j++) {
          puzzle[i].push('');
        }
      }// add each word into the puzzle one at a time
      for (i = 0, len = words.length; i < len; i++) {
        if (!placeWordInPuzzle(puzzle, options, words[i])) {// if a word didn't fit in the puzzle, give up
          return null;
        }
      }// return the puzzle
      return puzzle;
    };
    var placeWordInPuzzle = function (puzzle, options, word) {  // find all of the best locations where this word would fit
      var locations = findBestLocations(puzzle, options, word);

      if (locations.length === 0) {
        return false;
      } // select a location at random and place the word there
      var sel = locations[Math.floor(Math.random() * locations.length)];
      placeWord(puzzle, word, sel.x, sel.y, orientations[sel.orientation]);

      return true;
    };
    var findBestLocations = function (puzzle, options, word) {

      var locations = [],
          height = options.height,
          width = options.width,
          wordLength = word.length,
          maxOverlap = 0; // we'll start looking at overlap = 0 // loop through all of the possible orientations at this position
      for (var k = 0, len = options.orientations.length; k < len; k++) {
       
        var orientation = options.orientations[k],
            check = checkOrientations[orientation],
            next = orientations[orientation],
            skipTo = skipOrientations[orientation],
            x = 0, y = 0; // loop through every position on the board
        while( y < height ) { // see if this orientation is even possible at this location
          if (check(x, y, height, width, wordLength)) { // determine if the word fits at the current position
            var overlap = calcOverlap(word, puzzle, x, y, next); // if the overlap was bigger than previous overlaps that we've seen
            if (overlap >= maxOverlap || (!options.preferOverlap && overlap > -1)) {
              maxOverlap = overlap;
              locations.push({x: x, y: y, orientation: orientation, overlap: overlap});
            }

            x++;
            if (x >= width) {
              x = 0;
              y++;
            }
          }
          else {
            var nextPossible = skipTo(x,y,wordLength);
            x = nextPossible.x;
            y = nextPossible.y;
          }

        }
      } // finally prune down all of the possible locations we found by
      // only using the ones with the maximum overlap that we calculated
      return options.preferOverlap ?
             pruneLocations(locations, maxOverlap) :
             locations;
    };

    var calcOverlap = function (word, puzzle, x, y, fnGetSquare) {
      var overlap = 0;
// traverse the squares to determine if the word fits
      for (var i = 0, len = word.length; i < len; i++) {
        var next = fnGetSquare(x, y, i),
           square = puzzle[next.y][next.x];// if the puzzle square already contains the letter we
        // are looking for, then count it as an overlap square
        if (square === word[i]) {
          overlap++;
        } // if it contains a different letter, than our word doesn't fit
 // here, return -1
        else if (square !== '' ) {
          return -1;
        }
      }// if the entire word is overlapping, skip it to ensure words aren't// hidden in other words
      return overlap;
    };

    var pruneLocations = function (locations, overlap) {

      var pruned = [];
      for(var i = 0, len = locations.length; i < len; i++) {
        if (locations[i].overlap >= overlap) {
          pruned.push(locations[i]);
        }
      }

      return pruned;
    };
    var placeWord = function (puzzle, word, x, y, fnGetSquare) {
      for (var i = 0, len = word.length; i < len; i++) {
        var next = fnGetSquare(x, y, i);
        puzzle[next.y][next.x] = word[i];
      }
    };
    return {
      validOrientations: allOrientations,
      orientations: orientations,
      newPuzzle: function(words, settings) {
        var wordList, puzzle, attempts = 0, opts = settings || {};

        console.log('newPuzzle() :: settings = ', settings);
        wordList = words.slice(0).sort( function (a,b) {
          return (a.length < b.length) ? 1 : 0;
        }); // initialize the options
        var options = {
          height:       opts.height || wordList[0].length,
          width:        opts.width || wordList[0].length,
          orientations: opts.orientations || allOrientations,
          fillBlanks:   opts.fillBlanks !== undefined ? opts.fillBlanks : true,
          maxAttempts:  opts.maxAttempts || 3,
          preferOverlap: opts.preferOverlap !== undefined ? opts.preferOverlap : true
        };
        while (!puzzle) {
          while (!puzzle && attempts++ < options.maxAttempts) {
            puzzle = fillPuzzle(wordList, options);
          }

          if (!puzzle) {
            options.height++;
            options.width++;
            attempts = 0;
          }
        }   // fill in empty spaces with random letters
        if (options.fillBlanks) {
          this.fillBlanks(puzzle, options);
        }

        return puzzle;
      },
      fillBlanks: function (puzzle) {
        for (var i = 0, height = puzzle.length; i < height; i++) {
          var row = puzzle[i];
          for (var j = 0, width = row.length; j < width; j++) {

            if (!puzzle[i][j]) {
              var randomLetter = Math.floor(Math.random() * letters.length);
              puzzle[i][j] = letters[randomLetter];
            }
          }
        }
      },
      print: function (puzzle) {
        var puzzleString = '';
        for (var i = 0, height = puzzle.length; i < height; i++) {
          var row = puzzle[i];
          for (var j = 0, width = row.length; j < width; j++) {
            puzzleString += (row[j] === '' ? ' ' : row[j]) + ' ';
          }
          puzzleString += '\n';
        }

        console.log(puzzleString);
        return puzzleString;
      }
    };
  };
  var root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.wordfind = WordFind();
}).call(this);
$(function () {
  var words = ['buffer', 'compiler','array', 'database', 'apps','emoticon', 'flowchart'];
  // start a word find game
  var gamePuzzle = wordfindgame.create(
    words,
    '#puzzle',
    '#words',
    { height: 8,
      width:15,
      fillBlanks: true
    });
 
  // create just a puzzle, without filling in the blanks and print to console
  var puzzle = wordfind.newPuzzle(
    words,
    {height: 5, width:15, fillBlanks: true}
  );
  wordfind.print(puzzle);
});
(function (document, $, wordfind) {

 
  var WordFindGame = function() {// List of words for this game
    var wordList;
    var drawPuzzle = function (el, puzzle) {
      console.log('drawPuzzle()');
      var output = ''; // for each row in the puzzle
      for (var i = 0, height = puzzle.length; i < height; i++) { // append a div to represent a row in the puzzle
        var row = puzzle[i];
        output += '<div>';
        for (var j = 0, width = row.length; j < width; j++) {
            output += '<button class="puzzleSquare" x="' + j + '" y="' + i + '">';
            output += row[j] || '&nbsp;';
            output += '</button>';
        }   // close our div that represents a row
        output += '</div>';
      }

      $(el).html(output);
    };
    var drawWords = function (el, words) {
     
      var output = '<ul>';
      for (var i = 0, len = words.length; i < len; i++) {
        var word = words[i];
        output += '<li class="word ' + word + '">' + word;
      }
      output += '</ul>';

      $(el).prepend(output);
    }; // Game state
    var startSquare, selectedSquares = [], curOrientation, curWord = '';
    var startTurn = function () {
      $(this).addClass('selected');
      startSquare = this;
      selectedSquares.push(this);
      curWord = $(this).text();
    };

    var select = function (target) {
      if (!startSquare) {
        return;
      }
      var lastSquare = selectedSquares[selectedSquares.length-1];
      if (lastSquare == target) {
        return;
      }

      var backTo;
      for (var i = 0, len = selectedSquares.length; i < len; i++) {
        if (selectedSquares[i] == target) {
          backTo = i+1;
          break;
        }
      }

      while (backTo < selectedSquares.length) {
        $(selectedSquares[selectedSquares.length-1]).removeClass('selected');
        selectedSquares.splice(backTo,1);
        curWord = curWord.substr(0, curWord.length-1);
      }
      var newOrientation = calcOrientation(
          $(startSquare).attr('x')-0,
          $(startSquare).attr('y')-0,
          $(target).attr('x')-0,
          $(target).attr('y')-0
          );

      if (newOrientation) {
        selectedSquares = [startSquare];
        curWord = $(startSquare).text();
        if (lastSquare !== startSquare) {
          $(lastSquare).removeClass('selected');
          lastSquare = startSquare;
        }
        curOrientation = newOrientation;
      }
      var orientation = calcOrientation(
          $(lastSquare).attr('x')-0,
          $(lastSquare).attr('y')-0,
          $(target).attr('x')-0,
          $(target).attr('y')-0
          );

      if (!orientation) {
        return;
      }

      if (!curOrientation || curOrientation === orientation) {
        curOrientation = orientation;
        playTurn(target);
      }
    };
 
    var touchMove = function(e) {
      var xPos = e.originalEvent.touches[0].pageX;
      var yPos = e.originalEvent.touches[0].pageY;
      var targetElement = document.elementFromPoint(xPos, yPos);
      select(targetElement)
    };
   
    var mouseMove = function() {
      select(this);
    };
    var playTurn = function (square) {
      for (var i = 0, len = wordList.length; i < len; i++) {
        if (wordList[i].indexOf(curWord + $(square).text()) === 0) {
          $(square).addClass('selected');
          selectedSquares.push(square);
          curWord += $(square).text();
          break;
        }
      }
    };
    var endTurn = function () {
      for (var i = 0, len = wordList.length; i < len; i++) {
       
        if (wordList[i] === curWord) {
          $('.selected').addClass('found');
          wordList.splice(i,1);
          $('.' + curWord).addClass('wordFound');
        }

        if (wordList.length === 0) {
          $('.puzzleSquare').addClass('complete');
        }
      }

      // reset the turn
      $('.selected').removeClass('selected');
      startSquare = null;
      selectedSquares = [];
      curWord = '';
      curOrientation = null;
    };

    var calcOrientation = function (x1, y1, x2, y2) {

      for (var orientation in wordfind.orientations) {
        var nextFn = wordfind.orientations[orientation];
        var nextPos = nextFn(x1, y1, 1);

        if (nextPos.x === x2 && nextPos.y === y2) {
          return orientation;
        }
      }

      return null;
    };

    return {

      create: function(words, puzzleEl, wordsEl, options) {
       
        wordList = words.slice(0).sort();

        var puzzle = wordfind.newPuzzle(words, options);

         console.log('puzzle = ', puzzle);

        drawPuzzle(puzzleEl, puzzle);
        drawWords(wordsEl, wordList);
        if (window.navigator.msPointerEnabled) {
          $('.puzzleSquare').on('MSPointerDown', startTurn);
          $('.puzzleSquare').on('MSPointerOver', select);
          $('.puzzleSquare').on('MSPointerUp', endTurn);
        }
        else {
          $('.puzzleSquare').mousedown(startTurn);
          $('.puzzleSquare').mouseenter(mouseMove);
          $('.puzzleSquare').mouseup(endTurn);
          $('.puzzleSquare').on("touchstart", startTurn);
          $('.puzzleSquare').on("touchmove", touchMove);
          $('.puzzleSquare').on("touchend", endTurn);
        }

        return puzzle;
      },
    };
  };
  window.wordfindgame = WordFindGame();
}(document, jQuery, wordfind));
