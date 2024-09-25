import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet, SafeAreaView, ScrollView, Modal, Button, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../configs/firebase';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [idleTimer, setIdleTimer] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users: ', error);
      Alert.alert('Error', 'Unable to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (user) => {
    try {
      if (selectedUser) {
        const userDoc = doc(db, 'users', selectedUser.id);
        await updateDoc(userDoc, user);
        Alert.alert('Success', 'User updated successfully');
      } else {
        const usersCollection = collection(db, 'users');
        await addDoc(usersCollection, user);
        Alert.alert('Success', 'User added successfully');
      }
      fetchUsers();
    } catch (error) {
      console.error('Error adding/updating user: ', error);
      Alert.alert('Error', 'Unable to add/update user');
    }
    setModalVisible(false); // Đóng modal sau khi submit
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      const userDoc = doc(db, 'users', id);
      await deleteDoc(userDoc);
      Alert.alert('Success', 'User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user: ', error);
      Alert.alert('Error', 'Unable to delete user');
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  useEffect(() => {
    fetchUsers();

    const timer = setTimeout(() => {
      Alert.alert('Timeout', 'Quá thời gian đăng nhập, bạn sẽ được đăng xuất.', [
        {
          text: 'OK',
          onPress: () => handleLogout(),
        },
      ]);
    }, 30000); // 30 giây

    setIdleTimer(timer);

    return () => clearTimeout(timer);
  }, []);

  const resetIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);

    setIdleTimer(setTimeout(() => {
      Alert.alert('Timeout', 'Quá thời gian đăng nhập, bạn sẽ được đăng xuất.', [
        {
          text: 'OK',
          onPress: () => handleLogout(),
        },
      ]);
    }, 30000)); // 30 giây
  };

  return (
    <TouchableWithoutFeedback onPress={resetIdleTimer}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Icon name="home" size={50} color="#4CAF50" style={styles.homeIcon} />
          <Text style={styles.welcomeText}>Chào mừng, {auth.currentUser?.displayName || 'User'}!</Text>
          <Text style={styles.subtitle}>Bạn đang ở màn hình chính</Text>
          
          <UserForm onSubmit={handleSubmit} selectedUser={selectedUser} />
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          <UserList
            users={users}
            onSelectUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <UserForm onSubmit={handleSubmit} selectedUser={selectedUser} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền tối mờ
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
