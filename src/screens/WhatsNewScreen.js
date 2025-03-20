import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/WhatsNewScreenStyles";
import colors from "../styles/colors";
import mockWhatsNew from "../config/mockWhatsNew.json";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WhatsNewScreen = () => {
    const [announcements, setAnnouncements] = useState(mockWhatsNew);
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const [likedPosts, setLikedPosts] = useState({});
    const [imageErrors, setImageErrors] = useState({}); // Track which images failed to load

    useEffect(() => {
        const loadLikedPosts = async () => {
            const savedLikes = await AsyncStorage.getItem("likedPosts");
            if (savedLikes) setLikedPosts(JSON.parse(savedLikes));
        };
        loadLikedPosts();
    }, []);

    const handleLike = (id) => {
        const isLiked = likedPosts[id];
        setAnnouncements((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, likes: isLiked ? item.likes - 1 : item.likes + 1 } : item
            )
        );
        setLikedPosts((prev) => {
            const newLikes = { ...prev, [id]: !isLiked };
            AsyncStorage.setItem("likedPosts", JSON.stringify(newLikes));
            return newLikes;
        });
    };

    const handleView = (item) => {
        setAnnouncements((prev) =>
            prev.map((i) =>
                i.id === item.id ? { ...i, views: i.views + 1 } : i
            )
        );
        navigation.navigate("NewsDetail", { newsItem: item });
    };

    const handleImageError = (id) => {
        setImageErrors((prev) => ({ ...prev, [id]: true }));
    };

    const renderAnnouncement = ({ item }) => {
        const isLiked = likedPosts[item.id] || false;
        const imageFailed = imageErrors[item.id];
        const imageSource = imageFailed
            ? { uri: "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ" }
            : { uri: item.image || "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ" };

        return (
            <TouchableOpacity
                style={styles.announcementCard}
                onPress={() => handleView(item)}
            >
                <Image
                    source={imageSource}
                    style={styles.image}
                    onError={() => handleImageError(item.id)}
                />
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.metaContainer}>
                        <Text style={styles.metaText}>By {item.author} • {new Date(item.date).toLocaleDateString()}</Text>
                        {item.modifiedBy && item.modifiedDate && (
                            <Text style={styles.metaText}>
                                Modified by {item.modifiedBy} on {new Date(item.modifiedDate).toLocaleDateString()}
                            </Text>
                        )}
                    </View>
                    <View style={styles.interactionContainer}>
                        <View style={styles.likeButton}>
                            <TouchableOpacity onPress={() => handleLike(item.id)}>
                                <Icon name={isLiked ? "heart" : "heart-outline"} size={20} color={isLiked ? colors.accent : colors.textDark} />
                            </TouchableOpacity>
                            <Text style={styles.interactionText}>{item.likes} likes</Text>
                        </View>
                        <View style={styles.likeButton}>
                            <Icon name="eye" size={20} color={colors.textDark} />
                            <Text style={styles.interactionText}>{item.views} views</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Icon name="star" size={28} color={colors.gold} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>What's New</Text>
            </View>
            <FlatList
                data={announcements}
                renderItem={renderAnnouncement}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default WhatsNewScreen;