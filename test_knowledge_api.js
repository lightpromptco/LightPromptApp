// Test script to verify knowledge API is working
import fetch from 'node-fetch';

async function testKnowledgeAPI() {
  try {
    console.log('🧠 Testing Knowledge API...');
    
    // Test GET foundation memories
    const response = await fetch('http://localhost:5000/api/knowledge/foundation');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers.get('content-type'));
    
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json();
      console.log('✅ Foundation memories retrieved:', data.length, 'items');
      console.log('Sample:', data[0]);
    } else {
      const text = await response.text();
      console.log('❌ Got HTML instead of JSON. First 200 chars:', text.substring(0, 200));
    }
    
    // Test search
    const searchResponse = await fetch('http://localhost:5000/api/knowledge/search?q=platform');
    console.log('\n🔍 Search test status:', searchResponse.status);
    
    if (searchResponse.headers.get('content-type')?.includes('application/json')) {
      const searchData = await searchResponse.json();
      console.log('✅ Search results:', searchData.length, 'items');
    } else {
      console.log('❌ Search also returning HTML');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testKnowledgeAPI();