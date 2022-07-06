import { Word } from "../random-word/random-word";
import dictionaryEnglish from '../../../static/dictionary_eng.json';
import commonWords from "../../../static/common.json";
import kidWords from "../../../static/kid_words_eng.json"
import googleFrequency from "../../../static/googleFrequency.json"
import ownEngSwe from "../../../static/own_kid_dictionary_eng_swe.json"

export const getRandomWords = (nrWords: number, words: Word[]) => {
    const randomWords: Word[] = [];
    for (let i = 0, nr = nrWords; i < nr; i++) {
        let word = words[Math.floor(Math.random() * words.length)];
        randomWords.push(word)
    }
    return randomWords;
}

export const getUniqueWords = (nrWords: number, words: Word[], notAllowedWords: Word[]) => {
    const uniqueWords: Word[] = [];
    do {
        let word = words[Math.floor(Math.random() * words.length)];
        if (uniqueWords.filter(uniqueWord => uniqueWord.key === word.key).length === 0
            && notAllowedWords && notAllowedWords.filter(notAllowedWord => notAllowedWord.key === word.key).length <= 1
        ) {
            uniqueWords.push(word)
        }
    } while (uniqueWords.length < nrWords)
    return uniqueWords
}

export const getShortAnswer = (word: Word) => {
    const maxDescLength = 200;
    const isLong = word.value.length > maxDescLength;
    return isLong ? `${word.value.substring(0, maxDescLength)}...` : word.value;

}

//const words = Object.entries(dictionaryEnglish).map(([key, value]) => ({ key: key, value: value }) as Word)
//const filteredWords = words.filter(word => word.key in googleFrequency)

// descriptions with 1 dot and is a common word --> 9:ish words
//const filteredWords = words.filter(word => {
//    const nrDots = (word.value.match(/\./g) || []).length;
//    return nrDots <= 2 && commonWords.commonWords.indexOf(word.key) !== -1
//})

// description with 1 dot --> really strange words
// const filteredWords = words.filter(word => {
//     const nrDots = (word.value.match(/\./g) || []).length;
//     return nrDots <= 1;// && nrDots > 0;
// })

type QuizWordsTypes = "Own_Own" | "Kid_Webster" | "Webster_Webster" | "10000_Webster"

export const getWords = (wordTypes: QuizWordsTypes = "Kid_Webster") => {
    const words = {
        commonWords: commonWords,
        kidWords: kidWords,
        ownEngSwe: ownEngSwe,
        googleFrequency: googleFrequency,
        webster: dictionaryEnglish
    };
    const dictionaries = {
        ownEngSwe: ownEngSwe,
        webster: dictionaryEnglish
    };

    switch (wordTypes) {
        case "10000_Webster":
            return getWordFromDictonary(words.googleFrequency, dictionaries.webster);
        case "Own_Own":
            return getWordFromDictonary(words.ownEngSwe, dictionaries.ownEngSwe);
        case "Kid_Webster":
            return getWordFromDictonary(words.kidWords, dictionaries.webster);
        case "Webster_Webster":
            return getWordFromDictonary(words.webster, dictionaries.webster);
        default:
            return getWordFromDictonary(words.kidWords, dictionaries.webster);
    }
}

export const getWordFromDictonary = (words: object, dictionary: object) => {
    const allWords = Object.entries(dictionary).map(([key, value]) => ({ key: key, value: value }) as Word)
    const filteredWords = allWords.filter(word => word.key in words)
    return filteredWords;
}
