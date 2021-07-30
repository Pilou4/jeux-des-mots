function fillLetterBag() 
{ 
    letterBag = lettersDistribution.map(e => e.letter.repeat(e.number)).shuffle().join(''); 
}

function takeLettersFromBag(number) 
{ 
    let result = ""; 
    while (result.length < number && letterBag.length > 0) 
    { 
        const letterIndex = parseInt(Math.random() * letterBag.length); 
        let letters = letterBag.split(''); 
        result += letters[letterIndex]; 
        letters.splice(letterIndex, 1); 
        letterBag = letters.join(''); 
    }
    playShuffleSound();
    return result; 
}

function prepareTiles() 
{ 
    $('.tileItem').draggable(
        { 
            revert: 'invalid',
            grid: [(board.tileSize + board.offset), (board.tileSize + board.offset)], 
            start:  function (e, ui) 
            { 
                $(ui.helper).data('orPos', ui.offset); 
                const cellX = parseInt($(ui.helper).offset().left / (board.tileSize + board.offset)); 
                const cellY = parseInt($(ui.helper).offset().top / (board.tileSize + board.offset)) - 1; 
                if (cellY > -1 && cellY < 15) 
                { 
                    gameBoard[cellY][cellX] = ""; 
                } 
            }, 
            drag: function (e, ui)
            { 
                const cellX = parseInt($(ui.helper).offset().left / (board.tileSize + board.offset)); 
                const cellY = parseInt($(ui.helper).offset().top / (board.tileSize + board.offset)) - 1; 
                let letter = ""; 
                if (cellY > -1 && cellY < 15) 
                { 
                    letter = gameBoard[cellY][cellX]; 
                } 
                if (letter != "" || cellY < 0 || cellY > 14 || cellX < 0 || cellX > 14 || $(ui.helper).offset().left < 0) 
                { 
                    $(ui.helper).removeClass('legalDropZone').addClass('forbiddenDropZone'); 
                } 
                else 
                { 
                    $(ui.helper).removeClass('forbiddenDropZone').addClass('legalDropZone'); 
                } 
            }, 
            stop: function(e, ui)
            { 
                $(ui.helper).removeClass('forbiddenDropZone').removeClass('legalDropZone'); 
            }, 
        } 
    );
} 

function placeTile(e, ui) 
{ 
    $(ui.helper).addClass('waitingLetter'); 
    const cellX = parseInt($(ui.helper).offset().left / (board.tileSize + board.offset)); 
    const cellY = parseInt($(ui.helper).offset().top / (board.tileSize + board.offset)) - 1; 
    const letter = $(ui.helper).find('.tileLetter').text(); 
    if (gameBoard[cellY][cellX] != '') 
    {
        let oldPos = $(ui.helper).parent().hasClass('gameArea') ? $(ui.helper).data('orPos') : {left: 0, top: 0}; 
        $(ui.helper).animate(
            { 
                left: oldPos.left + 'px', 
                top: oldPos.top + 'px' 
            }, 
            250 
        ); 
        return false; 
    } 
    else 
    {
        if (letter == "") 
        { 
            askJokerValue($(ui.helper)); 
        }  
        gameBoard[cellY][cellX] = letter; 
        $(ui.helper).attr('data-coords', cellY + '-' + cellX).appendTo('.gameArea').css(
            { 
                position: 'absolute', 
                left: ((cellX * (board.tileSize + board.offset)) + board.xOffset) + 'px', 
                top: ((cellY * (board.tileSize + board.offset)) + board.yOffset) + 'px', 
            } 
        ); 
        $('#WCCancel').removeClass('disabled'); 
        playedWords = checkPositioning();
        checkButtons();
    } 
}

function checkButtons() 
{ 
    if (playedWords.status) 
    { 
        $('#WCValidate').removeClass('disabled'); 
    } 
    else 
    { 
        $('#WCValidate').addClass('disabled'); 
    } 
} 

function toolClick(e) 
{ 
    const cmd = $(e.currentTarget).attr('id'); 
    switch (cmd) 
    { 
       case 'WCValidate': 
           validate(); 
           break; 
       case 'WCCancel': 
           cancel(); 
           break;
        case 'WCShuffle': 
           shuffle(); 
           break;
        case 'WCChange': 
           changeTiles(); 
           break;
        case 'WCPause':
			pauseGame();
        case 'WCSkip':
			skipTurn();
			break;
        case 'startNewGame': 
            createGame(); 
            break;
        case 'WCResign':
			resignGame();
			break; 
       default:
           if (cmd && typeof(window[cmd]) == "function") 
           { 
                  window[cmd](e); 
           } 
           else 
           { 
                  console.log('Commande', cmd, 'non reconnue'); 
           } 
           break; 
    } 
}

function encodeBoard() 
{ 
    return $('.playedTileItem').get().map(e => String.fromCharCode((+$(e).attr('data-coords').split('-')[0]) + 65) + String.fromCharCode(+$(e).attr('data-coords').split('-')[1] + 65) + $(e).find('label:first').text() + String.fromCharCode(65 + +$(e).find('label:last').text())).join(''); 
}

