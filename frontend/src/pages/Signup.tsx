import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Text,
    VStack,
    Input,
    Stack,
    Link,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { useToastStore } from '../store/useToastStore';
import { useUserStore } from '../store/userStore';
import { signUpWithEmailAndPassword, signInWithGoogle } from '../services/firebase';
import api from '../services/api';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const addToast = useToastStore((state) => state.addToast);
    const setUser = useUserStore((state) => state.setUser);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !name) {
            addToast('error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await signUpWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Create user in backend
            await api.post('/users', {
                name,
                role: 'user',
            });

            if (user) {
                setUser(user); // Triggers fetch of CRM user data
                addToast('success', 'Account created successfully!');
                navigate('/students');
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            let message = 'Failed to create account.';
            if (error.code === 'auth/email-already-in-use') {
                message = 'Email is already in use.';
            } else if (error.code === 'auth/weak-password') {
                message = 'Password should be at least 6 characters.';
            }
            addToast('error', message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const user = await signInWithGoogle();
            if (user) {
                // Try to create user in backend (if strict, we'd check existence first, 
                // but our API handles existing users gracefully or we can ignore 409)
                try {
                    await api.post('/users', {
                        email: user.email!,
                        name: user.displayName || user.email!.split('@')[0],
                        role: 'user',
                    });
                } catch (err: any) {
                    // If 409 Conflict, it means user already exists, which is fine for Google IDP
                    if (err.response?.status !== 409) {
                        console.error('Failed to create backend user for Google sign-in:', err);
                        // Continue anyway as auth worked
                    }
                }

                setUser(user);
                addToast('success', 'Signed up successfully!');
                navigate('/students');
            }
        } catch (error) {
            addToast('error', 'Google sign-up failed.');
            console.error('Google sign-up error:', error);
        }
    };

    return (
        <Flex direction="column" h="100vh" bg="gray.50">
            {/* Header */}
            <Flex as="header" w="full" h={20} bg="white" shadow="sm" align="center" justify="center">
                <Text fontSize="2xl" fontWeight="bold" color="#0071e3">
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
                            Create Account
                        </Heading>
                        <Text color="gray.500">
                            Join to manage your students
                        </Text>
                    </VStack>

                    <form onSubmit={handleSignup} style={{ width: '100%' }}>
                        <Stack gap={4}>
                            <Box>
                                <Text mb={2} fontWeight="medium">Full Name</Text>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </Box>

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
                                Sign Up
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
                        onClick={handleGoogleSignup}
                    >
                        <Box mr={2}>
                            <FcGoogle size={24} />
                        </Box>
                        Sign up with Google
                    </Button>

                    <Text fontSize="sm">
                        Already have an account?{' '}
                        <Link asChild color="blue.600" fontWeight="medium">
                            <RouterLink to="/login">
                                Log in
                            </RouterLink>
                        </Link>
                    </Text>
                </VStack>
            </Center>
        </Flex>
    );
};

export default Signup;
