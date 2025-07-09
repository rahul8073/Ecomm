import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  addToFavourites,
  removeFromFavourites,
  getFavourites,
  addToCart,
} from '../localDatabase/Crud';
import { imageMap } from '../components/imageMap';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [favourites, setFavourites] = useState([]);
  const categories = ['All', 'Audio', 'Drones + Electronics', 'Photo + Video'];
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const loadFavourites = async () => {
        const favs = await getFavourites();
        setFavourites(favs.map(item => item.id));
      };
      loadFavourites();
    }, []),
  );

  const handleFavouriteToggle = async product => {
    const isFav = favourites.includes(product.id);

    if (isFav) {
      await removeFromFavourites(product.id);
    } else {
      await addToFavourites(product);
    }

    const updatedFavs = await getFavourites();
    setFavourites(updatedFavs.map(item => item.id));

    // Refresh bottom tab badges if available
    if (navigation?.refreshBadges) {
      navigation.refreshBadges();
    }
  };

  const handleNavigateToDetail = item => {
    navigation.navigate('ProductDetail', { product: item });
  };

  return (
   <SafeAreaView style={{flex:1}}>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello Michael</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Deals of the Day */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Deals of the day</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        <View style={styles.dealCard}>
          <TouchableOpacity
            style={styles.heartIcon}
            onPress={() =>
              handleFavouriteToggle({
                id: 'mic1',
                name: 'RØDE PodMic',
                price: 108.2,
                image: 'mic',
              })
            }
          >
            <Icon
              name={favourites.includes('mic1') ? 'heart' : 'heart-outline'}
              size={20}
              color={favourites.includes('mic1') ? '#d00' : '#000'}
            />
          </TouchableOpacity>
          <View style={{flexDirection:'row',justifyContent:'space-around'}}>
           <Image
              source={imageMap['mic']}
              style={styles.micImage}
              resizeMode="contain"
            />

          <TouchableOpacity
            onPress={() =>
              handleNavigateToDetail({
                id: 'mic1',
                name: 'RØDE PodMic',
                price: 108.2,
                image: 'mic',
              })
            }
          >
          <Text style={styles.category}>Microphones</Text>
          <View style={styles.priceRow}>
            <Text style={styles.discountPrice}>$108.20</Text>
            <Text style={styles.originalPrice}>$199.99</Text>
          </View>
          <Text style={styles.productName}>RØDE PodMic</Text>
          <Text style={styles.productDesc}>Dynamic microphone</Text>
           
          </TouchableOpacity>

          </View>

        </View>
      </View>

      {/* Recommended for You */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended for you</Text>
        <View style={styles.recommendRow}>
          {[
            { id: 'headphone-1', image: 'headphone-black', model: 'Black' },
            { id: 'headphone-2', image: 'headphone-white', model: 'Beige' },
          ].map((item, index) => (
            <View key={index} style={styles.headphoneCard}>
              <TouchableOpacity
                style={styles.heartIconSmall}
                onPress={() =>
                  handleFavouriteToggle({
                    id: item.id,
                    name: 'SONY Premium Wireless Headphones',
                    price: 349.99,
                    image: item.image,
                  })
                }
              >
                <Icon
                  name={
                    favourites.includes(item.id) ? 'heart' : 'heart-outline'
                  }
                  size={18}
                  color={favourites.includes(item.id) ? '#d00' : '#000'}
                />
              </TouchableOpacity>

              <Image
                source={imageMap[item.image]}
                style={styles.headphoneImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={() =>
                  handleNavigateToDetail({
                    id: item.id,
                    name: 'SONY Premium Wireless Headphones',
                    price: 349.99,
                    model: item.model,
                    image: item.image,
                  })
                }
              >
                <Text style={styles.price}>$349.99</Text>
                <Text style={styles.productName}>
                  SONY Premium Wireless Headphones
                </Text>
                <Text style={styles.model}>
                  Model: WH-1000XM4, {item.model}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: rw(4), backgroundColor: '#fff' },
  header: { marginTop: rh(3) },
  greeting: { fontSize: rf(3), fontWeight: 'bold',color:'#000' },
  tabButton: {
    paddingVertical: rh(1),
    paddingHorizontal: rw(4),
    marginRight: rw(2),
    borderRadius: rw(4),
    backgroundColor: '#f2f2f2',
  },
  activeTabButton: { backgroundColor: '#000' },
  tabText: { fontSize: rf(1.6), color: '#333' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  section: { marginTop: rh(2) },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rh(1),
  },
  sectionTitle: { fontSize: rf(2.2), fontWeight: 'bold' },
  seeAll: { fontSize: rf(1.6), color: '#888' },
  dealCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: rw(3),
    padding: rw(4),
    position: 'relative',
    marginBottom: rh(2),
  },
  micImage: {
    width: rw(30),
    height: rh(15),
    alignSelf: 'center',
  },
  category: { color: '#999', fontSize: rf(1.6), marginTop: rh(1) },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  discountPrice: {
    color: '#d00',
    fontWeight: 'bold',
    fontSize: rf(2.2),
    marginRight: rw(2),
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#aaa',
    fontSize: rf(1.6),
  },
  productName: { fontSize: rf(2), fontWeight: 'bold', marginTop: rh(1) },
  productDesc: { fontSize: rf(1.6), color: '#666' },
  recommendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headphoneCard: {
    width: rw(42),
    backgroundColor: '#f5f5f5',
    borderRadius: rw(3),
    padding: rw(3),
    position: 'relative',
  },
  headphoneImage: {
    width: '100%',
    height: rh(14),
    alignSelf: 'center',
  },
  price: {
    fontWeight: 'bold',
    fontSize: rf(2),
    marginTop: rh(1),
  },
  model: { fontSize: rf(1.5), color: '#777' },
  heartIcon: {
    position: 'absolute',
    top: rw(3),
    right: rw(3),
  },
  heartIconSmall: {
    position: 'absolute',
    top: rw(2),
    right: rw(2),
  },
});
