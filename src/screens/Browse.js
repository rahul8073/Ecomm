import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw,
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';

const allCategories = [
  'Audio',
  'Headphones',
  'Drones + Electronics',
  'Photo + Video',
  'Gaming + VR',
  'Networking',
  'Notebooks + PCs',
  'PC components',
  'Peripherals',
  'Smartphones + Tablets',
  'Software solutions',
  'TV + Home cinema',
];

export default function BrowseScreen() {
  const [searchText, setSearchText] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(allCategories);
  const navigation = useNavigation();

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = allCategories.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryProducts', { title: category });
  };

  return (
     <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon
          name="search-outline"
          size={20}
          color="#888"
          style={{ marginRight: rw(2) }}
        />
        <TextInput
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={filteredCategories}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryRow}
            onPress={() => handleCategoryPress(item)}
          >
            <Text style={styles.categoryText}>{item}</Text>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No categories found.</Text>
        }
      />
    </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: rw(4),
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: rw(3),
    padding: rw(3),
    alignItems: 'center',
    marginBottom: rh(2),
  },
  searchInput: {
    fontSize: rf(1.8),
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: rh(2),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryText: {
    fontSize: rf(1.9),
  },
  emptyText: {
    textAlign: 'center',
    marginTop: rh(4),
    color: '#999',
    fontSize: rf(1.7),
  },
});
