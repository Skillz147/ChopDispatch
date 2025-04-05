import React, { useState, useCallback, useEffect } from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { debounce } from "lodash";
import styles from "../../styles/SearchStyles";
import colors from "../../styles/colors";

const Search = ({
  onSearch,
  placeholder = "Search for products...",
  debounceDelay = 300,
  autoFocus = false,
  onError,
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((text) => {
      setIsLoading(true);
      try {
        onSearch(text);
      } catch (error) {
        if (onError) onError(error.message);
      } finally {
        setIsLoading(false);
      }
    }, debounceDelay),
    [onSearch, debounceDelay, onError]
  );

  // Handle search input
  const handleSearch = (text) => {
    setQuery(text);
    debouncedSearch(text);
  };

  // Clear search input
  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <View
      style={[
        styles.searchContainer,
        isFocused && styles.searchContainerFocused,
      ]}
    >
      <Icon
        name="magnify"
        size={24}
        color={isLoading ? colors.primary : colors.textLight}
        style={styles.searchIcon}
      />
      {isLoading && <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />}
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        value={query}
        onChangeText={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus={autoFocus}
        accessibilityLabel="Search input"
        accessibilityHint="Enter text to search for products"
        returnKeyType="search"
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Icon name="close" size={20} color={colors.textLight} />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Memoize to prevent unnecessary re-renders
export default React.memo(Search);