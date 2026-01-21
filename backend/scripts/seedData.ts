import { db } from '../src/services/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import { faker } from '@faker-js/faker';
import { Student, Communication, Interaction, Note, Task } from '../src/types/firestore.types';

// Helper to batch operations
class BatchHandler {
    private batch: FirebaseFirestore.WriteBatch;
    private count = 0;
    private readonly LIMIT = 400; // Leaving buffer below 500

    constructor(private db: FirebaseFirestore.Firestore) {
        this.batch = db.batch();
    }

    async set(ref: FirebaseFirestore.DocumentReference, data: any) {
        this.batch.set(ref, data);
        this.count++;
        if (this.count >= this.LIMIT) {
            await this.commit();
        }
    }

    async delete(ref: FirebaseFirestore.DocumentReference) {
        this.batch.delete(ref);
        this.count++;
        if (this.count >= this.LIMIT) {
            await this.commit();
        }
    }

    async commit() {
        if (this.count > 0) {
            await this.batch.commit();
            this.batch = this.db.batch();
            this.count = 0;
        }
    }
}

async function clearCollections(batchHandler: BatchHandler) {
    const collections = ['students', 'communications', 'interactions', 'notes', 'tasks'];
    console.log('🧹 Clearing collections...');

    for (const collectionName of collections) {
        const snapshot = await db.collection(collectionName).get();
        if (!snapshot.empty) {
            console.log(`\tDeleting ${snapshot.size} docs from ${collectionName}`);
            for (const doc of snapshot.docs) {
                await batchHandler.delete(doc.ref);
            }
        }
    }
    await batchHandler.commit(); // Ensure all deletions are committed
}

function generateRandomStudent(): Omit<Student, 'id'> {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const createdAt = Timestamp.fromDate(faker.date.past({ years: 1 }));
    const applying = faker.helpers.arrayElements(['Harvard', 'Stanford', 'MIT', 'Yale', 'Princeton'], { min: 0, max: 3 });


    return {
        studentId: `S-${faker.number.int({ min: 100000, max: 999999 })}`,
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }),
        phone: faker.phone.number(),
        grade: faker.helpers.arrayElement(['9', '10', '11', '12']),
        country: faker.location.country(),
        applicationStatus: faker.helpers.arrayElement(['Prospect', 'Applying', 'Submitted', 'Admitted', 'Enrolled', 'Rejected']),
        lastActive: Timestamp.fromDate(faker.date.recent()),
        createdAt: createdAt,
        tags: faker.helpers.arrayElements(['Interested', 'Athlete', 'Scholarship', 'International'], { min: 0, max: 3 }),
        applyingColleges: applying,
        submittedColleges: faker.helpers.arrayElements(['Harvard', 'Stanford', 'MIT', 'Yale', 'Princeton'], { min: 0, max: applying.length }),
        countCommunications: 0, // Will update after generation
        countPendingTasks: 0, // Will update after generation
    };
}

// Generators for related data
function generateInteractions(studentDocId: string, count: number): Omit<Interaction, 'id'>[] {
    return Array.from({ length: count }, () => ({
        studentId: studentDocId,
        type: faker.helpers.arrayElement(['login', 'AI question', 'document upload', 'document download']),
        description: faker.system.fileName(),
        timestamp: Timestamp.fromDate(faker.date.recent()),
        metadata: {
            device: faker.helpers.arrayElement(['mobile', 'desktop', 'tablet']),
            page: faker.helpers.arrayElement(['home', 'profile', 'applications']),
        },
    }));
}

function generateCommunications(studentDocId: string, count: number): Omit<Communication, 'id'>[] {
    return Array.from({ length: count }, () => ({
        studentId: studentDocId,
        channel: faker.helpers.arrayElement(['email', 'call', 'sms']),
        summary: faker.lorem.sentence(),
        timestamp: Timestamp.fromDate(faker.date.recent()),
        loggedBy: 'admin', // Placeholder
    }));
}

