import React, { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { login, loginWithGitHub, loginWithGoogle } from '../configs/firebase'; // Thêm hàm loginWithGoogle
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = ({ navigation }) => {
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Handle login
  const handleLogin = async (values) => {
    try {
      await login(values.email, values.password);
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message);
      setModalVisible(true);
    }
  };

  // Handle GitHub login
  const handleLoginWithGitHub = async () => {
    try {
      await loginWithGitHub();
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message);
      setModalVisible(true);
    }
  };

  // Handle Google login
  const handleLoginWithGoogle = async () => {
    try {
      await loginWithGoogle(); // Thêm hàm này để đăng nhập bằng Google
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message);
      setModalVisible(true);
    }
  };

  // Form validation
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleLogin}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            {/* Input email */}
            <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color="#555" style={styles.icon} />
              <TextInput
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                placeholder="Email"
              />
            </View>
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            {/* Input mật khẩu */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#555" style={styles.icon} />
              <TextInput
                style={styles.input}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
                placeholder="Mật khẩu"
              />
            </View>
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            {/* Nút Đăng Nhập */}
            <Button onPress={handleSubmit} title="Đăng Nhập" color="#007BFF" />

            {/* Nút đăng nhập bằng GitHub và Google */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={[styles.socialButton, styles.githubButton]} onPress={handleLoginWithGitHub}>
                <Icon name="github" size={16} color="#fff" />
                <Text style={styles.socialButtonText}> GitHub</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={handleLoginWithGoogle}>
                <Icon name="google" size={16} color="#fff" />
                <Text style={styles.socialButtonText}> Google</Text>
              </TouchableOpacity>
            </View>

            {/* Liên kết để đăng ký */}
            <View style={styles.signupContainer}>
              <Text>Bạn chưa có tài khoản? </Text>
              <Button title="Đăng Ký" onPress={() => navigation.navigate('Signup')} />
            </View>

            {/* Nút Quên Mật Khẩu */}
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Quên Mật Khẩu?</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>

      {/* Modal thông báo lỗi */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="exclamation-circle" size={50} color="red" />
            <Text style={styles.modalText}>Đăng nhập thất bại!</Text>
            <Text style={styles.modalError}>{error}</Text>
            <Button title="Đóng" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
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
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  socialButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  githubButton: {
    backgroundColor: '#333', // Màu nền cho nút GitHub
  },
  googleButton: {
    backgroundColor: '#DB4437', // Màu nền cho nút Google
  },
  socialButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  forgotPassword: {
    marginTop: 10,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#007BFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalError: {
    marginVertical: 10,
    color: 'red',
    textAlign: 'center',
  },
});

export default LoginScreen;
