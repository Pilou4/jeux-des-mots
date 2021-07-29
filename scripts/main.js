let gameBoard = [];
let letterBag = "";
let players = []; 
let currentPlayer = {}; 
let games = []; 
let currentGame = {};
 
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
    
    $('.toolbox,.gameList').on('click', 'img:not(.disabled)', toolClick);     
    $('.chkPlayer').on ('change', gameOptionChange);
    $('button').on ('click',toolClick); 
    fillLetterBag();
    drawBoard(); 
    getPlayerLetters(8);
    prepareBoard();
    prepareTiles();
    loadGames(); 
    showGames();
}

function getPlayerLetters(number) 
{ 
    const letters = takeLettersFromBag(number).split(''); 
    placeTilesOnPlayerRack(letters); 
} 
 
function placeTilesOnPlayerRack(letters) 
{ 
    letters.forEach(e =>
        { 
            $('.playerRack').append('<div class="tileItem"><label class="tileLetter">' + (e == '*' ? '' : e) + '</label><label class="tilePoints">' + lettersDistribution.find(f => f.letter == e).value + '</label></div>') 
        } 
    ); 
}

function gameOptionChange(e) 
{ 
    let option = $(e.currentTarget); 
    let parent = option.parents('fieldset'); 
    if (option.prop("checked")) 
    { 
        parent.find('label').removeClass('playerDisabled'); 
        parent.find('input:last').prop('disabled', false).prop('placeholder', 'Joueur ' + parent.attr('data-id')); 
        if (parent.attr('data-id') < 4) 
        { 
            parent.parents('div').find('fieldset[data-id="' + (+parent.attr('data-id') + 1) + '"] input:first').prop('disabled', false); 
        } 
    } 
    else 
    { 
        for (let t = parent.attr('data-id'); t < 5; t++) 
        { 
            let fieldset = $('.gameOptions .gamePlayersInfo  fieldset[data-id="' + t + '"]'); 
            fieldset.find('label').addClass('playerDisabled'); 
            fieldset.find('input:first').prop('checked',  false).prop('disabled', true); 
            fieldset.find('input:last').prop('disabled',  true).prop('placeholder', 'Pas de joueur ' + t); 
        } 
        option.prop('disabled', false); 
    } 
}


