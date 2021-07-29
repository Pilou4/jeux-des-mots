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
            stop: function( e, ui)
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
        case 'startNewGame': 
            createGame(); 
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
    $('.gameArea').append('<div class="playedTileItem" data-coords="' + line + '-' + column + '" style="position: absolute; left: ' + (board.xOffset + (column * (board.tileSize + board.offset))) + 'px; top: ' + (board.yOffset + ((line + 1) * (board.tileSize + board.offset))) + 'px;"><label class="tileLetter' + (value == 0 ? " jokerTile" : "") + '">' + (letter == '*' ? '' : letter) + '</label><label class="tilePoints">' + value + '</label></div>');
    if (loadData) 
    { 
        games = JSON.parse(atob(loadData)); 
    } 
} 