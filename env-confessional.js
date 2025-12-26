#!/usr/bin/env node

// Env Var Confessional - Where your environment variables come to confess their sins
// Usage: node env-confessional.js

const fs = require('fs');
const path = require('path');

// The holy scriptures that define what env vars we need
const ENV_TEMPLATES = {
    '.env.example': 'The sacred template',
    '.env.sample': 'The backup scripture',
    'env.example': 'The minimalist gospel'
};

// Find which template file exists (if any)
function findTemplate() {
    for (const [filename, description] of Object.entries(ENV_TEMPLATES)) {
        if (fs.existsSync(filename)) {
            console.log(`📖 Found ${description}: ${filename}`);
            return filename;
        }
    }
    console.log('⚠️  No template found. Your env vars are living in sin without guidance.');
    return null;
}

// Read template and check against actual env vars
function confessSins(templateFile) {
    try {
        const template = fs.readFileSync(templateFile, 'utf8');
        const requiredVars = template
            .split('\n')
            .filter(line => line.trim() && !line.startsWith('#'))
            .map(line => line.split('=')[0].trim());
        
        console.log(`\n🔍 Checking ${requiredVars.length} required variables...`);
        
        const sins = [];
        const virtues = [];
        
        requiredVars.forEach(varName => {
            if (process.env[varName]) {
                virtues.push(`${varName}=${process.env[varName].substring(0, 20)}${process.env[varName].length > 20 ? '...' : ''}`);
            } else {
                sins.push(varName);
            }
        });
        
        // The confession booth
        if (sins.length > 0) {
            console.log('\n😈 SINS FOUND (missing env vars):');
            sins.forEach(sin => console.log(`  ❌ ${sin}`));
            console.log('\n💀 These variables are AWOL. Your app will probably crash.');
            process.exit(1);
        } else {
            console.log('\n😇 ALL VIRTUES PRESENT!');
            console.log('Your environment is pure and holy. Go forth and deploy!');
            
            if (virtues.length > 0) {
                console.log('\n📜 First few virtuous variables:');
                virtues.slice(0, 3).forEach(virtue => console.log(`  ✅ ${virtue}`));
                if (virtues.length > 3) console.log(`  ... and ${virtues.length - 3} more`);
            }
        }
        
    } catch (error) {
        console.log(`\n🔥 ERROR: Could not read ${templateFile}. Maybe it's encrypted?`);
        process.exit(1);
    }
}

// Main confession ritual
console.log('\n🙏 WELCOME TO THE ENV VAR CONFESSIONAL\n');
console.log('Confess your environment sins before runtime...\n');

const template = findTemplate();
if (template) {
    confessSins(template);
} else {
    console.log('\n📝 Create a .env.example file to guide your environment variables to righteousness.');
    process.exit(0);
}
