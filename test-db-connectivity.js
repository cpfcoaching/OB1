#!/usr/bin/env node

/**
 * Database Connectivity Test Script
 * Tests Firebase and Supabase connections with rotated credentials
 */

import https from 'https';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load .env.local manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envContent = readFileSync('.env.local', 'utf-8');

const env = {};
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) {
      env[key.trim()] = value.trim();
    }
  }
});

const process = { env: env };

console.log('🔍 Database Connectivity Test\n');
console.log('========================================\n');

// Test configurations
const tests = [
  {
    name: 'Firebase Firestore',
    url: `https://firestore.googleapis.com/v1/projects/${process.env.VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents/resumes?key=${process.env.VITE_FIREBASE_API_KEY}`,
    type: 'GET',
    description: 'Firestore resumes collection'
  },
  {
    name: 'Supabase MCP - Job Hunt',
    url: process.env.VITE_JOB_HUNT_MCP_URL,
    type: 'GET',
    description: 'Job Hunt MCP Server'
  },
  {
    name: 'Supabase MCP - Open Brain',
    url: process.env.VITE_OPEN_BRAIN_MCP_URL,
    type: 'GET',
    description: 'Open Brain MCP Server'
  },
];

let completed = 0;
const results = [];

// Test each endpoint
tests.forEach((test, index) => {
  console.log(`[${index + 1}/${tests.length}] Testing: ${test.name}`);
  console.log(`    URL: ${test.url.substring(0, 80)}...`);
  console.log(`    Type: ${test.type}\n`);

  const url = new URL(test.url);
  
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: test.type,
    timeout: 5000,
  };

  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      completed++;
      
      const success = res.statusCode >= 200 && res.statusCode < 400;
      const status = success ? '✅' : '⚠️';
      
      results.push({
        name: test.name,
        statusCode: res.statusCode,
        success: success,
        message: success ? `Connected (${res.statusCode})` : `Error (${res.statusCode})`
      });

      console.log(`${status} ${test.name}: ${res.statusCode} ${res.statusMessage || ''}`);
      
      if (res.statusCode === 401) {
        console.log(`   ⚠️  Authentication Failed - Check API Key\n`);
      } else if (res.statusCode === 403) {
        console.log(`   ⚠️  Permission Denied - Check Key Permissions\n`);
      } else if (res.statusCode === 404) {
        console.log(`   ℹ️  Resource Not Found (expected for empty collections)\n`);
      } else if (success) {
        console.log(`   ✅ Connection successful\n`);
      } else {
        console.log(`   Error: ${data.substring(0, 100)}\n`);
      }

      // Print all results when done
      if (completed === tests.length) {
        setTimeout(() => {
          console.log('\n========================================');
          console.log('📊 Summary\n');
          
          const passed = results.filter(r => r.success).length;
          const total = results.length;
          
          console.log(`Passed: ${passed}/${total}\n`);
          
          results.forEach(result => {
            const icon = result.success ? '✅' : '❌';
            console.log(`${icon} ${result.name}: ${result.message}`);
          });
          
          console.log('\n========================================');
          
          if (passed === total) {
            console.log('✅ All connectivity tests passed!\n');
            process.exit(0);
          } else {
            console.log('⚠️  Some tests failed. Check credentials.\n');
            process.exit(1);
          }
        }, 500);
      }
    });
  });

  req.on('error', (error) => {
    completed++;
    
    results.push({
      name: test.name,
      statusCode: 'ERROR',
      success: false,
      message: error.message
    });

    console.log(`❌ ${test.name}: ${error.message}\n`);

    if (completed === tests.length) {
      setTimeout(() => {
        console.log('\n========================================');
        console.log('📊 Summary\n');
        
        const passed = results.filter(r => r.success).length;
        const total = results.length;
        
        console.log(`Passed: ${passed}/${total}\n`);
        
        results.forEach(result => {
          const icon = result.success ? '✅' : '❌';
          console.log(`${icon} ${result.name}: ${result.message}`);
        });
        
        console.log('\n========================================\n');
        process.exit(1);
      }, 500);
    }
  });

  req.end();
});

// Timeout after 15 seconds
setTimeout(() => {
  if (completed < tests.length) {
    console.log('\n❌ Tests timed out\n');
    process.exit(1);
  }
}, 15000);
