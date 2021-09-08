function queryStringToJSON(data) {
    let pairs = data.split('&');
    let result = {};
    pairs.forEach(function (pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    return JSON.parse(JSON.stringify(result));
}

function cleanUp(data) {
    return replaceAllOneCharAtATime(data, '+', ' ');
}

function replaceAllOneCharAtATime(inSource, inToReplace, inReplaceWith) {
    let output = "";
    let firstReplaceCompareCharacter = inToReplace.charAt(0);
    let sourceLength = inSource.length;
    let replaceLengthMinusOne = inToReplace.length - 1;
    for (let i = 0; i < sourceLength; i++) {
        let currentCharacter = inSource.charAt(i);
        let compareIndex = i;
        let replaceIndex = 0;
        let sourceCompareCharacter = currentCharacter;
        let replaceCompareCharacter = firstReplaceCompareCharacter;
        while (true) {
            if (sourceCompareCharacter !== replaceCompareCharacter) {
                output += currentCharacter;
                break;
            }
            if (replaceIndex >= replaceLengthMinusOne) {
                i += replaceLengthMinusOne;
                output += inReplaceWith;
                //was a match
                break;
            }
            compareIndex++;
            replaceIndex++;
            if (i >= sourceLength) {
                // not a match
                break;
            }
            sourceCompareCharacter = inSource.charAt(compareIndex)
            replaceCompareCharacter = inToReplace.charAt(replaceIndex);
        }
        replaceCompareCharacter += currentCharacter;
    }
    return output;
}

module.exports = {
    queryStringToJSON, cleanUp
}