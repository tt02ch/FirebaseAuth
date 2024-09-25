import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const UserForm = ({ onSubmit, selectedUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name || ''); // Thêm giá trị mặc định
      setEmail(selectedUser.email || ''); // Thêm giá trị mặc định
      setAge(selectedUser.age ? String(selectedUser.age) : ''); // Thêm giá trị mặc định
    } else {
      resetForm(); // Đặt lại form nếu không có selectedUser
    }
  }, [selectedUser]);

  const handleSubmit = () => {
    onSubmit({ name, email, age });
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setAge('');
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title={selectedUser ? 'Update User' : 'Add User'} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
  },
});

export default UserForm;
