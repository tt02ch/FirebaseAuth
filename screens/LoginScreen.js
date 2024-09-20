import React, { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../configs/firebase';

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (values) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        setLoading(false);
        navigation.navigate('Home');
      })
      .catch((error) => {
        setLoading(false);
        let errorMessage = '';
        switch (error.code) {
          case 'auth/wrong-password':
            errorMessage = 'Sai mật khẩu.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Email này chưa được đăng ký.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email không hợp lệ.';
            break;
          default:
            errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
        }
        Alert.alert("Lỗi đăng nhập", errorMessage);
      });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={handleLogin}
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
            <Button onPress={handleSubmit} title="Đăng nhập" />
          )}

          <View style={styles.signupContainer}>
            <Text>Chưa có tài khoản? </Text>
            <Button title="Đăng ký" onPress={() => navigation.navigate('Signup')} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: 'blue',
    marginTop: 10,
  },
});

export default LoginScreen;
