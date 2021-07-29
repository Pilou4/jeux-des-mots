function validate() 
{ 
   if (checkValidity(playedWords.words)) 
   { 
    $('.infoZone').text('Vous venez de marquer ' + playedWords.score + ' points'); 
    currentPlayer.score += playedWords.score;
    $('.waitingLetter').get().forEach(e =>
        { 
            const line = parseInt($(e).offset().top / (board.tileSize + board.offset)) - 1; 
            const column = parseInt($(e).offset().left / (board.tileSize + board.offset)); 
            $(e).attr('data-coords', line + "-" + column); 
            $('.cell[data-coords="' + line + "-" + column + '"]').attr('data-letterValue', $(e).find('label:first').text()); 
        } 
    ); 
    $('.waitingLetter').removeClass('tileItem').removeClass('waitingLetter').addClass('playedTileItem'); 
    $('#WCValidate, #WCCancel').addClass('disabled'); 
    $('.historyZone').html(('000' + ($('.historyZone').html().split('<br>').length)).substr(-3) + ' - ' + playedWords.words.join(' + ') + ' - ' + playedWords.score + ' points<br>' + $('.historyZone').html()); 
    specialCells.filter(e => e.used == 0).forEach(e => e.used = 1); 
    const missingLetter = 7 - $('.playerRack .tileItem').length; 
    getPlayerLetters(missingLetter); 
    prepareTiles();
    updateGame(); 
    if (currentPlayer.pid == 1) 
    { 
        currentGame.round++; 
    }
    saveGames(); 
   } 
   else 
   { 
        const badWords = playedWords.words.filter(e => !allWords.some(f => f == e.toLowerCase())); 
        $('.infoZone').text('Au moins un mot joué est inconnu : ' + badWords.join(' ')); 
   } 
} 
 
function cancel() 
{ 
    $('#WCValidate, #WCCancel').addClass('disabled'); 
    try 
    { 
        $('.tileItem').draggable('destroy'); 
    } 
    catch (ex) 
    {} 
    $('.waitingLetter').get().map(e =>
        { 
            const cellX = parseInt($(e).offset().left / (board.tileSize + board.offset)); 
            const cellY = parseInt($(e).offset().top / (board.tileSize + board.offset)) - 1; 
            gameBoard[cellY][cellX] = ""; 
        } 
    ); 
    specialCells.filter(e => e.used == 0).forEach(e => e.used = undefined); 
    $('.waitingLetter').removeClass('waitingLetter').attr('style', '').addClass('tileItem').appendTo($('.playerRack')); 
    prepareTiles(); 
}

function shuffle() 
{ 
    let letters = $('.playerRack .tileItem').get(); 
    letters.shuffle(); 
    $(letters).each ((i, e) => $(e).appendTo($('.playerRack')));  
}

function changeTiles() 
{ 
    const oldLetters = $('.playerRack .tileItem').get().map(e => 
        {
            const letter = $(e).find('label:first').text(); return letter == '' ? '*' : letter;}).join(''); 
            letterBag = letterBag + oldLetters; 
            const newLetters = takeLettersFromBag(oldLetters.length); 
            $('.playerRack .tileItem').remove(); 
            placeTilesOnPlayerRack(newLetters.split('')); 
            prepareTiles(); 
            players[0].score -= 15; 
            $('.historyZone').html(('000' + ($('.historyZone').html().split('<br>').length)).substr(-3) + ' - Echange de lettres - -15 points<br>' + 
            $('.historyZone').html());
            updateGame(); 
            saveGames();  
}

function createGame() 
{ 
    players = []; 
    currentPlayer = {
        name: $('.txtPlayerName:first').val() ? $ ('.txtPlayerName:first').val() : "Joueur 1", 
        uid: guid(), 
        pid: 1, 
        score: 0 
    }; 
    players.push(currentPlayer); 
    for (let t = 2; t < 5; t++) 
    { 
        if ($('#chkPlayer' + t).prop('checked')) 
        { 
            players.push(
                { 
                    name: $('.txtPlayerName:eq(' + (t - 1) + ')').val() ? $('.txtPlayerName:eq(' + (t - 1) + ')').val() : "Joueur " + t, 
                    uid: guid(), 
                    pid: t, 
                    score: 0, 
                    rack: takeLettersFromBag(7) 
                } 
            ); 
        } 
    } 
    currentGame ={
        gameId: guid(), 
        name: $('#txtGameName').val() ? $('#txtGameName').val() : "Nouvelle partie", 
        mode: $('.gameOptions input[name="gameMode"]:checked').val(),
        mapping: currentPlayer.uid, 
        round: 0 
    }; 
    updateGame();
    games.push(currentGame);
    saveGames();
    showGames();  
    $('.mainMenu').hide(); 
} 
 
function updateGame() 
{ 
    currentPlayer.rack = $('.tileItem').get().map(e => {return $(e).find('label:first').text() == '' ? '*' : $(e).find('label:first').text();}).join(''); 
    currentGame.board = encodeBoard(); 
    currentGame.bag = letterBag; 
    currentGame.history = $('.historyZone').html(); 
    currentGame.players = players; 
    currentGame.turnId = currentPlayer.uid; 
    if (currentPlayer.pid == 1) 
    { 
        currentGame.round++; 
    } 
}

function loadGame(e) 
{ 
    currentGame = games[$(e.currentTarget).attr('data-index')]; 
    players = currentGame.players; 
    currentPlayer = players.find(f => f.uid == currentGame.turnId); 
    boardGame = ""; 
    $('.playedTileItem').remove(); 
    if (currentGame.board != '') 
    { 
        currentGame.board.match(/.{4}/g).forEach (f =>
            { 
                const line = f.charCodeAt(0) - 65; 
                const column = f.charCodeAt(1) - 65; 
                const letter = f.substr(2, 1); 
                const value = f.charCodeAt(3) - 65; 
                gameBoard[line][column] = letter; 
                const specialCell = specialCells.find(g => g.line == line && g.column == column); 
                if (specialCell) 
                { 
                    specialCell.used = 1; 
                } 
                $('.gameArea').append('<div class="playedTileItem" data-coords="' + line + '-' + column + '" style="position: absolute; left: ' + (board.xOffset + (column * (board.tileSize + board.offset))) + 'px; top: '  + (board.yOffset + (line * (board.tileSize + board.offset))) + 'px;"><label class="tileLetter">' + (letter == '*' ? '' : letter) + '</label><label class="tilePoints">' + value + '</label></div>'); 
            } 
        ); 
    } 
    letterBag = currentGame.bag; 
    $('.historyZone').html(currentGame.history); 
    $('.playerRack').empty(); 
    placeTilesOnPlayerRack(currentPlayer.rack.split('')); 
    prepareTiles(); 
    $('.mainMenu').hide(); 
}

function deleteGame(e) 
{ 
    const gameIndex = $(e.currentTarget).attr('data-index'); 
    confirmCommand({message: "Etes-vous sûr(e) de vouloir supprimer cette partie ?", yesFunction: () => confirmDelete(gameIndex)}); 
}

function confirmDelete(gameIndex) 
{ 
    $('.continueGame li')[gameIndex].remove(); 
    games.splice(gameIndex, 1); 
    saveGames(); 
}