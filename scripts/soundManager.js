let soundVolume = 100;
let sndClick;
let sndShuffle;

function initSounds()
{
    sndClick = document.getElementById("sndClick");
    sndShuffle = document.getElementById("sndShuffle");
    setSoundsVolume(soundVolume);
}

function playClickSound()
{
    sndClick.currentTime = 0;
    sndClick.play();
}

function playShuffleSound()
{
    sndShuffle.currentTime = 0;
    sndShuffle.play();
}

function setSoundsVolume()
{
    sndClick.volume = parseFloat(soundVolume / 100);
    sndShuffle.volume = parseFloat(soundVolume / 100);
}
