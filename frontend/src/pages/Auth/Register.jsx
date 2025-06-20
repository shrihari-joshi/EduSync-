import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signupRoute } from '../../APIRoutes/index.js';
import { motion } from 'framer-motion';
import bgImage from '../../assets/bg.png';

const Register = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: '',
    branch: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(signupRoute, userData, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        navigate('/login');
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `${error.response.data.message}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

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
          {/* Use imported image to avoid path issues */}
          <img
            src={bgImage}
            alt="Education"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/40"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-16 left-12 text-white z-10"
        >
          <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl max-w-md">Create an account and start your educational journey with personalized learning experiences.</p>
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

      {/* Right side with registration form */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 px-6 py-8 overflow-y-auto"
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
              Create Account
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-5 mb-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <FormControl isRequired>
                  <FormLabel style={{ color: 'black', fontWeight: '500' }}>Full Name</FormLabel>
                  <Input
                    style={{ borderColor: '#d1d5db', color: 'black' }}
                    type="text"
                    onChange={(event) => {
                      setUserData({
                        ...userData,
                        name: event.target.value,
                      });
                    }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel style={{ color: 'black', fontWeight: '500' }}>Username</FormLabel>
                  <Input
                    style={{ borderColor: '#d1d5db', color: 'black' }}
                    type="text"
                    onChange={(event) => {
                      setUserData({
                        ...userData,
                        username: event.target.value,
                      });
                    }}
                  />
                </FormControl>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <FormControl isRequired>
                  <FormLabel style={{ color: 'black', fontWeight: '500' }}>Email</FormLabel>
                  <Input
                    style={{ borderColor: '#d1d5db', color: 'black' }}
                    type="email"
                    onChange={(event) => {
                      setUserData({
                        ...userData,
                        email: event.target.value,
                      });
                    }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel style={{ color: 'black', fontWeight: '500' }}>Password</FormLabel>
                  <Input
                    style={{ borderColor: '#d1d5db', color: 'black' }}
                    type="password"
                    onChange={(event) => {
                      setUserData({
                        ...userData,
                        password: event.target.value,
                      });
                    }}
                  />
                </FormControl>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <FormControl as="fieldset" isRequired>
                  <FormLabel as="legend" style={{ color: 'black', fontWeight: '500' }}>Branch</FormLabel>
                  <Select
                    style={{ borderColor: '#d1d5db', color: 'black' }}
                    placeholder="Select Branch"
                    onChange={(event) => {
                      setUserData({
                        ...userData,
                        branch: event.target.value,
                      });
                    }}
                  >
                    <option>Computer Engineering</option>
                    <option>Data Science</option>
                    <option>Machine Learning</option>
                    <option>EXTC</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel as="legend" style={{ color: 'black', fontWeight: '500' }}>Role</FormLabel>
                  <Select
                    style={{ borderColor: '#d1d5db', color: 'black' }}
                    placeholder="Select Role"
                    onChange={(event) => {
                      setUserData({
                        ...userData,
                        role: event.target.value,
                      });
                    }}
                  >
                    <option>Student</option>
                    <option>Teacher</option>
                  </Select>
                </FormControl>
              </div>
            </motion.div>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center py-4"
              >
                <div className="border-t-4 border-indigo-500 border-solid rounded-full w-10 h-10 animate-spin"></div>
                <p className="ml-3 text-indigo-600 font-medium">Creating account...</p>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="mt-4"
              >
                <Button
                  size="lg"
                  width="full"
                  className="!bg-indigo-600 !text-white hover:!bg-indigo-700"
                  type="submit"
                >
                  SIGN UP
                </Button>
              </motion.div>
            )}

            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center mt-8"
            >
              <p className="text-gray-700">
                Already have an account?{' '}
                <span className="text-indigo-600 font-medium hover:underline">
                  <Link to="/login">Sign in</Link>
                </span>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;