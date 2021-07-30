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
	    skippedTurns = 0;
	    updateTurn();
	    showGameStats(); 
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
    $('.waitingLetter .jokerTile').text('').removeClass('.jokerTile'); 
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
    confirmCommand({message: "Etes-vous sûr(e) de vouloir échanger les tuiles situées sur votre chevalet ? Attention, il vous en coûtera 15 points.", yesFunction: confirmChange}); 
} 

function confirmChange() 
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
            $('.historyZone').html(('000' + ($('.historyZone').html().split('<br>').length)).substr(-3) + ' - Echange de lettres - -15 points<br>' + $('.historyZone').html());
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
    $('.playerRack').addClass('player_1');
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
    playShuffleSound();
} 
 
function updateGame() 
{ 
    currentPlayer.rack = $('.tileItem').get().map(e => {return $(e).find('label:first').text() == '' ? '*' : $(e).find('label:first').text();}).join(''); 
    currentGame.board = encodeBoard(); 
    currentGame.bag = letterBag; 
    currentGame.history = $('.historyZone').html(); 
    currentGame.players = players; 
    currentGame.turnId = currentPlayer.uid; 
    currentGame.skippedTurns = skippedTurns; 

}

function showGames() 
{ 
    if (games.length > 0) 
    { 
        $('.continueGame label:first').hide(); 
    } 
    else 
    { 
        $('.continueGame label:first').show(); 
    } 
    $('.continueGame ul:first').empty(); 
    games.forEach((e, i) =>
        {
            $('.continueGame ul:first').append('<li><div class="gameDiv"><label class="gameName">' +  e.name + '</label><label class="gamePlayerNames">' + e.players.length + ' ' + (e.players.length > 1 ? 'joueurs : ' : 'joueur : ') + e.players.map(f => f.name).join(' - ') + '</label><img class="vsButton" id="loadGame" data index="' + i + '" src="images/validate.png"><img class="vsButton" id="deleteGame" data-index="' + i + '" src="images/resign.png"></div></li>'); 
        }
    ) 
}

function startGameFromCode()
{
	$('body').append('<div class="screenMask"></div><div class="gameFromCodeScreen"><label class="fromCodeTitle">Créer une partie depuis un code</label><div class="fromCodeBox"><p>Entrez le code de la partie à créer :<textarea class="taFromCode"></textarea><label class="fromCodeInfos"></label></div><div style="width: 100%; height: 60px; text-align: right; position: absolute; bottom: -20px; right: 10px;"><button style="margin-right: 6px;" id="newGame">Créer la partie</button><button style="margin-right: 6px;" id="restart">Retourner à l\'écran d\'accueil</button></div></div></div>');
	$('.gameFromCodeScreen #restart').on('click', e => $('.screenMask, .gameFromCodeScreen').remove());
	$('.gameFromCodeScreen #newGame').on('click', () => checkCode("newGame"));
}

function checkCode(mode) 
{ 
    const logError = (msg) => $('.gameFromCodeScreen .fromCodeInfos').text(msg); 
    logError(""); 
    const code = $('.gameFromCodeScreen .taFromCode').val(); 
    if (code == "") 
    { 
        logError("Vous devez saisir un code..."); 
    } 
    else 
    { 
        let decodedGame; 
        try 
        { 
            decodedGame = atob(code); 
            decodedGame = JSON.parse(decodedGame); 
        } 
        catch (ex) 
        { 
            logError("Le code fourni ne correspond pas à une partie  valide..."); 
            return; 
        } 
        const testGame = games.find(e => e.gameId == decodedGame.gameId); 
        if (mode == "newGame" && testGame) 
        { 
            logError("Ce code correspond à une partie existante : " + testGame.name); 
            return; 
        } 
        if (mode == "continueGame" && !testGame) 
        { 
                logError("Ce code ne correspond pas à une partie existante : " + decodedGame.name); 
                return; 
        } 
        if (mode == "continueGame" && testGame.gameId != decodedGame.gameId) 
        { 
                logError("Ce code ne correspond pas à la partie chargée : " + decodedGame.name); 
                return; 
        } 
        if (mode == "newGame") 
        { 
            $('body').append('<div class="screenMask" style="z-index:25"></div><div class="choosePlayerScreen"><label class="choosePlayerTitle">Qui êtes-vous ?</label><div class="choosePlayerBox"><p>Merci de bien vouloir spécifier le joueur que vous incarnez :</div><div style="width: 100%; height: 60px; text-align: right; position: absolute; bottom: -20px; right: 10px;"><button style="display: block; position: absolute; bottom: 20px; left: 10px;" id="restart">Retourner à l\'écran d\'accueil</button></div></div></div>'); 
            for (let t = 0; t < decodedGame.players.length; t++) 
            { 
                $('<button data-id="' + decodedGame.players[t].uid +  '" style="margin-right: 6px;">Joueur ' + (t + 1) + ' : ' +  decodedGame.players[t].name + '</button>').insertBefore($('.choosePlayerScreen div:last #restart')) 
            } 
                $('.choosePlayerScreen #restart').on ('click', e => $('.screenMask,  .gameFromCodeScreen, .choosePlayerScreen').remove()); 
                $('.choosePlayerScreen button:not(#restart)').on ('click', e =>  confirmCreateFromCode($(e.currentTarget).attr('data-id'), decodedGame)); 
                  return; 
        } 
        const keepMapping = testGame ? testGame.mapping :  
        decodedGame.players[1].uid; 
        games.splice(games.indexOf(testGame), 1); 
        decodedGame.mapping = keepMapping; 
        games.push(decodedGame); 
        saveGames(); 
        if (decodedGame.turnId != decodedGame.mapping &&  !decodedGame.terminated) 
        { 
            logError("La partie a été mise à jour. Ce n'est pas encore  à votre tour de jouer..."); 
            $('.gameFromCodeScreen #continueGame').prop("disabled",  "disabled"); 
            return; 
        } 
        $('.screenMask, .gameFromCodeScreen').remove(); 
        loadGame({currentTarget: {'data-index': games.length - 1}}); 
    } 
}

