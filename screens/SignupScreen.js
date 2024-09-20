import React, { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../configs/firebase';

const SignupScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleSignup = (values) => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        setLoading(false);
        navigation.navigate('Login');
      })
      .catch((error) => {
        setLoading(false);
        let errorMessage = '';
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Email đã được sử dụng.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email không hợp lệ.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Mật khẩu quá yếu.';
            break;
          default:
            errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
        }
        Alert.alert("Lỗi đăng ký", errorMessage);
      });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={handleSignup}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.container}>
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            keyboardType="email-address"
            placeholder="Nhập email của bạn"
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <Text>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            secureTextEntry
            placeholder="Nhập mật khẩu của bạn"
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button onPress={handleSubmit} title="Đăng ký" />
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  error: {
    color: 'red',
  },
});

export default SignupScreen;
