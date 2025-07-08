import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import ProductDetail from '../screens/ProductDetail';
import CategoryProducts from '../screens/Categories/CategoryProduct';

const Stack = createNativeStackNavigator();

export default function StackNav() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const refreshBadges = () => {
    setRefreshKey(prev => prev + 1); // change key to force re-render BottomTabs
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="tabs"
        children={() => <BottomTabs key={refreshKey} />}
      />
      <Stack.Screen
        name="CategoryProducts"
        children={(props) => <CategoryProducts {...props} refreshBadges={refreshBadges} />}
      />
      <Stack.Screen
        name="ProductDetail"
        children={(props) => <ProductDetail {...props} refreshBadges={refreshBadges} />}
      />
    </Stack.Navigator>
  );
}
