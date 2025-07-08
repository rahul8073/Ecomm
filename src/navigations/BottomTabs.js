import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFavourites, getCartItems } from '../localDatabase/Crud';

// Screens
import HomeScreen from '../screens/HomeScreen';
import BrowseScreen from '../screens/Browse';
import FavouritesScreen from '../screens/Favorites';
import CartScreen from '../screens/Cart';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const [favouriteCount, setFavouriteCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // ✅ Refresh badge counts every 2 seconds
  useEffect(() => {
    const fetchCounts = async () => {
      const favs = await getFavourites();
      const cart = await getCartItems();
      setFavouriteCount(favs.length);
      setCartCount(cart.length);
    };

    const intervalId = setInterval(fetchCounts, 1000); // every 2 sec
    fetchCounts(); // run immediately on mount

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Browse':
              iconName = 'search-outline';
              break;
            case 'Favourites':
              iconName = 'heart-outline';
              break;
            case 'Cart':
              iconName = 'cart-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{
          tabBarBadge: favouriteCount > 0 ? favouriteCount : null,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: cartCount > 0 ? cartCount : null,
        }}
      />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
