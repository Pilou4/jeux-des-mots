function validate() 
{ 
   if (checkValidity(playedWords.words)) 
   { 
    $('.infoZone').text('Vous venez de marquer ' + playedWords.score + ' points'); 
    players[0].score += playedWords.score; 
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
   } 
   else 
   { 
        const badWords = playedWords.words.filter(e => !allWords.some(f => f == e.toLowerCase())); 
        $('.infoZone').text('Au moins un mot joué est inconnu : ' + 
        badWords.join(' ')); 
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
        round: 0 
    }; 
    updateGame(); 
    $('.mainMenu').hide(); 
} 
 
function updateGame() 
{ 
    currentPlayer.rack = $('.tileItem').get().map(e => {return  
    $(e).find('label:first').text() == '' ? '*' :  
    $(e).find('label:first').text();}).join(''); 
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