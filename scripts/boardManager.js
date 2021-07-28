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
        } 
    return {status: true}; 
} 