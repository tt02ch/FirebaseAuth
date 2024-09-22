import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../configs/firebase';
import Icon from 'react-native-vector-icons/FontAwesome'; // Thêm FontAwesome cho biểu tượng

const ForgotPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = (values) => {
    setLoading(true);
    sendPasswordResetEmail(auth, values.email)
      .then(() => {
        setLoading(false);
        Alert.alert('Thành công', 'Email khôi phục mật khẩu đã được gửi.');
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
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  });

  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={handlePasswordReset}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Quên mật khẩu</Text>
          <Text style={styles.subtitle}>Nhập email của bạn để đặt lại mật khẩu</Text>

          {/* Input email với biểu tượng */}
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              placeholder="Nhập email của bạn"
            />
          </View>
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          {loading ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : (
            <TouchableOpacity style={styles.resetButton} onPress={handleSubmit}>
              <Text style={styles.resetButtonText}>Đặt lại mật khẩu</Text>
            </TouchableOpacity>
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
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
