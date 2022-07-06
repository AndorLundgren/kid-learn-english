import { useEffect, useState } from "react";
import dictionaryEnglish from '../../../static/dictionary_eng.json';
import commonWords from "../../../static/common.json";
import kidWords from "../../../static/kid_words_eng.json"
import googleFrequency from "../../../static/googleFrequency.json"
import ownDictionary from "../../../static/own_kid_dictionary_eng_swe.json"
import { Word } from "../random-word/random-word";
import styles from './random-word-quiz.module.css'
import classnames from "classnames";
import { getRandomWords, getUniqueWords, getWords } from "./random-word-quiz.utils";

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

        const filteredWords = getWords("Own_Own");

        const word = filteredWords[Math.floor(Math.random() * filteredWords.length)];

        const wrongWords: Word[] = getUniqueWords(nrWrongWords, filteredWords, [word]);
        const allAnswers: Word[] = [...wrongWords, word];
        shuffleArray(allAnswers)
        return {
            quizWord: word,
            wrongWords: wrongWords,
            optionOrder: allAnswers
        }
    }

    const handleClick = (word: Word) => {
        setHistory([{ ...currentQuiz, answer: word } as QuizQuestion, ...history])
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
        <div className={styles.score}>
            <div>quiz</div>
            <div className={styles.userCorrectAnswer}>{score().correct}</div>
            <div className={styles.userWrongAnswer}>{score().wrong}</div>
        </div>
        <div className={styles.question}>
            <div className={styles.word}>
                <div className={styles.question}>{currentQuiz?.quizWord.key}</div>
            </div>
            <div className={styles.options}>
                {currentQuiz?.optionOrder.map((word, index) => <div key={index} className={classnames(styles.answer, styles.wordDescription)} onClick={() => handleClick(word)}>{word.value}</div>)}
            </div>
        </div>

        <h2>History</h2>
        {history.map(currentQuiz => {
            return (
                <div className={styles.question}>
                    <div className={styles.word}>
                        <div className={styles.question}>{currentQuiz?.quizWord.key}</div>
                    </div>
                    <div className={styles.options}>
                        {currentQuiz?.optionOrder.map(word => {
                            const classes = classnames(styles.answer, {
                                [styles.historyCorrectAnswer]: word.key === currentQuiz.quizWord.key,
                                [styles.historyWrongAnswer]: word.key === currentQuiz.answer?.key && word.key !== currentQuiz.quizWord.key
                            })
                            return <div key={word.key} className={classes}><div className={styles.wordDescription}>{word.value}</div><div>{word.key}</div></div>
                        })}
                    </div>
                </div>)
        })}

    </>
}