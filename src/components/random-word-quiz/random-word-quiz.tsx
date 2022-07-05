import { useEffect, useState } from "react";
import dictionaryEnglish from '../../../static/dictionary_eng.json';
import commonWords from "../../../static/common.json";
import { Word } from "../random-word/random-word";
import styles from './random-word-quiz.module.css'

interface QuizQuestion {
    quizWord: Word;
    wrongWords: Word[];
    optionOrder: Word[];
    answer?: Word;
}


export const RandomWordQuiz = () => {
    const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion>();
    const [history, setHistory] = useState<QuizQuestion[]>([]);
    const nrWrongWords = 3;

    const shuffleArray = (array: Word[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    useEffect(() => {
        setCurrentQuiz(getNewQuiz())
    }, [history.length])

    const getNewQuiz = (): QuizQuestion => {

        const words = Object.entries(dictionaryEnglish).map(([key, value]) => ({ key: key, value: value }) as Word)


        const filteredWords = words.filter(word => {
            const nrDots = (word.value.match(/\./g) || []).length;
            return nrDots <= 2 && commonWords.commonWords.indexOf(word.key) !== -1
        }
        )
        // const filteredWords = words.filter(word => {
        //     const nrDots = (word.value.match(/\./g) || []).length;
        //     return nrDots <= 1;// && nrDots > 0;
        // })
        const word = filteredWords[Math.floor(Math.random() * filteredWords.length)];

        const wrongWords: Word[] = getRandomWords(nrWrongWords, filteredWords);
        const allAnswers: Word[] = [...wrongWords, word];
        shuffleArray(allAnswers)
        return {
            quizWord: word,
            wrongWords: wrongWords,
            optionOrder: allAnswers
        }
    }

    const getRandomWords = (nrWords: number, words: Word[]) => {
        const randomWords: Word[] = [];
        for (let i = 0, nr = nrWords; i < nr; i++) {
            let word = words[Math.floor(Math.random() * words.length)];
            randomWords.push(word)
        }
        return randomWords;
    }

    const handleClick = (word: Word) => {
        setHistory([...history, { ...currentQuiz, answer: word } as QuizQuestion])
    }

    const score = () => {
        const correctAnswers = history.filter(quizQuestion => quizQuestion.answer?.key === quizQuestion.quizWord.key);
        const wrongAnswers = history.filter(quizQuestion => quizQuestion.answer?.key !== quizQuestion.quizWord.key);
        return {
            correct: correctAnswers.length,
            wrong: wrongAnswers.length
        }
    }

    return <>
        <h2>quiz</h2>
        <div className={styles.question}>
            <div className={styles.word}>
                <div className={styles.question}>{currentQuiz?.quizWord.key}</div>
            </div>
            <div className={styles.options}>
                {currentQuiz?.optionOrder.map((word, index) => <div key={index} className={styles.answer} onClick={() => handleClick(word)}>{word.value}</div>)}
            </div>
        </div>
        <h2>Score</h2>
        <div className={styles.score}>
            <div className={styles.userCorrectAnswer}>{score().correct}</div>
            <div className={styles.userWrongAnswer}>{score().wrong}</div>
        </div>
    </>
}