import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, TouchableOpacity, Linking, LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/WhatsNewScreenStyles";
import colors from "../styles/colors";
import { AuthContext } from "../context/AuthContext";

// Ignore specific warnings related to image loading (optional, for debugging)
LogBox.ignoreLogs(["Failed to load resource"]);

const NewsDetailScreen = ({ route }) => {
    const { newsItem } = route.params;
    const [likes, setLikes] = useState(newsItem.likes);
    const [isLiked, setIsLiked] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const loadLikedStatus = async () => {
            const savedLikes = await AsyncStorage.getItem("likedPosts");
            if (savedLikes) {
                const likedPosts = JSON.parse(savedLikes);
                setIsLiked(!!likedPosts[newsItem.id]);
            }
        };
        loadLikedStatus();
    }, [newsItem.id]);

    const handleLike = async () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikes(newIsLiked ? likes + 1 : likes - 1);
        const savedLikes = await AsyncStorage.getItem("likedPosts");
        const likedPosts = savedLikes ? JSON.parse(savedLikes) : {};
        const updatedLikes = { ...likedPosts, [newsItem.id]: newIsLiked };
        await AsyncStorage.setItem("likedPosts", JSON.stringify(updatedLikes));
    };

    const handleImageError = () => {
        setImageFailed(true);
    };

    const handleExternalLink = async () => {
        if (newsItem.externalLink) {
            const supported = await Linking.canOpenURL(newsItem.externalLink);
            if (supported) {
                await Linking.openURL(newsItem.externalLink);
            } else {
                console.error(`Cannot open URL: ${newsItem.externalLink}`);
            }
        }
    };

    const imageSource = imageFailed
        ? { uri: "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ" }
        : { uri: newsItem.image || "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ" };

    return (
        <View style={styles.detailContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color={colors.textDark} />
            </TouchableOpacity>
            <Image
                source={imageSource}
                style={styles.detailImage}
                onError={handleImageError}
            />
            <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>{newsItem.title}</Text>
                <Text style={styles.detailMeta}>
                    By {newsItem.author} • {new Date(newsItem.date).toLocaleDateString()}
                </Text>
                {newsItem.modifiedBy && newsItem.modifiedDate && (
                    <Text style={styles.detailMeta}>
                        Modified by {newsItem.modifiedBy} on {new Date(newsItem.modifiedDate).toLocaleDateString()}
                    </Text>
                )}
                <Text style={styles.detailMeta}>{newsItem.views} views</Text>
                <Text style={styles.detailContentText}>{newsItem.content}</Text>
                {newsItem.externalLink && (
                    <TouchableOpacity style={styles.linkButton} onPress={handleExternalLink}>
                        <Text style={styles.linkButtonText}>Learn More</Text>
                        <Icon name="open-in-new" size={20} color={colors.surface} style={styles.linkIcon} />
                    </TouchableOpacity>
                )}
                <View style={styles.detailInteraction}>
                    <View style={styles.likeButton}>
                        <TouchableOpacity onPress={handleLike}>
                            <Icon name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? colors.accent : colors.textDark} />
                        </TouchableOpacity>
                        <Text style={[styles.interactionText, { marginLeft: 10 }]}>{likes} likes</Text>
                    </View>
                    <View style={styles.likeButton}>
                        <Icon name="eye" size={24} color={colors.textDark} />
                        <Text style={[styles.interactionText, { marginLeft: 10 }]}>{newsItem.views} views</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default NewsDetailScreen;