import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Grid, GridItem, Heading, Spinner, Center, Container } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { api } from '@/services/api';
import { Student, Task, Communication, Interaction, Note } from 'crm-shared';
import { ProfileSection } from '@/components/student-details/ProfileSection';
import { TasksSection } from '@/components/student-details/TasksSection';
import { CommunicationsTimeline } from '@/components/student-details/CommunicationsTimeline';
import { ActivityList } from '@/components/student-details/ActivityList';
import { NotesSection } from '@/components/student-details/NotesSection';

export default function StudentDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // 1. Fetch Student Details
    const { data: student, isLoading: loadingStudent, error } = useQuery({
        queryKey: ['student', id],
        queryFn: async () => {
            const res = await api.get<Student>(`/students/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    // 2. Fetch Related Data (only if student is loaded)
    const studentDocId = student?.id;

    const { data: tasks = [] } = useQuery({
        queryKey: ['tasks', studentDocId],
        queryFn: async () => {
            const res = await api.get<Task[]>(`/tasks?studentId=${studentDocId}`);
            return res.data;
        },
        enabled: !!studentDocId,
    });

    const { data: communications = [] } = useQuery({
        queryKey: ['communications', studentDocId],
        queryFn: async () => {
            const res = await api.get<Communication[]>(`/communications?studentId=${studentDocId}`);
            return res.data;
        },
        enabled: !!studentDocId,
    });

    const { data: interactions = [] } = useQuery({
        queryKey: ['interactions', studentDocId],
        queryFn: async () => {
            const res = await api.get<Interaction[]>(`/interactions?studentId=${studentDocId}`);
            return res.data;
        },
        enabled: !!studentDocId,
    });

    const { data: notes = [] } = useQuery({
        queryKey: ['notes', studentDocId],
        queryFn: async () => {
            const res = await api.get<Note[]>(`/notes?studentId=${studentDocId}`);
            return res.data;
        },
        enabled: !!studentDocId,
    });

    if (loadingStudent) {
        return (
            <Center h="50vh">
                <Spinner size="xl" color="blue.500" />
            </Center>
        );
    }

    if (error || !student) {
        return (
            <Center h="50vh" flexDirection="column" gap={4}>
                <Heading size="md" color="red.500">Student not found</Heading>
                <Button variant="outline" onClick={() => navigate('/students')}>
                    Back to Students
                </Button>
            </Center>
        );
    }

    return (
        <Container maxW="container.xl" py={6}>
            <Button
                variant="ghost"
                mb={6}
                onClick={() => navigate('/students')}
            >
                <FiArrowLeft /> Back to Students
            </Button>

            <Grid templateColumns="repeat(12, 1fr)" gap={8}>
                {/* Profile Section - Full Width */}
                <GridItem colSpan={12}>
                    <ProfileSection student={student} />
                </GridItem>

                {/* Tasks Section - Full Width usually, or 8 cols? Plan said "below profile" */}
                <GridItem colSpan={12}>
                    <TasksSection tasks={tasks} />
                </GridItem>

                {/* Split Section: Communications (Left) and Activity (Right) */}
                <GridItem colSpan={{ base: 12, lg: 8 }}>
                    <CommunicationsTimeline communications={communications} studentId={studentDocId} />
                </GridItem>

                <GridItem colSpan={{ base: 12, lg: 4 }}>
                    <ActivityList interactions={interactions} />
                </GridItem>

                {/* Notes Section - Full Width */}
                <GridItem colSpan={12}>
                    <NotesSection notes={notes} studentId={studentDocId} />
                </GridItem>
            </Grid>
        </Container>
    );
}
