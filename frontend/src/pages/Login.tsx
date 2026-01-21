import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Center, Flex, Heading, Text, VStack, Input, Stack, Link } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { useToastStore } from '../store/useToastStore';
import { useUserStore } from '../store/userStore';
import { signInWithGoogle, signInWithEmailAndPasswordAuth } from '../services/firebase';
import api from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPasswordAuth(email, password);
      // setUser logic is handled by onAuthStateChanged in App.tsx, but we can set it here for immediate feedback if needed.
      // However, App.tsx listener is robust.
      // We'll just wait a slight bit or rely on the listener, but for safety lets set it.
      if (userCredential.user) {
        setUser(userCredential.user);
        addToast('success', 'Login successful!');
        navigate('/students');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      addToast('error', 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        // Try to create user in backend (idempotent-ish check)
        try {
          await api.post('/users', {
            email: user.email!,
            name: user.displayName || user.email!.split('@')[0],
            role: 'user',
          });
        } catch (err: any) {
          // If 409 Conflict, it means user already exists, which is fine
          if (err.response?.status !== 409) {
            console.error('Failed to ensure backend user for Google sign-in:', err);
          }
        }

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
          gap={6}
          w="full"
          maxW="md"
        >
          <VStack gap={2} textAlign="center">
            <Heading size="xl" color="gray.800">
              Welcome Back
            </Heading>
            <Text color="gray.500">
              Sign in to access your dashboard
            </Text>
          </VStack>

          <form onSubmit={handleEmailLogin} style={{ width: '100%' }}>
            <Stack gap={4}>
              <Box>
                <Text mb={2} fontWeight="medium">Email</Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium">Password</Text>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </Box>

              <Button
                type="submit"
                size="lg"
                colorPalette="blue"
                width="full"
                loading={loading}
                mt={2}
              >
                Sign In
              </Button>
            </Stack>
          </form>

          <Flex align="center" width="full" gap={2}>
            <Box flex="1" h="1px" bg="gray.200" />
            <Text fontSize="sm" color="gray.500">OR</Text>
            <Box flex="1" h="1px" bg="gray.200" />
          </Flex>

          <Button
            size="lg"
            width="full"
            variant="surface"
            colorPalette="gray"
            onClick={handleGoogleLogin}
          >
            <Box mr={2}>
              <FcGoogle size={24} />
            </Box>
            Sign in with Google
          </Button>

          <Text fontSize="sm">
            Don't have an account?{' '}
            <Link asChild color="blue.600" fontWeight="medium">
              <RouterLink to="/signup">
                Sign up
              </RouterLink>
            </Link>
          </Text>
        </VStack>
      </Center>
    </Flex>
  );
};

export default Login;
