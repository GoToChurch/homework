function capitalize(str) {
    /*
    Преобразование строки к нижнему регистру, но первая буква большая. “Abscd”
     */

    return `${str.slice(0, 1).toUpperCase()}${str.slice(1).toLowerCase()}`;
}

function makeCorrectSpaces(str) {
    /*
    Преобразование строки с целью правильно расстановки пробелов.
    “Вот пример строки,в которой     используются знаки препинания.После знаков должны стоять пробелы , а перед знаками их быть не должно .    Если есть лишние подряд идущие пробелы, они должны быть устранены.” =>
    “Вот пример строки,в которой используются знаки препинания. После знаков должны стоять пробелы, а перед знаками их быть не должно. Если есть лишние подряд идущие пробелы, они должны быть устранены.”
     */

    let punctuationMarks = [",", ".", ";", ":", "!", "?"];
    let resultString = "";

    for (let i = 0; i < str.length; i++) {
        let currentChar = str.charAt(i);
        let nextChar = str.charAt(i+1);

        if (currentChar === " " && nextChar === " ") {
            continue;
        }
        if (currentChar === " " && punctuationMarks.includes(nextChar)) {
            continue;
        }
        if (punctuationMarks.includes(currentChar) && nextChar !== " ") {
            currentChar += " ";
        }

        resultString += currentChar;
    }

    return resultString;
}

function countWordsInString(str) {
    /*
    Посдчитывание кол-во слов в строке.
     */

    return makeCorrectSpaces(str).split(" ").length;
}

function countUniqueWordsInString(str) {
    /*
    Посдчитывание уникальных слов в строке.
     */

    let punctuationMarks = [",", ".", ";", ":", "!", "?"];
    let stringWithoutPunctuation = makeCorrectSpaces(str.toLowerCase());
    let wordsCountMap = new Map();

    for (let char of punctuationMarks) {
        stringWithoutPunctuation = stringWithoutPunctuation.replaceAll(char, "");
    }

    for (let word of stringWithoutPunctuation.split(" ")) {
        let keysArray = Array.from(wordsCountMap.keys());

        if (!keysArray.includes(word)) {
            wordsCountMap.set(word, 1);
        } else {
            wordsCountMap.set(word, wordsCountMap.get(word) + 1);
        }
    }

    return wordsCountMap;
}

console.log(countUniqueWordsInString("Текст, в котором слово , текст несколько раз встречается и слово тоже"))

