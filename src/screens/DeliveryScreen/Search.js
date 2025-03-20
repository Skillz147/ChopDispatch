import React, { useState, useCallback } from "react";
import { View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { debounce } from "lodash"; // Install lodash if not already
import styles from "../../styles/SearchStyles";
import colors from "../../styles/colors";

const Search = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const debouncedSearch = useCallback(
        debounce((text) => onSearch(text), 300), // 300ms delay
        []
    );

    const handleSearch = (text) => {
        setQuery(text);
        debouncedSearch(text);
    };

    return (
        <View style={styles.searchContainer}>
            <Icon name="magnify" size={24} color={colors.textLight} style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search for products..."
                placeholderTextColor={colors.textLight}
                value={query}
                onChangeText={handleSearch}
            />
        </View>
    );
};

export default Search;