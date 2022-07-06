import { useCallback, useEffect, useState } from "react";
import { Word } from "../random-word/random-word";
import styles from './random-word-quiz.module.css'
import classnames from "classnames";
import { getUniqueWords, getWords, QuizWordsTypes } from "./random-word-quiz.utils";

interface QuizQuestion {
    quizWord: Word;
    wrongWords: Word[];
    optionOrder: Word[];
    answer?: Word;
}

export const RandomWordQuiz = () => {
    const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion>();
    const [history, setHistory] = useState<QuizQuestion[]>([]);
    const [wordType, setWordType] = useState<QuizWordsTypes>("Own_Own")
    const nrWrongWords = 3;

    const shuffleArray = (array: Word[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const getNewQuizCallback = useCallback(() => {
        const filteredWords = getWords(wordType);
        const word = filteredWords[Math.floor(Math.random() * filteredWords.length)];
        const wrongWords: Word[] = getUniqueWords(nrWrongWords, filteredWords, [word]);
        const allAnswers: Word[] = [...wrongWords, word];
        shuffleArray(allAnswers)
        return {
            quizWord: word,
            wrongWords: wrongWords,
            optionOrder: allAnswers
        }
    }, [nrWrongWords, wordType])

    useEffect(() => {
        setCurrentQuiz(getNewQuizCallback())
    }, [history.length, getNewQuizCallback])

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

    return <div className={styles.wrapper}>
        <div className={styles.score}>
            <div>quiz</div>
            <div className={styles.userCorrectAnswer}>{score().correct}</div>
            <div className={styles.userWrongAnswer}>{score().wrong}</div>
            <select onChange={e => setWordType(e.target.value as QuizWordsTypes)}>
                <option value="Own_Own">100 eng swe (simple)</option>
                <option value="Own_SweEng">100 swe eng (simple)</option>
                <option value="Webster_Webster">Webster</option>
                <option value="5000_EngSwe">5000 eng swe</option>
                <option value="5000_SweEng">5000 swe eng</option>
            </select>
        </div>
        <div className={styles.question}>
            <div className={styles.word}>
                <div className={styles.question}>{currentQuiz?.quizWord.key}</div>
            </div>
            <div className={styles.options}>
                {currentQuiz?.optionOrder.map((word, index) => <div key={index} className={classnames(styles.answer, styles.wordDescription)} onClick={() => handleClick(word)}>{word.value}</div>)}
            </div>
        </div>

        <div className={styles.history}>
            <h2>History</h2>
            {history.map((currentQuiz, index) => {
                return (
                    <div key={index} className={styles.question}>
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
        </div>
    </div>
}