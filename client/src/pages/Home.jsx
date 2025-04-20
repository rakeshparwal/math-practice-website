// Update to the Home.jsx component to show a start button instead of an error message

// import React, { useState } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MixedContentRenderer from '../components/math/MixedContentRenderer';
import ErrorBoundary from '../components/common/ErrorBoundary'; // Import the ErrorBoundary
import processExplanationText from '../utils/ExplanationProcessor';
import { quizService } from '../services/quizService';
import '../styles/Home.css';

const Home = () => {
    const { currentUser } = useAuth();
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentProblem, setCurrentProblem] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [quizProblems, setQuizProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    // update the fetchQuizQuestions function to process explanations
    // when they're first received from the API:
    // Improve the fetchQuizQuestions function with better error handling and debugging
    const fetchQuizQuestions = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("Fetching quiz questions...");
            // Fetch questions from the API
            const questions = await quizService.getQuizQuestions(3);
            console.log("Received questions:", questions);

            if (!questions || !Array.isArray(questions) || questions.length === 0) {
                throw new Error("No valid questions received from API");
            }

            // Transform the API data to include options with safe error handling
            const questionsWithOptions = questions.map((question, index) => {
                try {
                    console.log(`Processing question ${index}:`, question.text);

                    // Ensure the question has a valid answer
                    if (!question.answer) {
                        console.warn(`Question ${index} has no answer, using default`);
                        question.answer = "No answer provided";
                    }

                    const correctAnswer = question.answer;

                    // Create options with safe error handling for each variation
                    const options = [
                        { id: 'a', text: correctAnswer }
                    ];

                    // Safely generate variations
                    try {
                        options.push({ id: 'b', text: generateVariation(correctAnswer, 1) });
                    } catch (err) {
                        console.warn(`Failed to generate variation 1 for question ${index}:`, err);
                        options.push({ id: 'b', text: `${correctAnswer} (Option B)` });
                    }

                    try {
                        options.push({ id: 'c', text: generateVariation(correctAnswer, 2) });
                    } catch (err) {
                        console.warn(`Failed to generate variation 2 for question ${index}:`, err);
                        options.push({ id: 'c', text: `${correctAnswer} (Option C)` });
                    }

                    try {
                        options.push({ id: 'd', text: generateVariation(correctAnswer, 3) });
                    } catch (err) {
                        console.warn(`Failed to generate variation 3 for question ${index}:`, err);
                        options.push({ id: 'd', text: `${correctAnswer} (Option D)` });
                    }

                    // Shuffle options with error handling
                    let shuffledOptions;
                    try {
                        shuffledOptions = shuffleArray([...options]);
                    } catch (err) {
                        console.warn(`Failed to shuffle options for question ${index}:`, err);
                        shuffledOptions = options;
                    }

                    // Find which option now has the correct answer (with fallback)
                    let correctOptionId;
                    try {
                        const correctOption = shuffledOptions.find(opt => opt.text === correctAnswer);
                        correctOptionId = correctOption ? correctOption.id : 'a';
                    } catch (err) {
                        console.warn(`Failed to find correct option for question ${index}:`, err);
                        correctOptionId = 'a';
                    }

                    return {
                        ...question,
                        options: shuffledOptions,
                        correctOptionId
                    };
                } catch (err) {
                    console.error(`Failed to process question ${index}:`, err);
                    // Return a simplified version of the question that won't cause rendering issues
                    return {
                        ...question,
                        options: [
                            { id: 'a', text: "Option A" },
                            { id: 'b', text: "Option B" },
                            { id: 'c', text: "Option C" },
                            { id: 'd', text: "Option D" }
                        ],
                        correctOptionId: 'a'
                    };
                }
            });

            console.log("Processed questions with options:", questionsWithOptions);
            setQuizProblems(questionsWithOptions);
        } catch (err) {
            console.error('Error in quiz question processing:', err);
            setError('Failed to load quiz questions. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // Helper function to generate variations of the correct answer for wrong options

    // Improved variation generator for quiz options
    // Replace the existing generateVariation function in Home.jsx with this one

    // Improved variation generator with better handling of units with exponents
    // Replace the existing generateVariation function in Home.jsx with this one

    const generateVariation = (correctAnswer, seed) => {
        // Check for LaTeX squared or cubed units (like \text{ cm}^2)
        const texUnitExponentMatch = correctAnswer.match(/(\d+(\.\d+)?)\s*\\text\{\s*(.+?)\s*\}\^(\d+)/);
        if (texUnitExponentMatch) {
            const number = parseFloat(texUnitExponentMatch[1]);
            const unit = texUnitExponentMatch[3];
            const exponent = texUnitExponentMatch[4];

            // Generate variations that are more distinct
            let newValue;
            switch (seed) {
                case 1:
                    newValue = number + Math.max(5, Math.floor(number * 0.2)); // Add 20% or at least 5
                    break;
                case 2:
                    newValue = Math.max(1, number - Math.max(3, Math.floor(number * 0.15))); // Subtract 15% or at least 3
                    break;
                case 3:
                    newValue = number * 2; // Double the value
                    break;
                default:
                    newValue = number + seed * 2;
            }

            // Keep the exact same format with exponent
            return correctAnswer.replace(/\d+(\.\d+)?/, newValue);
        }

        // Check for units with standard exponent notation
        const standardExponentMatch = correctAnswer.match(/(\d+(\.\d+)?)\s*([a-zA-Z]+\^[\d+])/);
        if (standardExponentMatch) {
            const number = parseFloat(standardExponentMatch[1]);
            const unit = standardExponentMatch[3]; // This includes the exponent

            let newValue;
            switch (seed) {
                case 1:
                    newValue = number + Math.max(5, Math.floor(number * 0.2));
                    break;
                case 2:
                    newValue = Math.max(1, number - Math.max(3, Math.floor(number * 0.15)));
                    break;
                case 3:
                    newValue = number * 2;
                    break;
                default:
                    newValue = number + seed * 2;
            }

            return correctAnswer.replace(/\d+(\.\d+)?/, newValue);
        }

        // Helper function to extract number value from strings with units
        const extractNumberAndUnit = (text) => {
            // Match patterns like "195 minutes", "36 cm", "30 cm^2"
            const match = text.match(/(\d+(\.\d+)?)\s*(.+)/);
            if (match) {
                return {
                    number: parseFloat(match[1]),
                    unit: match[3]
                };
            }

            // If it's just a number
            if (!isNaN(text)) {
                return {
                    number: parseFloat(text),
                    unit: ''
                };
            }

            return null;
        };

        // Check if we have LaTeX text
        if (correctAnswer.includes('\\')) {
            // Handle LaTeX fractions like \frac{3}{4}
            if (correctAnswer.includes('\\frac')) {
                const fracMatch = correctAnswer.match(/\\frac\{(\d+)\}\{(\d+)\}/);
                if (fracMatch) {
                    const numerator = parseInt(fracMatch[1]);
                    const denominator = parseInt(fracMatch[2]);

                    // Generate variations based on seed
                    // For seed 1: Increase numerator
                    // For seed 2: Decrease numerator 
                    // For seed 3: Change denominator

                    let newNumerator, newDenominator;

                    switch (seed) {
                        case 1:
                            newNumerator = numerator + 1;
                            newDenominator = denominator;
                            break;
                        case 2:
                            newNumerator = Math.max(1, numerator - 1);
                            newDenominator = denominator;
                            break;
                        case 3:
                            newNumerator = numerator;
                            newDenominator = denominator + 2;
                            break;
                        default:
                            newNumerator = numerator + seed;
                            newDenominator = denominator;
                    }

                    return correctAnswer.replace(
                        /\\frac\{(\d+)\}\{(\d+)\}/,
                        `\\frac{${newNumerator}}{${newDenominator}}`
                    );
                }
            }

            // Handle plain LaTeX units like "36 \text{ cm}"
            const textUnitMatch = correctAnswer.match(/(\d+(\.\d+)?)\s*\\text\{\s*(.+)\s*\}/);
            if (textUnitMatch) {
                const number = parseFloat(textUnitMatch[1]);
                const unit = textUnitMatch[3];

                // Generate variations that are more distinct
                let newValue;
                switch (seed) {
                    case 1:
                        newValue = number + Math.max(5, Math.floor(number * 0.2)); // Add 20% or at least 5
                        break;
                    case 2:
                        newValue = Math.max(1, number - Math.max(3, Math.floor(number * 0.15))); // Subtract 15% or at least 3
                        break;
                    case 3:
                        newValue = number * 2; // Double the value
                        break;
                    default:
                        newValue = number + seed * 2;
                }

                return correctAnswer.replace(/\d+(\.\d+)?/, newValue);
            }

            // For other LaTeX expressions, modify based on the seed
            return correctAnswer + ` + ${seed}`;
        }

        // For equations like "x = 5"
        if (correctAnswer.includes('=')) {
            const parts = correctAnswer.split('=');
            const variable = parts[0].trim();
            const valueStr = parts[1].trim();

            // Extract the number part
            const numberMatch = valueStr.match(/(\d+(\.\d+)?)/);
            if (numberMatch) {
                const value = parseFloat(numberMatch[1]);

                // Generate more distinct variations
                let newValue;
                switch (seed) {
                    case 1:
                        newValue = value + Math.max(2, Math.floor(value * 0.3)); // Add 30% or at least 2
                        break;
                    case 2:
                        newValue = Math.max(1, value - Math.max(1, Math.floor(value * 0.25))); // Subtract 25% or at least 1
                        break;
                    case 3:
                        newValue = value * 2; // Double
                        break;
                    default:
                        newValue = value + seed * 2;
                }

                return `${variable} = ${newValue}`;
            }
        }

        // For text with numbers and units like "195 minutes"
        const extractedParts = extractNumberAndUnit(correctAnswer);
        if (extractedParts) {
            const { number, unit } = extractedParts;

            // Generate more distinct variations
            let newValue;
            switch (seed) {
                case 1:
                    newValue = number + Math.max(5, Math.floor(number * 0.25)); // Add 25% or at least 5
                    break;
                case 2:
                    newValue = Math.max(1, number - Math.max(3, Math.floor(number * 0.2))); // Subtract 20% or at least 3
                    break;
                case 3:
                    newValue = number * 2; // Double
                    break;
                default:
                    newValue = number + seed * 5;
            }

            return `${newValue} ${unit}`;
        }

        // For simple numerical answers
        if (!isNaN(correctAnswer)) {
            const value = parseFloat(correctAnswer);

            // Generate more distinct variations
            let newValue;
            switch (seed) {
                case 1:
                    newValue = value + Math.max(2, Math.floor(value * 0.3)); // Add 30% or at least 2
                    break;
                case 2:
                    newValue = Math.max(1, value - Math.max(1, Math.floor(value * 0.25))); // Subtract 25% or at least 1
                    break;
                case 3:
                    newValue = value * 2; // Double
                    break;
                default:
                    newValue = value + seed * 3;
            }

            return String(newValue);
        }

        // Default fallback - add some text
        return `${correctAnswer} (variant ${seed})`;
    };
    // Helper function to shuffle an array
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const startQuiz = async () => {
        await fetchQuizQuestions();
        setShowQuiz(true);
        setCurrentProblem(0);
        setAnswers([]);
        setQuizCompleted(false);
        setSelectedOption(null);
    };

    const handleOptionSelect = (optionId) => {
        setSelectedOption(optionId);
    };

    const submitAnswer = () => {
        if (selectedOption === null) return;

        const currentQuestion = quizProblems[currentProblem];
        const isCorrect = selectedOption === currentQuestion.correctOptionId;

        // Update answers
        const newAnswers = [...answers];
        newAnswers[currentProblem] = {
            selectedOptionId: selectedOption,
            isCorrect,
            selectedOptionText: currentQuestion.options.find(o => o.id === selectedOption).text
        };
        setAnswers(newAnswers);
        setSelectedOption(null);
    };

    const goToNextProblem = () => {
        if (currentProblem < quizProblems.length - 1) {
            setCurrentProblem(currentProblem + 1);
        } else {
            setQuizCompleted(true);
        }
    };

    const goToPreviousProblem = () => {
        if (currentProblem > 0) {
            setCurrentProblem(currentProblem - 1);
        }
    };

    const calculateScore = () => {
        const correctAnswers = answers.filter(a => a.isCorrect).length;
        return `${correctAnswers}/${quizProblems.length}`;
    };

    return (
        <div className="home-container">
            <section className="practice-section">
                <h2>Let's Practice Math</h2>

                {!showQuiz && !quizCompleted ? (
                    <div className="quiz-intro">
                        <p>Test your math skills with our interactive quiz. Each quiz contains 3 random math problems from various topics.</p>
                        <button
                            className="start-quiz-btn"
                            onClick={startQuiz}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Start Quiz'}
                        </button>
                        {error && <div className="error-message">{error}</div>}
                    </div>
                ) : !quizCompleted && quizProblems.length > 0 ? (
                    <ErrorBoundary message="There was a problem displaying the quiz.">
                        <div className="quiz-container">
                            <div className="quiz-progress">
                                Problem {currentProblem + 1} of {quizProblems.length}
                            </div>

                            <ErrorBoundary message="There was a problem displaying this question.">
                                <div className="problem-card">
                                    <div className="problem-text">
                                        <ErrorBoundary message="Could not render this math expression.">
                                            <MixedContentRenderer content={quizProblems[currentProblem].text} />
                                        </ErrorBoundary>
                                    </div>

                                    <div className="options-container">
                                        {!answers[currentProblem] ? (
                                            <>
                                                {quizProblems[currentProblem].options.map(option => (
                                                    <ErrorBoundary key={option.id} message={`Could not render option ${option.id.toUpperCase()}.`}>
                                                        <div
                                                            className={`option ${selectedOption === option.id ? 'selected' : ''}`}
                                                            onClick={() => handleOptionSelect(option.id)}
                                                        >
                                                            <span className="option-letter">{option.id.toUpperCase()}</span>
                                                            <MixedContentRenderer content={option.text} />
                                                        </div>
                                                    </ErrorBoundary>
                                                ))}

                                                <button
                                                    className="submit-answer-btn"
                                                    onClick={submitAnswer}
                                                    disabled={selectedOption === null}
                                                >
                                                    Submit Answer
                                                </button>
                                            </>
                                        ) : (
                                            <ErrorBoundary message="Could not display the answer results.">
                                                <div className={`result-message ${answers[currentProblem].isCorrect ? 'correct' : 'incorrect'}`}>
                                                    <div className="result-header">
                                                        {answers[currentProblem].isCorrect ? (
                                                            <><span className="result-icon">✓</span> Correct!</>
                                                        ) : (
                                                            <><span className="result-icon">✗</span> Incorrect!</>
                                                        )}
                                                    </div>

                                                    <div className="answer-details">
                                                        <ErrorBoundary message="Could not display your answer.">
                                                            <p>Your answer: <MixedContentRenderer content={answers[currentProblem].selectedOptionText} /></p>
                                                        </ErrorBoundary>

                                                        <ErrorBoundary message="Could not display the correct answer.">
                                                            <p>Correct answer: <MixedContentRenderer content={quizProblems[currentProblem].options.find(o => o.id === quizProblems[currentProblem].correctOptionId).text} /></p>
                                                        </ErrorBoundary>
                                                    </div>

                                                    <ErrorBoundary message="Could not display the explanation.">
                                                        <div className="explanation-box">
                                                            <div className="explanation-title">
                                                                <span className="bulb-icon">💡</span> Explanation
                                                            </div>
                                                            <div className="explanation-content">
                                                                <MixedContentRenderer content={quizProblems[currentProblem].solution} />
                                                            </div>
                                                        </div>
                                                    </ErrorBoundary>
                                                </div>
                                            </ErrorBoundary>
                                        )}
                                    </div>
                                </div>
                            </ErrorBoundary>

                            <div className="navigation-buttons">
                                <button
                                    className="nav-btn prev-btn"
                                    onClick={goToPreviousProblem}
                                    disabled={currentProblem === 0}
                                >
                                    Previous
                                </button>

                                {answers[currentProblem] && (
                                    <button
                                        className="nav-btn next-btn"
                                        onClick={goToNextProblem}
                                    >
                                        {currentProblem < quizProblems.length - 1 ? 'Next' : 'Finish Quiz'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </ErrorBoundary>
                ) : quizCompleted ? (
                    <ErrorBoundary message="Could not display quiz results.">
                        <div className="quiz-results">
                            <h3>Quiz Complete!</h3>
                            <p>Your score: {calculateScore()}</p>
                            <button className="amazon-button primary" onClick={startQuiz}>
                                Try Again
                            </button>
                            <Link to="/topics" className="amazon-button secondary">
                                Explore More Topics
                            </Link>
                        </div>
                    </ErrorBoundary>
                ) : (
                    <div className="error-message">
                        No quiz questions available. Please try again later.
                        <button className="amazon-button primary" onClick={startQuiz} style={{ marginTop: '1rem' }}>
                            Try Again
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;