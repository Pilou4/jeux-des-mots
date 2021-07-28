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
    fillLetterBag();
    getPlayerLetters(8);
    drawBoard(); 
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


