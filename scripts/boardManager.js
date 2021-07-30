function drawBoard() 
{ 
    let cells = ""; 
    for (let line = -1; line < 16; line++) 
    { 
        gameBoard[line] = []; 
        for (let column = -1; column < 16; column++) 
        { 
            let specialCell = specialCells.find(e => e.line == line && e.column == column); 
            gameBoard[line][column] = ''; 
            if (line > -1 && column > -1 && line < 15 && column < 15) 
            { 
                cells += '<div class="cell" data-coords="' + line + "-" + column + '">' + (specialCell ? '<div class="specialCell ' + specialCell.type + '">' + (line == 7 && column == 7 ? '<div class="star"></div>' : '<label class="specialCellText">' + specialCell.text + '</label>') + '</div>' : '') + '</div>'; 
            } 
        } 
    } 
    $('.gameArea').empty().append(cells); 
}

function prepareBoard() 
{ 
    $('.gameArea').droppable(
        {
            accept: function (ui) 
            {
                return ui.hasClass('tileItem');
            },
            drop: placeTile 
        },
    );
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

function showGameStats()
{
	$('.scoreZone')
		.empty();
	if (currentGame && currentGame.players)
	{
		currentGame.players.forEach	(
										(e, i) => $('.scoreZone').append('<fieldset class="scoreField"><label class="playerName">' + (i + 1) + ' - ' + e.name + '</label><label class="scoreValue">' + e.score + '</label></fieldset>')
									);
	}
}


function askJokerValue(tile) 
{ 
    $('body') 
           .append('<div class="screenMask"></div><div class="jokerScreen"><label class="jokerTitle">Choisissez la lettre à utiliser</label><div class="jokerBox"></div></div>'); 
    for (let t = 65; t < 91; t++) 
    { 
        $('.jokerBox').append('<div class="jokerLetter"><label>' + String.fromCharCode(t) + '</label></div>'); 
    } 
    $('.jokerBox').on('click','.jokerLetter',e =>
        { 
            const choosed = $(e.currentTarget).find('label').text(); 
            $(tile).find('.tileLetter').text(choosed).addClass('jokerTile'); 
            $('.screenMask,.jokerScreen').remove(); 
            const [line, column] = [...$(tile).attr('data-coords').split('-')]; 
            gameBoard[line][column] = choosed; 
            playedWords = checkPositioning(); 
            checkButtons(); 
        } 
    ) 
} 