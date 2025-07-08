import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

// Get database connection
export const getDBConnection = async () => {
  try {
    const db = await SQLite.openDatabase({ name: 'app.db', location: 'default' });
    return db;
  } catch (error) {
    console.error('Failed to open DB:', error);
    throw Error('Could not open database');
  }
};

// Create required tables if they do not exist
export const createTables = async (db) => {
  try {
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS favourites (
        id TEXT PRIMARY KEY,
        name TEXT,
        price REAL,
        image TEXT
      );`
    );

    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS cart (
        id TEXT PRIMARY KEY,
        name TEXT,
        price REAL,
        image TEXT,
        quantity INTEGER
      );`
    );
  } catch (error) {
    console.error('Failed to create tables:', error);
    throw Error('Table creation failed');
  }
};