function saveGames() 
{ 
    if (games.length > 0) 
    { 
        localStorage.setItem('boardGames', btoa(JSON.stringify(games))); 
    } 
    else 
    { 
        localStorage.removeItem('boardGames'); 
    } 
}

function loadGames() 
{ 
    const loadData = localStorage.getItem('boardGames'); 
    games = [];
    if (loadData) 
    { 
        games = JSON.parse(atob(loadData)); 
    } 
}

function updateTurn () 
{ 
    if (!lastTurn && letterBag == "" && currentPlayer.rack == "") 
    { 
        lastTurn = true; 
    } 
    if (currentGame.players.length > 1) 
    { 
        if (currentPlayer.id == currentGame.players.length || skippedTurns == 2 * currentGame.players.length) 
        { 
            endGame(); 
        } 
        else 
        { 
            currentPlayer = currentGame.players.find(e => e.pid == (currentPlayer.pid == currentGame.players.length ? 1 : currentPlayer.pid + 1)); 
            currentGame.turnId = currentPlayer.uid; 
            currentGame.skippedTurns = skippedTurns; 
            currentGame.lastTurn = lastTurn; 
            saveGames(); 
            if (currentGame.mode == "local") 
            { 
                $('.playerRack').empty(); 
                $('.playerRack').attr('class', 'playerRack').addClass('player_' + currentPlayer.pid); 
                placeTilesOnPlayerRack(currentPlayer.rack.split('')); 
                prepareTiles(); 
                showGames(); 
            } 
            else 
            { 
                showGameCode('newCode'); 
            } 
        } 
    } 
    else if (lastTurn || skippedTurns == 2) 
    { 
        endGame(); 
    } 
}

function showGameCode(mode) 
{ 
    let gameCode = btoa(JSON.stringify(currentGame)); 
    if (mode == 'newCode') 
    { 
           localStorage.setItem("lastCode_" + currentGame.gameId, gameCode); 
    } 
    gameCode = localStorage.getItem("lastCode_" + currentGame.gameId); 
    $('body').append('<div class="screenMask"></div><div class="nextTurnScreen"><label class="nextTurnTitle">Votre tour est terminé</label><div class="nextTurnBox"><p>Voici le code de la partie avec votre dernier coup : <span class="codeZone">' + gameCode + '</span><p>Vous devez le transmettre au joueur suivant : ' + players.find(e => e.uid == currentGame.turnId).name + '</div><div style="width: 100%; height: 60px; text-align: right; position: absolute; bottom: -30px; right: 10px;"><button style="margin-right: 6px;" id="restart">Retourner à l\'écran d\'accueil</button></div></div></div>'); 
    $('.nextTurnScreen #restart').on('click', e => window.location.href = window.location.href); 
} 

function adjustScores() 
{ 
    players.forEach(e => 
        { 
            if (e.rack != '') 
            { 
                let points = e.rack.split('').reduce((p, c) => p + lettersDistribution.find(g => g.letter == c).value, 0); 
                e.score -= points; 
                players.forEach(f => f.score += f.uid == e.uid ? 0 : points);
            } 
        } 
    ); 
}

function endGame() 
{ 
    currentGame.terminated = true; 
    adjustScores(); 
    let playerList = players.map(e => '<li><span class="endGamePlayerName">' + e.name + '</span> : ' + e.score + ' points</li>').join(''); 
    let winner = "Le gagnant de la partie est : " + players.sort((a, b) => + a.score < +b.score ? 1 : +a.score > +b.score ? -1 : 0)[0].name; 
    let ranking = '<ul class="endGamePlayerList">' + playerList + '</ul>'; 
    if (currentGame.players.find(e => e.uid == currentGame.turnId).pid == 1) 
    { 
        currentGame.ranking = ranking; 
        currentGame.turnId = currentGame.players[2].uid; 
    } 
    ranking = currentGame.ranking; 
    $('body').append('<div class="screenMask"></div><div class="endScreen' + (currentGame.mode == 'distant' && currentGame.players.find(e => e.uid == currentGame.mapping).pid == 1 ? ' extendedBox' : '') + '"><label class="endGameTitle">La partie est terminée !</label><div class="endGameBox"><label class="gameWinner">' + winner + '</label>' + ranking + (currentGame.mode == 'distant' && currentGame.players.find(e =>  e.uid == currentGame.mapping).pid == 1 ? '<div class="nextTurnBox"><p>Voici  le code final de la partie : <span class="codeZone">' + btoa(JSON.stringify(currentGame)) + '</span><p>Vous devez le transmettre aux autres joueurs.</div>' : '') + '<div style="width: 100%; height: 60px; text-align: right; position: absolute; bottom: -30px; right: 10px;"><button style="margin-right: 6px;" id="restart">Retourner à l\'écran d\'accueil</button></div></div></div>') 
    $('#restart').on('click',() =>
        {
            games.splice(games.indexOf(currentGame), 1); 
            saveGames(); 
            window.location.href = window.location.href; 
        } 
    ) 
} 