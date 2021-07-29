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
                            result.push ({code: code, word:  
                            newWord, witness: witness, items: tiles, position: pX}); 
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
                            result.push ({code: code, word:  
                            newWord, witness: witness, items: tiles, position: pX}); 
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
                                   result.push ({code: code, word:  
                                   newWord, witness: witness, items: tiles, position: pY}); 
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
                                   result.push ({code: code, word:  
                                   newWord, witness: witness, items: tiles, position: pY}); 
                            } 
                            return result; 
                     } 
              ); 
              let answer = {status: true, words: playedWords, score:  
              getPlayedWordsValue(tileItems)}
              let playedWords = new Set(); 
              let tileItems =  touched.flat().filter (e => e.witness != "").map(e => 
                     {
                            return {code: e.code + ',' + e.word, position: e.position};
                     } 
              );
              tileItems.forEach(e => 
              { 
                     playedWords.add(e.code); 
              } 
       ); 
       playedWords = Array.from(playedWords.values()).map(e => e.split(',')[1]); 
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

// vérifie la rectitude du placement des différentes tuiles placées sur le plateau de jeu.
function checkPositioning () 
{ 
    let letters = $('.gameArea .tileItem').get(); 
    let line = $(letters[0]).offset().top; 
    let column = $(letters[0]).offset().left; 
    const horizontalWord = letters.every(e => $(e).offset().top === line); 
    const verticalWord = letters.every(e => $(e).offset().left === column); 
    if (!verticalWord && !horizontalWord) 
    { 
           return {status: false, reason: 'Les lettres jouées ne sont pas toutes alignées horizontalement ou verticalement.'}; 
    }
    let word =letters.map (e => $(e).find('label:first').text()).join(''); 
    if ($('.playedTileItem').length == 0) 
    { 
        if (word.length < 2) 
        { 
            return {status: false, reason: "Le mot proposé est trop court."}; 
        } 
    }
    if (!letters.some(e => parseInt($(e).offset().left / (board.tileSize + 
        board.offset)) == 7 && parseInt($(e).offset().top / (board.tileSize +  
        board.offset)) - 1 == 7)) 
        { 
            return {status: false, reason: 'Une des lettres du premier mot joué doit être posée sur la case centrale du plateau.'}; 
        } else
        {
            line = parseInt(line / (board.tileSize + board.offset)) - 1; 
            column = parseInt(column / (board.tileSize + board.offset)); 
            checkPositionValidity = $('.playedTileItem').get().some(e =>
                {
                    return (
                        horizontalWord &&
                        (((parseInt($(e).offset().top /(board.tileSize + board.offset)) - 1 == line - 1 || 
                        parseInt($(e).offset().top / (board.tileSize + board.offset)) - 1 == line + 1 ) && 
                        parseInt($(e).offset().left /(board.tileSize + board.offset)) >= column &&
                        parseInt($(e).offset().left / (board.tileSize + board.offset)) <= column + word.length - 1 ) || 
                        (parseInt($(e).offset().top / (board.tileSize + board.offset)) - 1 == line &&
                        (parseInt($(e).offset().left / (board.tileSize + board.offset)) == column - 1 || 
                        parseInt($(e).offset().left / (board.tileSize + board.offset)) == column + word.length))) 
                   ) ||
                   ( 
                        verticalWord &&
                        (((parseInt($(e).offset().left / (board.tileSize + board.offset)) == column - 1 ||
                        parseInt($(e).offset().left / (board.tileSizboard.offset)) == column + 1) &&  
                        parseInt($(e).offset().top / (board.tileSize + board.offset)) - 1 >= line  && 
                        parseInt($(e).offset().top / (board.tileSize + board.offset)) - 1 <= line + word.length - 1 
                   ) || 
                   (
                       parseInt($(e).offset().left / (board.tileSize + board.offset)) == column &&
                       (parseInt($(e).offset().top / (board.tileSize + board.offset)) - 1 == line - 1 ||
                       parseInt($(e).offset().top / (board.tileSize + board.offset)) - 1 == line + word.length))) 
                    ); 
                } 
            ); 
            if (!checkPositionValidity) 
            { 
                return {status: false, reason: 'Tout nouveau mot doit en croiser au moins un déjà existant.'}; 
            } 
        }  
        return checkPlayedWords();
}

function checkValidity(words) 
{ 
    const validity = words.every(e => allWords.some(f => f == e.toLowerCase())); 
    return validity; 
} 