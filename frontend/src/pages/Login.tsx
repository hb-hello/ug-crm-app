import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { useToastStore } from '../store/useToastStore';
import { useUserStore } from '../store/userStore';
import { signInWithGoogle } from '../services/firebase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setUser(user);
        // Wait a bit to ensure auth.currentUser is set
        await new Promise((resolve) => setTimeout(resolve, 500));
        addToast('success', 'Login successful!');
        navigate('/students');
      }
    } catch (error) {
      addToast('error', 'Login failed. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <Flex direction="column" h="100vh" bg="gray.50">
      {/* Header */}
      <Flex
        as="header"
        w="full"
        h={20}
        bg="white"
        shadow="sm"
        align="center"
        justify="center"
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="#0071e3"
        >
          MyCRM
        </Text>
      </Flex>

      {/* Main Content */}
      <Center flex={1} p={4}>
        <VStack
          bg="white"
          p={8}
          shadow="lg"
          rounded="xl"
          gap={8}
          w="full"
          maxW="md"
          textAlign="center"
        >
          <VStack gap={2}>
            <Heading size="xl" color="gray.800">
              Welcome Back
            </Heading>
            <Text color="gray.500">
              Sign in to access your dashboard
            </Text>
          </VStack>

          <Button
            size="xl"
            width="full"
            variant="surface"
            colorPalette="blue"
            onClick={handleLogin}
          >
            <Box mr={2}>
              <FcGoogle size={24} />
            </Box>
            Sign in with Google
          </Button>
        </VStack>
      </Center>
    </Flex>
  );
};

export default Login;
