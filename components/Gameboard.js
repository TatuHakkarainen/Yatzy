import { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import Footer from './Footer';
import Header from './Header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Container, Row, Col } from 'react-native-flex-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../style/style';

import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS,
    BONUS_POINTS_LIMIT,
    SCOREBOARD_KEY,
} from '../constant/Game';

export default function GameArea() {
    const navigation = useNavigation();
    const route = useRoute();

    const [throwsRemaining, setThrowsRemaining] = useState(NBR_OF_THROWS);
    const [gameMessage, setGameMessage] = useState('Roll the dice to begin.');
    const [isGameOver, setIsGameOver] = useState(false);
    const [dicesSelected, setDicesSelected] = useState(new Array(NBR_OF_DICES).fill(false));
    const [diceValues, setDiceValues] = useState(new Array(NBR_OF_DICES).fill(0));
    const [pointsSelected, setPointsSelected] = useState(new Array(MAX_SPOT).fill(0));
    const [pointsTotals, setPointsTotals] = useState(new Array(MAX_SPOT).fill(0));
    const [playerName, setPlayerName] = useState('');
    const [scoreHistory, setScoreHistory] = useState([]);
    const [hasSelectedPoints, setHasSelectedPoints] = useState(false);
    const [roundCount, setRoundCount] = useState(0);
    const [bonusAwarded, setBonusAwarded] = useState(false);
    const [totalScore, setTotalScore] = useState(0);

    // Set player name from route parameters
    useEffect(() => {
        if (!playerName && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, []);

    // Load scores when screen is focused
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchScoreboardData();
        });
        return unsubscribe;
    }, [navigation]);

    const fetchScoreboardData = async () => {
        try {
            const savedScores = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (savedScores) {
                const parsedScores = JSON.parse(savedScores);
                setScoreHistory(parsedScores);
                console.log('Scores loaded successfully. Total scores:', parsedScores.length);
            }
        } catch (error) {
            console.error('Error loading scores:', error);
        }
    };

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const storePlayerScore = async () => {
        const newScore = {
            key: scoreHistory.length + 1,
            name: playerName,
            date: currentDate,
            time: currentTime,
            points: totalScore,
        };

        try {
            const updatedScores = [...scoreHistory, newScore];
            await AsyncStorage.setItem(SCOREBOARD_KEY, JSON.stringify(updatedScores));
            setScoreHistory(updatedScores); // Update state after storing the score
            console.log('Player score saved successfully.');
        } catch (error) {
            console.error('Error saving player score:', error);
        }
    };

    const diceRender = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        diceRender.push(
            <Col key={`dice_${i}`}>
                <Pressable onPress={() => toggleDiceSelection(i)}>
                    <MaterialCommunityIcons
                        name={`dice-${diceValues[i] || 1}`}  // Use "dice-1" as fallback if dice value is 0
                        size={50}
                        color={getDiceColor(i)}
                    />
                </Pressable>
            </Col>
        );
    }

    const pointsDisplay = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsDisplay.push(
            <Col key={`points_${spot}`}>
                <Text>{getPointsTotal(spot)}</Text>
            </Col>
        );
    }

    const selectablePointsDisplay = [];
    for (let buttonIndex = 0; buttonIndex < MAX_SPOT; buttonIndex++) {
        selectablePointsDisplay.push(
            <Col key={`selectable_${buttonIndex}`}>
                <Pressable onPress={() => selectPoints(buttonIndex)}>
                    <MaterialCommunityIcons
                        name={`numeric-${buttonIndex + 1}-circle`}
                        size={35}
                        color={getSelectablePointColor(buttonIndex)}
                    />
                </Pressable>
            </Col>
        );
    }

    const toggleDiceSelection = (index) => {
        if (throwsRemaining < NBR_OF_THROWS && !isGameOver) {
            const updatedSelections = [...dicesSelected];
            updatedSelections[index] = !dicesSelected[index];
            setDicesSelected(updatedSelections);
        } else {
            setGameMessage('You need to roll the dice first!');
        }
    };

    function getDiceColor(index) {
        return dicesSelected[index] ? 'black' : 'green';
    }

    function getSelectablePointColor(index) {
        return (pointsSelected[index] && !isGameOver) ? 'black' : 'green';
    }

    function getPointsTotal(index) {
        return pointsTotals[index];
    }

    const selectPoints = (index) => {
        if (throwsRemaining === 0 && !hasSelectedPoints) {
            const updatedPointsSelected = [...pointsSelected];
            const updatedPointsTotals = [...pointsTotals];

            if (!updatedPointsSelected[index]) {
                updatedPointsSelected[index] = true;
                const count = diceValues.filter(value => value === (index + 1)).length;
                updatedPointsTotals[index] = count * (index + 1);

                setPointsTotals(updatedPointsTotals);
                setPointsSelected(updatedPointsSelected);
                setHasSelectedPoints(true);

                calculateTotalPoints();

                evaluateGameEnd(updatedPointsSelected);
            } else {
                setGameMessage(`You have already selected points for ${index + 1}.`);
            }
        } else if (hasSelectedPoints) {
            setGameMessage("Points have already been selected for this round.");
        } else {
            setGameMessage(`You must roll the dice ${NBR_OF_THROWS} times before selecting points.`);
        }
    };

    const evaluateGameEnd = (selectedPoints) => {
        console.log("Checking for game completion.");
        if (selectedPoints.every(point => point) || roundCount >= 5) {
            setIsGameOver(true);
            setGameMessage("Game Over! You have completed all rounds.");
        }
    };

    const rollDices = () => {
        if (isGameOver) {
            setGameMessage("The game is over. Start a new game to continue.");
            return;
        }

        if (throwsRemaining > 0) {
            const updatedDiceValues = [...diceValues];
            for (let i = 0; i < NBR_OF_DICES; i++) {
                if (!dicesSelected[i]) {
                    const randomValue = Math.floor(Math.random() * 6) + 1;
                    updatedDiceValues[i] = randomValue;
                }
            }
            setThrowsRemaining(throwsRemaining - 1);
            setDiceValues(updatedDiceValues);
            setGameMessage('You can select your points now.');
            console.log("Dices have been rolled. New values:", updatedDiceValues);
        } else {
            setGameMessage("Please select your points first.");
        }
    };

    const calculateTotalPoints = () => {
        let total = pointsTotals.reduce((sum, points) => sum + points, 0);
        const previousBonusAwarded = bonusAwarded;

        // Check if the player qualifies for bonus points
        if (total >= BONUS_POINTS_LIMIT && !previousBonusAwarded) {
            total += BONUS_POINTS;
            setBonusAwarded(true);
            setGameMessage(`Congratulations! You have earned a bonus of ${BONUS_POINTS} points.`);
        } else if (total < BONUS_POINTS_LIMIT) {
            setBonusAwarded(false); // Reset bonus status if total falls below limit
        }

        setTotalScore(total);
    };

    useEffect(() => {
        calculateTotalPoints();
    }, [pointsTotals]);

    const pointsNeededForBonus = () => {
        const currentTotal = pointsTotals.slice(0, 6).reduce((acc, points) => acc + points, 0);
        const remainingPoints = BONUS_POINTS_LIMIT - currentTotal;
        return remainingPoints > 0 ? remainingPoints : 0;
    };

    const startNextRound = () => {
        if (roundCount >= 5) {
            console.log("Maximum rounds reached.");
            return;
        }
        console.log("Current round count: ", roundCount);
        setThrowsRemaining(NBR_OF_THROWS);
        setDicesSelected(Array(NBR_OF_DICES).fill(false));
        setPointsSelected(Array(MAX_SPOT).fill(false));
        setDiceValues(Array(NBR_OF_DICES).fill(0));
        setGameMessage("A new round has started. Roll the dice!");
        setHasSelectedPoints(false);
        setRoundCount(prevCount => prevCount + 1);
    };

    // Resets the entire game
    const resetGame = () => {
        setRoundCount(0);
        setThrowsRemaining(NBR_OF_THROWS);
        setDicesSelected(Array(NBR_OF_DICES).fill(false));
        setPointsSelected(Array(MAX_SPOT).fill(false));
        setDiceValues(Array(NBR_OF_DICES).fill(0));
        setGameMessage("Game has been reset. Roll the dice!");
        setIsGameOver(false);
        setPointsTotals(Array(MAX_SPOT).fill(0));
        setBonusAwarded(false);
        setTotalScore(0);
    };

    return (
        <>
            <Header />
            <View style={styles.gameboard}>
                <Container>
                    <Row>{diceRender}</Row>
                </Container>
                <Text style={styles.gameinfo}>Remaining Throws: {throwsRemaining}</Text>
                <Text style={styles.gameinfo}>{gameMessage}</Text>
                {throwsRemaining > 0 && (
                    <Pressable style={styles.button} onPress={rollDices}>
                        <Text style={styles.buttonText}>Roll Dices!</Text>
                    </Pressable>
                )}
                {!isGameOver && throwsRemaining === 0 && hasSelectedPoints && (
                    <Pressable onPress={startNextRound}>
                        <Text style={styles.button}>Start New Round</Text>
                    </Pressable>
                )}
                <Text style={styles.gameinfo}>Total Points: {totalScore}</Text>
                <Text style={styles.gameinfo}>You need {pointsNeededForBonus()} points for bonus</Text>
                <Container>
                    <Row>{pointsDisplay}</Row>
                </Container>
                <Container>
                    <Row>{selectablePointsDisplay}</Row>
                </Container>
                <Text style={styles.gameinfo}>Player: {playerName}</Text>
                <Pressable style={styles.button} onPress={storePlayerScore}>
                    <Text style={styles.buttonText}>Save Score</Text>
                </Pressable>
                {isGameOver && (
                    <Pressable onPress={resetGame} style={styles.button}>
                        <Text style={styles.buttonText}>Reset Game</Text>
                    </Pressable>
                )}
            </View>
            <Footer />
        </>
    );
}
