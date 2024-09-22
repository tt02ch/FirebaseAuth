import React, { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../configs/firebase';
import Icon from 'react-native-vector-icons/FontAwesome'; // Sử dụng FontAwesome cho biểu tượng

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
        Alert.alert('Lỗi đăng ký', errorMessage);
      });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
  });

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={handleSignup}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Đăng Ký</Text>

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

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
              placeholder="Nhập mật khẩu của bạn"
            />
          </View>
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity style={styles.signupButton} onPress={handleSubmit}>
              <Text style={styles.signupButtonText}>Đăng Ký</Text>
            </TouchableOpacity>
          )}

          <View style={styles.loginRedirect}>
            <Text>Đã có tài khoản? </Text>
            <Button title="Đăng Nhập" onPress={() => navigation.navigate('Login')} />
          </View>
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
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    padding: 10,
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
  signupButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginRedirect: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default SignupScreen;
