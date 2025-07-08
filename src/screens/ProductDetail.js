import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw,
} from 'react-native-responsive-dimensions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { imageMap } from '../components/imageMap';
import {
  addToFavourites,
  removeFromFavourites,
  getFavourites,
  addToCart,
} from '../localDatabase/Crud';

export default function ProductDetail() {
  const navigation = useNavigation();
  const route = useRoute();
const { product, refreshBadges } = route.params;

  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const checkFavourite = async () => {
      const favs = await getFavourites();
      const exists = favs.find((item) => item.id === product.id);
      setIsFavourite(!!exists);
    };
    checkFavourite();
  }, []);

 const handleToggleFavourite = async () => {
  if (isFavourite) {
    await removeFromFavourites(product.id);
    ToastAndroid.show('Removed from Favourites', ToastAndroid.SHORT);
  } else {
    await addToFavourites(product);
    ToastAndroid.show('Added to Favourites', ToastAndroid.SHORT);
  }

  const favs = await getFavourites();
  const exists = favs.find((item) => item.id === product.id);
  setIsFavourite(!!exists);

  if (refreshBadges) refreshBadges(); // 🔁 refresh badge
};

const handleAddToCart = async () => {
  await addToCart({ ...product, quantity: 1 });
  ToastAndroid.show('Added to Cart', ToastAndroid.SHORT);
  if (refreshBadges) refreshBadges(); // 🔁 refresh badge
};

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity>
          <Icon name="search" size={24} />
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <Image
        source={imageMap[product.image]}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Icons */}
      <View style={styles.actionBtns}>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={handleToggleFavourite}
        >
          <Icon
            name={isFavourite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavourite ? 'red' : 'black'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconCircle}
          onPress={handleAddToCart}
        >
          <Icon name="cart-outline" size={22} />
        </TouchableOpacity>
      </View>

      {/* Details */}
      <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
      <Text style={styles.name}>{product.name}</Text>
      {product.model && (
        <Text style={styles.desc}>Model: WH-1000XM4, {product.model}</Text>
      )}
      <Text style={styles.longDesc}>
        {product.description ||
          'The technology with two noise sensors and two microphones on each ear cup detects ambient noise and sends the data to the HD noise minimization processor QN1...'}
      </Text>
    </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: rw(5),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: rh(1.5),
  },
  headerTitle: {
    fontSize: rf(2.2),
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: rh(25),
    borderRadius: rw(4),
  },
  actionBtns: {
    position: 'absolute',
    right: rw(6),
    top: rh(10),
    gap: rh(2),
  },
  iconCircle: {
    backgroundColor: '#fff',
    borderRadius: rw(6),
    padding: rw(2),
    elevation: 3,
    shadowColor: '#000',
  },
  price: {
    fontSize: rf(2.2),
    fontWeight: 'bold',
    marginTop: rh(2),
  },
  name: {
    fontSize: rf(2),
    fontWeight: 'bold',
  },
  desc: {
    fontSize: rf(1.6),
    color: '#666',
  },
  longDesc: {
    marginTop: rh(2),
    fontSize: rf(1.6),
    color: '#444',
  },
});
