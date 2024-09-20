import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../configs/firebase';
import { signOut } from 'firebase/auth';

const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Đăng xuất thành công, có thể chuyển về màn hình đăng nhập
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
