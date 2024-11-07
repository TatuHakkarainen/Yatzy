import { useState } from "react";
import { Text, View, TextInput, Pressable, Keyboard  } from "react-native";
import Header from "./Header";
import Footer from "./Footer";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS,
    BONUS_POINTS_LIMIT } from '../constant/Game'
import styles from "../style/style";

export default Home = ({navigation}) => {

    const[playerName, setPlayerName] = useState('');
    const[hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    }

    return(
        <>
            <Header />
            <View>
                <MaterialCommunityIcons name="information" size={60} color={"black"} style={styles.icon} />
                {!hasPlayerName ? 
                    <>
                        <Text style={styles.subheading}>For scoreboard enter your name...</Text>
                        <TextInput 
                        onChangeText={setPlayerName} 
                        autoFocus={true}
                        style={styles.playername}/>
                        <Pressable
                            onPress={() => handlePlayerName(playerName)}>
                            <Text style={[styles.OkButton, styles.playButtonText]}>OK</Text>
                        </Pressable>
                    </>
                :
                <>

                <Text style={[styles.gamerules, styles.heading]}>
                    Rules of the game
                </Text>
                <Text style={styles.gamerules}>
                    THE GAME: Upper section of the classic Yahtzee dice game.
                    You have {NBR_OF_DICES} dices and for every dice you have
                    {NBR_OF_THROWS} throws.After each throw you can keep dices
                    in order to get same dice spot counts 
                    as many as possible. In the end of the turn you must select 
                    your points from {MIN_SPOT} to {MAX_SPOT}.
                </Text>

                <Text style={[styles.gamerules, styles.heading]}>
                    The Game
                </Text>
                <Text style={styles.gamerules}>
                    POINTS: After each turn, the game calculates the
                    sum for the dices you selected. 
                    Only the dices having the same spot count are calculated.
                    You cannot select the same points from {MIN_SPOT} to {MAX_SPOT} again.
                    Game ends when all points have been selected. 
                    The order for selecting those is free. 
                </Text>

                <Text style={styles.gamerules}>
                    GOAL: To get as many points as possible.
                    {BONUS_POINTS_LIMIT} points is the limit for getting a bonus,
                     which gives you {BONUS_POINTS} points more.
                </Text>

                <Text style={styles.heading}>Good luck, {playerName}</Text>
                <Pressable onPress={() => navigation.navigate('Gameboard', {player: playerName})}
                    style={styles.playButton} >
                    <Text style={styles.playButtonText}>Play</Text>
                </Pressable>
            </>
        }
    </View>
    <Footer />
</>
);
};