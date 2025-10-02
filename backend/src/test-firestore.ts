import { collections, configDocs } from './services/firestore';

async function testFirestore() {
  try {
    console.log('Testing Firestore connection...');
    console.log(process.env.FIREBASE_PROJECT_ID);

    // Test reading students collection
    const studentsSnapshot = await collections.students.limit(1).get();
    console.log(`✅ Students collection accessible (${studentsSnapshot.size} docs)`);

    // Test reading global config
    const globalConfig = await configDocs.global.get();
    console.log(`✅ Global config accessible (exists: ${globalConfig.exists})`);

    console.log('✅ All Firestore tests passed!');
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
  }
}

testFirestore();