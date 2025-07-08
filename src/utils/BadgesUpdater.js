// utils/fetchBadgeCounts.js
import { getFavourites, getCartItems } from '../localDatabase/Crud';

export const fetchBadgeCounts = async () => {
  try {
    const favs = await getFavourites();
    const cart = await getCartItems();
    return {
      favouriteCount: favs.length,
      cartCount: cart.length,
    };
  } catch (e) {
    console.error('Badge count error:', e);
    return {
      favouriteCount: 0,
      cartCount: 0,
    };
  }
};
