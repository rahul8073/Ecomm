import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw,
} from 'react-native-responsive-dimensions';
import {
  getCartItems,
  removeFromCart,
  addToCart,
  updateCartItemQuantity,
} from '../localDatabase/Crud';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { imageMap } from '../components/imageMap';


export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation();

  const loadCart = async () => {
    const items = await getCartItems();
    setCartItems(items);
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, []),
  );

  const incrementQty = async item => {
    await addToCart(item);
    loadCart();
  };

  const decrementQty = async item => {
    if (item.quantity > 1) {
      await updateCartItemQuantity(item.id, item.quantity - 1);
    } else {
      await removeFromCart(item.id);
    }
    loadCart();
  };

  const confirmDelete = id => {
    Alert.alert('Remove Item', 'Remove this item from cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await removeFromCart(id);
          loadCart();
        },
      },
    ]);
  };

  const total = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Image source={imageMap[item.image]} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDesc}>{item.desc || ''}</Text>
      </View>
      <View style={styles.qtyControl}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => decrementQty(item)}
        >
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => incrementQty(item)}
        >
          <Text>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => confirmDelete(item.id)}
          style={{ marginLeft: rw(2) }}
        >
          <Icon name="trash-outline" size={20} color="#d00" />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
     <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        <Text style={styles.header}>Cart</Text>

        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="cart-outline" size={rw(25)} color="#aaa" />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtext}>
              Looks like you haven’t added anything yet.
            </Text>

            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => navigation.navigate('Browse')}
            >
              <Text style={styles.browseText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            style={{ marginBottom: rh(2) }}
          />
        )}

        {cartItems.length > 0 && (
          <View style={styles.summary}>
            <View style={styles.row}>
              <Text style={styles.label}>Shipping</Text>
              <Text style={styles.label}>$0.00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.total}>Total</Text>
              <Text style={styles.total}>${total}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: rw(4),
    backgroundColor: '#fff',
  },
  header: {
    fontSize: rf(2.5),
    fontWeight: 'bold',
    marginBottom: rh(1.5),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rh(2),
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
  itemPrice: {
    fontSize: rf(2),
    fontWeight: 'bold',
    color: '#d00',
  },
  itemName: {
    fontSize: rf(1.8),
    fontWeight: 'bold',
  },
  itemDesc: {
    fontSize: rf(1.4),
    color: '#777',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(2),
  },
  qtyBtn: {
    backgroundColor: '#eee',
    padding: rw(2),
    borderRadius: rw(2),
  },
  qtyText: {
    fontSize: rf(1.7),
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: rh(2),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rh(1),
  },
  label: {
    fontSize: rf(1.7),
    color: '#333',
  },
  total: {
    fontSize: rf(2),
    fontWeight: 'bold',
  },
  checkoutBtn: {
    backgroundColor: '#000',
    borderRadius: rw(2),
    paddingVertical: rh(1.5),
    alignItems: 'center',
    marginTop: rh(1.5),
  },
  checkoutText: {
    color: '#fff',
    fontSize: rf(2),
    fontWeight: 'bold',
  },
  // 👇 Empty Cart Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: rw(5),
    marginTop: -rh(5),
  },
  emptyTitle: {
    fontSize: rf(2.6),
    fontWeight: 'bold',
    color: '#444',
    marginTop: rh(2),
  },
  emptySubtext: {
    fontSize: rf(1.8),
    color: '#888',
    textAlign: 'center',
    marginVertical: rh(1),
  },
  browseBtn: {
    marginTop: rh(3),
    backgroundColor: '#000',
    paddingVertical: rh(1.2),
    paddingHorizontal: rw(10),
    borderRadius: rw(2),
  },
  browseText: {
    color: '#fff',
    fontSize: rf(1.9),
    fontWeight: 'bold',
  },
});
