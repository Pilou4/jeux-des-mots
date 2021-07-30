function checkValidity(words) 
{ 
    const validity = words.every(e => allWords.some(f => f == e.toLowerCase())); 
    return validity; 
} 

function checkPlayedWords() 
{
       let touched = $('.gameArea .tileItem').get().map(e =>
       { 
              let result = []; 
              const pX = parseInt($(e).offset().left / (board.tileSize + board.offset)); 
              const pY = parseInt($(e).offset().top / (board.tileSize + board.offset)) - 1; 
              if (gameBoard[(pY - 1)][pX] != '') 
              { 
                     let point = pY - 1; 
                     let addLetter = gameBoard[pY - 1][pX]; 
                     while (addLetter != "") 
                     { 
                            addLetter = gameBoard[point--][pX]; 
                     } 
                     const firstPos = point + 2; 
                     const index = pX; 
                     let code = 'V' + firstPos; 
                     let tiles = [$('.tileItem[data-coords="' + point + '-' + pX + '"]')]; 
                     point = firstPos; 
                     let witness = $('.tileItem[data-coords="' + point + '-' + pX + '"]').length == 0 ? '' : '+'; 
                     addLetter = gameBoard[point++][pX]; 
                     let newWord = addLetter; 
                     while (addLetter != "") 
                     { 
                            witness += $('.tileItem[data-coords="' + point + '-' + pX + '"]').length == 0 ? '' : '+'; 
                            tiles.push($('.tileItem[data-coords="' + point + '-' + pX + '"]')); 
                            code += '-' + point; 
                            addLetter = gameBoard[point++][pX]; 
                            newWord += addLetter; 
                     } 
                            result.push ({code: code, word: newWord, witness: witness, items: tiles, position: pX}); 
              } 
              if (gameBoard[(pY + 1)][pX] != '') 
              { 
                     let point = pY + 1; 
                     let addLetter = gameBoard[pY + 1][pX]; 
                     while (addLetter != "") 
                     { 
                            addLetter = gameBoard[point--] [pX]; 
                     } 
                     const firstPos = point + 2; 
                     let code = 'V' + firstPos; 
                     let tiles = [$('.tileItem[data-coords="' + point + '-' + pX + '"]')]; 
                     point = firstPos; 
                     let witness = $('.tileItem[data-coords="' + point + '-' + pX + '"]').length == 0 ? '' : '+'; 
                     addLetter = gameBoard[point++][pX]; 
                     let newWord = addLetter; 
                     while (addLetter != "") 
                     { 
                            witness += $('.tileItem[data-coords="' + point + '-' + pX + '"]').length == 0 ? '' : '+'; 
                            tiles.push($('.tileItem[data-coords="' + point + '-' + pX + '"]')); 
                            code += '-' + point; 
                            addLetter = gameBoard[point++][pX]; 
                            newWord += addLetter; 
                     } 
                     result.push ({code: code, word: newWord, witness: witness, items: tiles, position: pX}); 
                     } 
                     if (gameBoard[pY][pX - 1] != '') 
                     { 
                            let point = pX - 1; 
                            let addLetter = gameBoard[pY][pX - 1]; 
                     while (addLetter != "") 
                     { 
                            addLetter = gameBoard[pY][point--]; 
                     } 
                     const firstPos = point + 2; 
                     let code = 'H' + firstPos; 
                     let tiles = [$('.tileItem[data-coords="' + pY + '-' + point + '"]')]; 
                     point = firstPos; 
                     let witness = $('.tileItem[data-coords="' + pY + '-' + point + '"]').length == 0 ? '' : '+'; 
                     addLetter = gameBoard[pY][point++]; 
                     let newWord = addLetter; 
                     while (addLetter != "") 
                     { 
                            witness += $('.tileItem[data-coords="' + pY + '-' + point + '"]').length == 0 ? '' : '+'; 
                            tiles.push($('.tileItem[data-coords="' + pY + '-' + point + '"]')); 
                            code += '-' + point; 
                            addLetter = gameBoard[pY][point++]; 
                            newWord += addLetter; 
                     } 
                     result.push ({code: code, word: newWord, witness: witness, items: tiles, position: pY}); 
              } 
                     if (gameBoard[pY][pX + 1] != '') 
                     { 
                            let point = pX + 1; 
                            let addLetter = gameBoard[pY][pX + 1]; 
                            while (addLetter != "") 
                            { 
                                   addLetter = gameBoard[pY][point--]; 
                            } 
                            const firstPos = point + 2; 
                            let code = 'H' + firstPos; 
                            let tiles = [$('.tileItem[data-coords="' + pY + '-' + point + '"]')]; 
                            point = firstPos; 
                            let witness = $('.tileItem[data-coords="' + pY + '-' + point + '"]').length == 0 ? '' : '+'; 
                            addLetter = gameBoard[pY][point++]; 
                            let newWord = addLetter; 
                            while (addLetter != "") 
                            { 
                                   witness += $('.tileItem[data-coords="' + pY + '-' + point + '"]').length == 0 ? '' : '+'; 
                                   tiles.push($('.tileItem[data-coords="' + pY + '-' + point + '"]')); 
                                   code += '-' + point; 
                                   addLetter = gameBoard[pY][point++]; 
                                   newWord += addLetter; 
                            } 
                            result.push ({code: code, word: newWord, witness: witness, items: tiles, position: pY}); 
                     } 
                     return result; 
              } 
       );
       let playedWords = new Set();
       let tileItems = touched.flat().filter (e => e.witness != "").map(e => 
              {
                     return {code: e.code + ',' + e.word, position: e.position};
              } 
       ); 
       tileItems.forEach(e => {playedWords.add(e.code);});
       playedWords = Array.from(playedWords.values()).map(e => e.split(',')[1]);
       let answer = {status: true, words: playedWords, score: getPlayedWordsValue(tileItems)}
        
       return answer; 
}

