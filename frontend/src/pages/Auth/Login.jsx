import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserByEmailRoute, googleAuth, loginRoute } from '../../APIRoutes/index.js';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import bgImage from '../../assets/bg.png';

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(loginRoute, userData, {
        withCredentials: true,
      });
      if (response.data.success) {
        localStorage.setItem('token', JSON.stringify(response.data.token));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/home');
        toast({
          title: 'Logged in',
          description: `${response.data.message}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);

      toast({
        title: 'Error',
        description: `${error}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    //Data fetching
    try {
      console.log(credentialResponse);
      const { credential } = credentialResponse;
      const googleToken = credential; // This is the Google OAuth token

      // Now use this token to fetch user details
      const peopleResponse = await axios.get(`${googleAuth}=${googleToken}`);

      const userData = peopleResponse.data;
      console.log('User Data from Google People API:', userData);

      const response = await axios.get(getUserByEmailRoute, {
        headers: {
          'email': userData.email
        }
      })

      if (response.data.success) {
        localStorage.setItem('token', JSON.stringify(userData.kid));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/home')
        toast({
          title: 'Logged in',
          description: `${response.data.message}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: `${error}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      {/* Left side with image and animated overlay */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex w-1/2 bg-indigo-100 relative overflow-hidden"
      >
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={bgImage}
            alt="Education"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-500/40"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-16 left-12 text-white z-10"
        >
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-xl max-w-md">Continue your educational journey with personalized learning experiences.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute top-10 left-10 text-white text-6xl font-bold z-10"
        >
          EduSync
        </motion.div>
      </motion.div>

      {/* Right side with login form */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 px-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-lg w-full max-w-md p-8"
        >
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold text-center text-indigo-600 mb-8"
            >
              Sign In
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-5 mb-6"
            >
              <FormControl>
                <FormLabel style={{ color: 'black', fontWeight: '500' }}>Email</FormLabel>
                <Input
                  style={{ borderColor: '#d1d5db', color: 'black' }}
                  type="email"
                  size="lg"
                  onChange={(event) => {
                    setUserData({
                      ...userData,
                      email: event.target.value,
                    });
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel style={{ color: 'black', fontWeight: '500' }}>Password</FormLabel>
                <Input
                  style={{ borderColor: '#d1d5db', color: 'black' }}
                  type="password"
                  size="lg"
                  onChange={(event) => {
                    setUserData({
                      ...userData,
                      password: event.target.value,
                    });
                  }}
                />
              </FormControl>
              <motion.div
                variants={itemVariants}
                className="self-end"
              >
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                  Forgot password?
                </Link>
              </motion.div>
            </motion.div>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center py-4"
              >
                <div className="border-t-4 border-indigo-500 border-solid rounded-full w-10 h-10 animate-spin"></div>
                <p className="ml-3 text-indigo-600 font-medium">Signing in...</p>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-4 mt-2"
              >
                <Button
                  size="lg"
                  className="w-full !bg-indigo-600 !text-white hover:!bg-indigo-700"
                  type="submit"
                >
                  SIGN IN
                </Button>

                <div className="flex items-center my-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="px-3 text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={credentialResponse => {
                      handleGoogleLogin(credentialResponse);
                    }}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />
                </div>
              </motion.div>
            )}

            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center mt-8"
            >
              <p className="text-gray-700">
                Don't have an account?{' '}
                <span className="text-indigo-600 font-medium hover:underline">
                  <Link to="/register">Sign up</Link>
                </span>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;