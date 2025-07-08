import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getFavourites,
  addToFavourites,
  removeFromFavourites,
} from '../../localDatabase/Crud';
import { imageMap } from '../../components/imageMap';

const allProducts = [
  {
    id: '1',
    category: 'Headphones',
    name: 'SONY Premium Wireless Headphones',
    price: 349.99,
    image: 'headphone-white',
    desc: 'Model: WH-1000XM4, Black'
  },
  {
    id: '2',
    category: 'Headphones',
    name: 'APPLE AirPods Pro MagSafe Case',
    price: 179.0,
    image: 'white-bird',
    desc: 'MagSafe compatible noise-cancelling earbuds'
  },
  {
    id: '3',
    category: 'Headphones',
    name: 'SAMSUNG Galaxy Buds 2 Pro',
    price: 119.99,
    image: 'black-bird',
    desc: 'Hi-Fi sound, Active Noise Canceling'
  }
];

export default function CategoryProducts() {
  const navigation = useNavigation();
  const route = useRoute();
  const { title } = route.params;

  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const loadFavourites = async () => {
      const favs = await getFavourites();
      setFavourites(favs.map(item => item.id));
    };
    loadFavourites();
  }, []);

  const handleFavouriteToggle = async product => {
    const isFav = favourites.includes(product.id);
    if (isFav) {
      await removeFromFavourites(product.id);
    } else {
      await addToFavourites(product);
    }
    const updatedFavs = await getFavourites();
    setFavourites(updatedFavs.map(item => item.id));
  };

  const filteredProducts = allProducts.filter(
    item => item.category.toLowerCase() === title.toLowerCase()
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={imageMap[item.image]} style={styles.productImage} />
      <TouchableOpacity
        style={styles.favoriteBtn}
        onPress={() => handleFavouriteToggle(item)}
      >
        <Icon
          name={favourites.includes(item.id) ? 'heart' : 'heart-outline'}
          size={18}
          color={favourites.includes(item.id) ? 'red' : 'black'}
        />
      </TouchableOpacity>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <Text style={styles.productName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
     <SafeAreaView style={{flex:1}}>
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity>
          <Icon name="search" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity style={styles.filter}><Text>Category ▼</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filter}><Text>Brand ▼</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filter}><Text>Price ▼</Text></TouchableOpacity>
      </View>

      <View style={styles.sortRow}>
        <Text style={{ color: '#999' }}>{filteredProducts.length} products</Text>
        <TouchableOpacity><Text style={{ fontWeight: 'bold' }}>Sort by Relevance ▼</Text></TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        scrollEnabled={false}
      />
    </ScrollView>

     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: rw(4),
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: rh(2),
  },
  headerTitle: {
    fontSize: rf(2.2),
    fontWeight: 'bold',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rh(2),
  },
  filter: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: rw(4),
    paddingVertical: rh(1),
    borderRadius: rw(2),
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rh(2),
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    marginBottom: rh(3),
    borderRadius: rw(3),
    padding: rw(2),
    elevation: 2,
    shadowColor: '#ccc',
  },
  productImage: {
    width: '100%',
    height: rh(15),
    borderRadius: rw(2),
    marginBottom: rh(1),
  },
  favoriteBtn: {
    position: 'absolute',
    right: rw(2),
    top: rw(2),
    backgroundColor: '#fff',
    borderRadius: rw(4),
    padding: rw(1),
    elevation: 3,
  },
  productPrice: {
    fontWeight: 'bold',
    fontSize: rf(1.7),
  },
  productName: {
    fontSize: rf(1.6),
    color: '#555',
  },
});
