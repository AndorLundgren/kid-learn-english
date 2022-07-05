import { Word } from "../random-word/random-word";

export const getRandomWords = (nrWords: number, words: Word[]) => {
    const randomWords: Word[] = [];
    for (let i = 0, nr = nrWords; i < nr; i++) {
        let word = words[Math.floor(Math.random() * words.length)];
        randomWords.push(word)
    }
    return randomWords;
}

export const getShortAnswer = (word: Word) => {
    const maxDescLength = 200;
    const isLong = word.value.length > maxDescLength;
    return isLong ? `${word.value.substring(0, maxDescLength)}...` : word.value;

}

export const getWords = (words: object, dictionary: object) => {
    const allWords = Object.entries(dictionary).map(([key, value]) => ({ key: key, value: value }) as Word)

    const filteredWords = allWords.filter(word => word.key in words)
    return filteredWords;
}