import { useEffect, useState } from 'react';
import common from '../../../static/common.json';
import dictionaryEnglish from '../../../static/dictionary_eng.json';

export interface Word {
    key: string;
    value: string;
}

const RandomWord = () => {
    const [randomWord, setRandomWord] = useState<Word>()

    useEffect(() => {
        const words = Object.entries(dictionaryEnglish).map(([key, value]) => ({ key: key, value: value }) as Word)
        var word = words[Math.floor(Math.random() * words.length)];
        setRandomWord(word);
    }, [])

    const formatDescription = (word: Word) => {
        return { key: word.key, value: word.value.replace(/[0-9]*\./g, "$1") }
    }

    return <div>{randomWord?.key}<div>{randomWord?.value}</div></div>
}
export default RandomWord