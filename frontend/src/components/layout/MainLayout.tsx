import { Box, Container, Flex, Separator, Text } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';

export function MainLayout() {
    return (
        <Flex direction="column" minH="100vh">
            <Navbar />

            <Box flex="1" bg="gray.50">
                <Container maxW="container.xl" py={8}>
                    <Outlet />
                </Container>
            </Box>

            <Box bg="white" py={6}>
                <Container maxW="container.xl">
                    <Separator mb={6} />
                    <Text textAlign="center" color="gray.500" fontSize="sm">
                        Copyright © <a href="https://www.hb-hello.github.io">hb-hello</a>, 2026
                    </Text>
                </Container>
            </Box>
        </Flex>
    );
}
