#!/usr/bin/env node

/**
 * Code Generator for Early Access
 *
 * Usage:
 *   node generate-codes.js [count]
 *
 * Example:
 *   node generate-codes.js 10    // Generates 10 codes
 *   node generate-codes.js       // Generates 1 code
 */

function generateInviteCode(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  return code;
}

function formatCode(code) {
  return code.match(/.{1,3}/g)?.join('-') || code;
}

const count = parseInt(process.argv[2]) || 1;

console.log(`\n🎫 Generated ${count} invite code${count > 1 ? 's' : ''}:\n`);
console.log('='.repeat(50));

for (let i = 0; i < count; i++) {
  const code = generateInviteCode();
  const formatted = formatCode(code);
  console.log(`${i + 1}. ${formatted} (${code})`);
}

console.log('='.repeat(50));
console.log('\n📝 To add these codes to your database:');
console.log('1. Go to Supabase SQL Editor');
console.log('2. Run this query for each code:\n');
console.log(`INSERT INTO invite_codes (code, description, max_uses)
VALUES ('CODE_HERE', 'Description', 1);`);
console.log('\n');
