import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf } from 'react-native-responsive-dimensions';

export default function Profile() {
  return (
     <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.email}>johndoe@example.com</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.option}>My Orders</Text>
        <Text style={styles.option}>Shipping Address</Text>
        <Text style={styles.option}>Payment Methods</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Text style={styles.option}>Notifications</Text>
        <Text style={styles.option}>Privacy & Security</Text>
        <Text style={styles.option}>Help Center</Text>
        <Text style={styles.option}>Logout</Text>
      </View>
    </View>

     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: rw(5),
    backgroundColor: '#fff',
  },
  avatar: {
    width: rw(30),
    height: rw(30),
    borderRadius: rw(15),
    alignSelf: 'center',
    marginTop: rh(3),
  },
  name: {
    fontSize: rf(2.5),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: rh(1),
  },
  email: {
    fontSize: rf(1.8),
    color: '#666',
    textAlign: 'center',
    marginBottom: rh(3),
  },
  section: {
    marginBottom: rh(3),
  },
  sectionTitle: {
    fontSize: rf(2),
    fontWeight: '600',
    marginBottom: rh(1),
  },
  option: {
    fontSize: rf(1.7),
    color: '#333',
    paddingVertical: rh(0.8),
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
});
