import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Flex,
    Text,
    Button,
    HStack,
    Container,
} from '@chakra-ui/react';
import { useUserStore } from '@/store/userStore';

export function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const signOut = useUserStore((state) => state.signOut);

    const isActive = (path: string) => location.pathname.startsWith(path);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <Box bg="white" shadow="sm" position="sticky" top={0} zIndex="sticky">
            <Container maxW="container.xl">
                <Flex h={16} alignItems="center" justifyContent="space-between">
                    <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="#0071e3"
                        cursor="pointer"
                        onClick={() => navigate('/students')}
                    >
                        MyCRM
                    </Text>

                    <HStack gap={8}>
                        <HStack gap={4}>
                            <Button
                                variant="ghost"
                                color={isActive('/students') ? '#0071e3' : 'gray.600'}
                                fontWeight={isActive('/students') ? 'bold' : 'medium'}
                                onClick={() => navigate('/students')}
                            >
                                Students
                            </Button>
                            <Button
                                variant="ghost"
                                color={isActive('/tasks') ? '#0071e3' : 'gray.600'}
                                fontWeight={isActive('/tasks') ? 'bold' : 'medium'}
                                onClick={() => navigate('/tasks')}
                            >
                                Tasks
                            </Button>
                            <Button
                                variant="ghost"
                                color={isActive('/dashboard') ? '#0071e3' : 'gray.600'}
                                fontWeight={isActive('/dashboard') ? 'bold' : 'medium'}
                                onClick={() => navigate('/dashboard')}
                            >
                                Dashboard
                            </Button>
                        </HStack>

                        <Button variant="ghost" color="red.500" onClick={handleLogout} size="sm">
                            Logout
                        </Button>
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
}
