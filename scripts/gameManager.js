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
            drag:  function (e, ui)
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
            stop:  function( e, ui)
            { 
                $(ui.helper).removeClass('forbiddenDropZone').removeClass('legalDropZone'); 
            }, 
        } 
    );
} 