function confirmCreateFromCode(playerId, decodedGame) 
{ 
    decodedGame.mapping = playerId; 
    games.push(decodedGame); 
    saveGames(); 
    loadGame({currentTarget: {'data-index': games.length - 1}}); 
    $('.screenMask,.gameFromCodeScreen,.choosePlayerScreen').remove(); 
} 

function loadGame(e) 
{ 
    currentGame = games[$(e.currentTarget).attr('data-index')]; 
    players = currentGame.players; 
    currentPlayer = players.find(f => f.uid == currentGame.turnId); 
    let user = players.find(f => f.uid == currentGame.mapping); 
    if (currentGame.mode == "distant" && user && user.uid != currentPlayer.uid && !currentGame.terminated) 
    { 
        const tmp = players.find(f => f.uid == currentGame.mapping); 
        const previousPlayer = players.find(e => e.pid == (tmp.pid == 1 ? players.length : tmp.pid - 1)); 
        $('body').append('<div class="screenMask"></div><div  class="gameFromCodeScreen"><label class="fromCodeTitle">En attente de tour de jeu</label><div class="fromCodeBox"><p>Entrez le code de partie que vous a transmis ' + previousPlayer.name + ' :<textarea class="taFromCode"></textarea><label class="fromCodeInfos"></label></div><div style="width:100%; height: 60px; text-align: right; position: absolute; bottom: -20px; right: 10px;"> <button style="margin-right: 6px;" id="recodeGame">Revoir le code de la  partie</button><button style="margin-right: 6px;" id="continueGame">Continuer la partie</button><button style="margin-right:6px;" id="restart">Retourner à l\'écran d\'accueil</button></div></div></div>'); 
        $('.gameFromCodeScreen #restart').on('click', e => window.location.href = window.location.href); 
        $('.gameFromCodeScreen #continueGame').on('click', e => {checkCode('continueGame');}); 
        $('.gameFromCodeScreen #recodeGame').on ('click', e => 
            { 
                $('.screenMask, .gameFromCodeScreen').remove(); 
                showGameCode('oldCode'); 
            } 
        ); 
        return; 
    } 
    playGame(); 
} 

function playGame() 
{ 
    boardGame = "";
    skippedTurns = currentGame.skippedTurns; 
    lastTurn = currentGame.lastTurn; 
    $('.playedTileItem').remove(); 
    if (currentGame.board != '') 
    { 
        currentGame.board.match(/.{4}/g).forEach(f =>
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
                $('.gameArea').append('<div class="playedTileItem" data-coords="' + line + '-' + column + '" style="position: absolute; left: ' + (34 + (column * 58)) + 'px; top: ' + (26 + ((line + 1) * 58)) + 'px;"><label class="tileLetter' + (value == 0 ? " jokerTile" : "") + '">' + (letter == '*' ? '' : letter) + '</label><label class="tilePoints">' + value + '</label></div>');
            }
        ); 
    } 
    letterBag = currentGame.bag; 
    $('.historyZone').html(currentGame.history); 
    $('.playerRack').empty(); 
    $('.playerRack').attr('class', 'playerRack').addClass('player_' + currentPlayer.pid); 
    placeTilesOnPlayerRack(currentPlayer.rack.split('')); 
    $('.mainMenu').hide(); 
    prepareTiles();
    showGameStats(); 
    if (currentGame.terminated || (currentGame.lastTurn && currentGame.players.find(e => e.uid == currentGame.turnId).pid == 1)) 
    { 
           endGame(); 
    } 
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
    window.location.href = window.location.href;
}

function pauseGame()
{
	window.location.href = window.location.href;
}

function skipTurn() 
{ 
    confirmCommand({message: "Etes-vous sûr(e) de vouloir passer votre tour ?", yesFunction: confirmSkip}); 
} 
 
function confirmSkip() 
{ 
    $('.historyZone').html(('000' + ($('.historyZone').html().split('<br>').length)).substr(-3) + ' - Passe son tour : 0 - ' + currentPlayer.name + '<br>' + $('.historyZone').html()); 
    skippedTurns++; 
    updateGame(); 
    saveGames();
    updateTurn(); 
}

function resignGame()
{
	confirmCommand({message: "Vous allez supprimer définitivement la partie en cours, sans aucun moyen de pouvoir la relance. Etes-vous certain(e) de vouloir effectuer cette action ?", yesFunction: confirmResign});
}

function confirmResign()
{
	games.splice(games.indexOf(currentGame), 1);
	saveGames();
	window.location.href = window.location.href;	
}
