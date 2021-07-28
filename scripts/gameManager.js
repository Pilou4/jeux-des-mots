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