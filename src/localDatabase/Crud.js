import { getDBConnection, createTables } from './db';

export const initDB = async () => {
  const db = await getDBConnection();
  await createTables(db);
  return db;
};

// --- FAVOURITES ---
export const addToFavourites = async (item) => {
  const db = await initDB();
  await db.executeSql(
    'INSERT OR REPLACE INTO favourites (id, name, price, image) VALUES (?, ?, ?, ?)',
    [item.id, item.name, item.price, item.image]
  );
};

export const removeFromFavourites = async (id) => {
  const db = await initDB();
  await db.executeSql('DELETE FROM favourites WHERE id = ?', [id]);
};

export const getFavourites = async () => {
  const db = await initDB();
  const results = await db.executeSql('SELECT * FROM favourites');
  return results[0].rows.raw(); // returns array
};

// --- CART ---
export const addToCart = async (item) => {
  const db = await initDB();

  // Check if item already in cart
  const checkResult = await db.executeSql('SELECT * FROM cart WHERE id = ?', [item.id]);
  const existing = checkResult[0].rows.length > 0;

  if (existing) {
    // Update quantity
    await db.executeSql('UPDATE cart SET quantity = quantity + 1 WHERE id = ?', [item.id]);
  } else {
    // Insert new item
    await db.executeSql(
      'INSERT INTO cart (id, name, price, image, quantity) VALUES (?, ?, ?, ?, ?)',
      [item.id, item.name, item.price, item.image, 1]
    );
  }
};

export const getCartItems = async () => {
  const db = await initDB();
  const results = await db.executeSql('SELECT * FROM cart');
  return results[0].rows.raw();
};

export const removeFromCart = async (id) => {
  const db = await initDB();
  await db.executeSql('DELETE FROM cart WHERE id = ?', [id]);
};

export const updateCartItemQuantity = async (id, quantity) => {
  const db = await initDB();
  await db.executeSql('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id]);
};
