var gameBoard = [];
let letterBag = "";
// let players = 	[
// 					{
// 						uid: guid(),
// 						pid: 1,
// 						name: 'Joueur 1',
// 						score: 0
// 					}
// 				];
let players = [];
let currentPlayer = {};
let games = [];
let currentGame = 	{};
let skippedTurns = 0;
let lastTurn = false;

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
	$('.toolbox,.gameList').on ('mouseenter', 'img:not(.disabled)', playClickSound).on('click', 'img:not(.disabled)', toolClick);
	$('button').on('click', toolClick);
	$('.chkPlayer').on ('change', gameOptionChange);
	initSounds();
	fillLetterBag();
	drawBoard();
	getPlayerLetters(8);
	prepareBoard();
	prepareTiles();
	loadGames();
	showGames();
	showGameStats();
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
			let fieldset = $('.gameOptions .gamePlayersInfo fieldset[data-id="' + t + '"]');
			fieldset.find('label').addClass('playerDisabled');
			fieldset.find('input:first').prop('checked', false).prop('disabled', true);
			fieldset.find('input:last').prop('disabled', true).prop('placeholder', 'Pas de joueur ' + t);
		}
		option.prop('disabled', false);
	}
	$('.gameOptions #modeChoice').prop('disabled', !$('.gameOptions .gamePlayersInfo fieldset[data-id="2"]').find('input:first').prop('checked'));
}
