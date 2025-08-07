import { storage } from '../storage';
import { randomBytes } from 'crypto';

/**
 * Utility function to generate access codes for course participants
 * This can be used by administrators to create access codes manually
 */

export async function generateCourseAccessCode(expirationDays: number = 365): Promise<string> {
  // Generate a readable access code format: XXXX-XXXX-XXXX
  const generateReadableCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  let code = generateReadableCode();
  
  // Ensure code is unique
  while (await storage.getAccessCode(code)) {
    code = generateReadableCode();
  }

  // Set expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expirationDays);

  // Create the access code
  await storage.createAccessCode({
    code,
    type: 'course',
    expiresAt,
    metadata: {
      courseTitle: 'LightPrompt:Ed',
      generatedAt: new Date().toISOString(),
      tokenLimit: 50
    }
  });

  return code;
}

// Example usage for generating multiple codes
export async function generateMultipleCodes(count: number = 10): Promise<string[]> {
  const codes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const code = await generateCourseAccessCode();
    codes.push(code);
  }
  
  return codes;
}

// Console script - uncomment and run to generate codes
// (async () => {
//   console.log('Generating 5 course access codes...');
//   const codes = await generateMultipleCodes(5);
//   console.log('Generated codes:');
//   codes.forEach((code, index) => {
//     console.log(`${index + 1}. ${code}`);
//   });
// })();