import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../configs/firebase';
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome'; // Sử dụng FontAwesome cho các biểu tượng

const HomeScreen = ({ navigation }) => {
  const user = auth.currentUser; // Lấy thông tin người dùng hiện tại

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  return (
    <View style={styles.container}>
      <Icon name="home" size={50} color="#4CAF50" style={styles.homeIcon} />

      <Text style={styles.welcomeText}>Chào mừng, {user?.displayName || 'User'}!</Text>

      <Text style={styles.subtitle}>Bạn đang ở màn hình chính</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="sign-out" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  homeIcon: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#777',
    marginBottom: 30,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF5733',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default HomeScreen;
