import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNav from './src/navigations/StackNav';
import { getDBConnection } from './src/localDatabase/db';
import { StatusBar } from 'react-native';
import { createTables } from './src/localDatabase/Crud'; 

export default function App() {
  //initialize sqllite db
  useEffect(() => {
    const initDB = async () => {
      const db = await getDBConnection();
      await createTables(db); 
    };
    initDB();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <StackNav />
      </NavigationContainer>
    </>
  );
}