function generateNotes(studentDocId: string, count: number): Omit<Note, 'id'>[] {
    return Array.from({ length: count }, () => ({
        studentId: studentDocId,
        content: faker.lorem.paragraph(),
        visibility: faker.helpers.arrayElement(['public', 'private']),
        createdBy: 'admin',
        createdAt: Timestamp.fromDate(faker.date.recent()),
        updatedAt: Timestamp.fromDate(faker.date.recent()),
    }));
}

function generateTasks(studentDocId: string, count: number): Omit<Task, 'id'>[] {
    return Array.from({ length: count }, () => ({
        studentId: studentDocId,
        description: faker.company.catchPhrase(),
        dueDate: Timestamp.fromDate(faker.date.future()),
        assignedTo: 'admin',
        status: faker.helpers.arrayElement(['pending', 'in_progress', 'completed']),
        createdBy: 'admin',
        createdAt: Timestamp.fromDate(faker.date.recent()),
        updatedAt: Timestamp.fromDate(faker.date.recent()),
    }));
}

// Fetch users
async function getUsers() {
    const snapshot = await db.collection('users').get();
    if (snapshot.empty) {
        console.warn('⚠️ No users found. Using generic admin.');
        return ['admin'];
    }
    return snapshot.docs.map(doc => doc.id);
}

async function seedData() {
    try {
        const batchHandler = new BatchHandler(db);

        // 1. Clear existing data
        await clearCollections(batchHandler);
        console.log('✅ Collections cleared');

        // 2. Get Users
        const users = await getUsers();
        console.log(`👥 Found ${users.length} users for assignment`);

        // 3. Generate Students and related data
        console.log('🌱 Seeding students and related data...');
        const STUDENT_COUNT = 50;

        for (let i = 0; i < STUDENT_COUNT; i++) {
            // Pick a random user for assignment
            const assigneeId = faker.helpers.arrayElement(users);

            // Generate student base data
            const studentData = generateRandomStudent();
            const studentRef = db.collection('students').doc();
            const studentDocId = studentRef.id;

            // Generate related item counts
            const interactionCount = faker.number.int({ min: 1, max: 4 });
            const communicationCount = faker.number.int({ min: 0, max: 2 });
            const noteCount = faker.number.int({ min: 0, max: 2 });
            const taskCount = faker.number.int({ min: 1, max: 2 });

            // Update student counts
            studentData.countCommunications = communicationCount;

            // Generate related data arrays
            const interactions = generateInteractions(studentDocId, interactionCount);
            const communications = generateCommunications(studentDocId, communicationCount).map(c => ({
                ...c,
                loggedBy: faker.helpers.arrayElement(users)
            }));
            const notes = generateNotes(studentDocId, noteCount).map(n => ({
                ...n,
                createdBy: faker.helpers.arrayElement(users)
            }));
            const tasks = generateTasks(studentDocId, taskCount).map(t => ({
                ...t,
                assignedTo: assigneeId,
                createdBy: faker.helpers.arrayElement(users)
            }));

            // Count pending tasks for student summary
            const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
            studentData.countPendingTasks = pendingTasks;

            // Add everything to batch
            await batchHandler.set(studentRef, { ...studentData, id: studentDocId });

            for (const item of interactions) {
                await batchHandler.set(db.collection('interactions').doc(), item);
            }
            for (const item of communications) {
                await batchHandler.set(db.collection('communications').doc(), item);
            }
            for (const item of notes) {
                await batchHandler.set(db.collection('notes').doc(), item);
            }
            for (const item of tasks) {
                await batchHandler.set(db.collection('tasks').doc(), item);
            }
        }

        // Final commit
        await batchHandler.commit();
        console.log('✅ Seed data successfully');

    } catch (error) {
        console.error('❌ Error in seed script:', error);
        process.exit(1);
    }
}

seedData();
