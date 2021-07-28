let gameBoard = [];
let letterBag = "";
 
$(document).ready (init); 
 
function init() 
{ 
    Array.prototype.shuffle = function ()
    { 
        let a = this; 
        for (let i = a.length - 1; i > 0; i--) 
        { 
            const j = Math.floor(Math.random() * (i + 1)); 
            [a[i], a[j]] = [a[j], a[i]]; 
        } 
        return a; 
    }; 
    
    $('.toolbox').on('click', 'img:not(.disabled)', toolClick); 
    fillLetterBag();
    drawBoard(); 
    getPlayerLetters(8);
    prepareBoard();
    prepareTiles();
}

function getPlayerLetters(number) 
{ 
    const letters = takeLettersFromBag(number).split(''); 
    letters.forEach(
        e => { 
                $('.playerRack').append('<div class="tileItem"><label class="tileLetter">' + (e == '*' ? '' : e) + '</label><label class="tilePoints">' + lettersDistribution.find(f => f.letter == e).value + '</label></div>') 
            } 
    ); 
}

function toolClick(e) 
{ 
    const cmd = $(e.currentTarget).attr('id'); 
    switch (cmd)
    {
        case 'WCValidate':
            $('.waitingLetter').get().forEach(e => 
                {
                    const line = parseInt($(e).offset().top /  (board.tileSize + board.offset)) - 1; 
                    const column = parseInt($(e).offset().left / (board.tileSize + board.offset)); 
                    $(e).attr('data-coords', line + "-" + column); 
                    $('.cell[data-coords="' + line + "-" + column + '"]').attr('data-letterValue', $(e).find('label:first').text());
                } 
            );
            $('.waitingLetter').removeClass('tileItem').removeClass('waitingLetter').addClass('playedTileItem'); 
            $('#WCValidate, #WCCancel').addClass('disabled');
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


