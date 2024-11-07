import { Text, View, FlatList, Button, Alert } from "react-native";
import { useState, useEffect } from 'react';
import { SCOREBOARD_KEY } from "../constant/Game";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../style/style";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Scoreboard({ navigation }) {

    const [score, setScore] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData();
        });
        return unsubscribe;
    }, [navigation]);

    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                const tmpScores = JSON.parse(jsonValue);

                const sortedScores = tmpScores.sort((a, b) => b.points - a.points);
                setScore(sortedScores);
            }
        } catch (error) {
            console.error("Error retrieving scoreboard data:", error);
        }
    };

    const clearScoreboard = async () => {
        Alert.alert(
            "Confirm Clear",
            "Are you sure you want to clear the scoreboard?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem(SCOREBOARD_KEY);
                            setScore([]);
                        } catch (error) {
                            console.error("Error clearing scoreboard:", error);
                        }
                    },
                },
            ]
        );
    };

    const renderScoreItem = ({ item }) => (
        <View style={styles.scoreItem}>
            <Text style={styles.scoreText}>{item.name} - {item.points} points</Text>
            <Text style={styles.dateText}>{item.date} {item.time}</Text>
        </View>
    );

    return (
        <>
            <Header />
            <View style={styles.container}>
                <FlatList
                    data={score}
                    renderItem={renderScoreItem}
                    keyExtractor={(item) => item.key.toString()}
                    ListEmptyComponent={
                        <Text style={styles.emptyMessage}>No scores available</Text>
                    }
                    contentContainerStyle={styles.listContent}
                />
                <Button title="Clear Scoreboard" onPress={clearScoreboard} color="#2A9D8F" />
            </View>
            <Footer />
        </>
    );
}
