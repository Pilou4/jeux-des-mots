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