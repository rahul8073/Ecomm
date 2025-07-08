import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf
} from 'react-native-responsive-dimensions';
import {
  getFavourites,
  removeFromFavourites,
  addToCart
} from '../localDatabase/Crud';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { imageMap } from '../components/imageMap';


export default function FavouritesScreen() {
  const [favourites, setFavourites] = useState([]);
    const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const loadFavourites = async () => {
        const favs = await getFavourites();
        setFavourites(favs);
      };
      loadFavourites();
    }, [])
  );

 const handleAddToCart = async (item) => {
  await addToCart(item);
  alert('Added to Cart');
 // Refresh badge count if method exists
  if (navigation?.refreshBadges) {
    navigation.refreshBadges();
  }
  
};

const handleDelete = async (id) => {
  await removeFromFavourites(id);
  const updated = await getFavourites();
  setFavourites(updated);

 // Refresh badge count if method exists
  if (navigation?.refreshBadges) {
    navigation.refreshBadges();
  }
};


  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Image
        source={imageMap[item.image]}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <View style={styles.actionIcons}>
        <TouchableOpacity onPress={() => handleAddToCart(item)}>
          <Icon name="cart-outline" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Icon name="trash-outline" size={22} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
  <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <Text style={styles.header}>Favourites</Text>
      <FlatList
        data={favourites}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: rh(5) }}>No favourites found.</Text>}
      />
    </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: rw(4),
    backgroundColor: '#fff'
  },
  header: {
    fontSize: rf(2.4),
    fontWeight: 'bold',
    marginBottom: rh(2)
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: rh(2),
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: rw(3),
    borderRadius: rw(3),
  },
  itemImage: {
    width: rw(18),
    height: rh(9),
    borderRadius: rw(2),
  },
  itemDetails: {
    flex: 1,
    marginLeft: rw(3),
  },
  price: {
    fontSize: rf(1.9),
    fontWeight: 'bold'
  },
  name: {
    fontSize: rf(1.7)
  },
  actionIcons: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: rh(8)
  }
});