function getPlayedWordsValue(tileItems) 
{ 
    let gamePoints = new Map(); 
    let wordBonus = 0; 
    tileItems.forEach(e =>
       { 
              let code = e.code.split(',')[0]; 
              const orientation = code.substr(0, 1); 
              code = code.substr(1); 
              const letters = code.split('-'); 
              let wordPoints = 0; 
              let wordBonus = 0;
              let extraPoints = 0;
		if (e.code.split(',')[1].length >= 8 && currentPlayer.rack == currentPlayer.rack.split('').map(f => {if (e.code.split(',')[1].indexOf(f) > -1) {return f;} else {return '';}}).join(''))
		{
			extraPoints = 50;
		} 
              let theLetter; 
              let netPoints; 
              let specialCell; 
              for (let c = 0; c < letters.length - 1; c++) 
              { 
                     if (orientation == 'H') 
                     { 
                            theLetter = $('.playedTileItem[data-coords="' + e.position + '-' + letters[c] + '"],.waitingLetter[data-coords="' + e.position + '-' + letters[c] + '"]').find('label:first').text(); 
                            netPoints = +$('.playedTileItem[data-coords="' + e.position + '-' + letters[c] + '"],.waitingLetter[data-coords="' + e.position + '-' + letters[c] + '"]').find('label:last').text(); 
                            specialCell = specialCells.find(f =>  f.line == e.position && f.column == letters[c] && (!f.used || f.used == 0)); 
                     } 
                     else 
                     { 
                            theLetter = $('.playedTileItem[data-coords="' + letters[c] + '-' + e.position + '"],.waitingLetter[data-coords="' + letters[c] + '-' + e.position + '"]').find('label:first').text(); 
                            netPoints = +$('.playedTileItem[data-coords="' + letters[c] + '-' + e.position + '"],.waitingLetter[data-coords="' + letters[c] + '-' + e.position + '"]').find('label:last').text(); 
                            specialCell = specialCells.find(f =>  f.line == letters[c] && f.column == e.position && (!f.used || f.used == 0)); 
                     } 
                     let bonus = 1; 
                     if (specialCell) 
                     { 
                            specialCell.used = 0; 
                            switch (specialCell.type) 
                            { 
                                   case 'doubleLetter': 
                                          bonus = 2; 
                                          break; 
                                   case 'tripleLetter': 
                                          bonus = 3; 
                                          break; 
                                   case 'doubleWord': 
                                          wordBonus += 2; 
                                          bonus = 1; 
                                          break; 
                                   case 'tripleWord': 
                                          wordBonus += 3; 
                                          bonus = 1; 
                                          break; 
                                   default: 
                                          bonus = 1; 
                                          break; 
                            } 
                     } 
                     wordPoints += +netPoints * bonus; 
              } 
              gamePoints.set(e.code, wordPoints * (wordBonus == 0 ? 1 : wordBonus)); 
       } 
       ); 
       return [...gamePoints.values()].reduce ((c, p) => c + p, 0); 
}

