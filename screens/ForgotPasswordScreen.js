import React, { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../configs/firebase';

const ForgotPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = (values) => {
    setLoading(true);
    sendPasswordResetEmail(auth, values.email)
      .then(() => {
        setLoading(false);
        Alert.alert('Success', 'An email has been sent to reset your password.');
        navigation.navigate('Login');
      })
      .catch((error) => {
        setLoading(false);
        let errorMessage = '';
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Email không hợp lệ.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Không tìm thấy người dùng với email này.';
            break;
          default:
            errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
        }
        Alert.alert('Lỗi', errorMessage);
      });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={handlePasswordReset}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.container}>
          <Text>Nhập email để đặt lại mật khẩu</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            keyboardType="email-address"
            placeholder="Nhập email của bạn"
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button onPress={handleSubmit} title="Đặt lại mật khẩu" />
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

export default ForgotPasswordScreen;
