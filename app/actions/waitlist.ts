/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import prisma  from '@/lib/prisma';
import crypto from 'crypto';
import { z } from 'zod';

const phoneSchema = z.string().min(10).max(20);

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_KEY!; // Must be 32 bytes (64 hex chars)

if (!SECRET_KEY || Buffer.from(SECRET_KEY, 'hex').length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
}

function encryptPhone(phoneNumber: string): {
  encryptedData: string;
  iv: string;
  authTag: string;
} { 
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY, 'hex'),
    iv
  );

  let encrypted = cipher.update(phoneNumber, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

function hashPhone(phoneNumber: string): string {
  return crypto.createHash('sha256').update(phoneNumber).digest('hex');
}

export async function submitPhoneNumber(phoneNumber: string) {
  try {
    // Validate input
    const validatedPhone = phoneSchema.parse(phoneNumber);

    // Encrypt phone number
    const { encryptedData, iv, authTag } = encryptPhone(validatedPhone);

    // Hash phone number for uniqueness checking
    const phoneHash = hashPhone(validatedPhone);

    // Save to database
    await prisma.user.create({
      data: {
        phoneNumber: encryptedData,
        phoneIV: iv,
        phoneAuthTag: authTag,
        phoneHash: phoneHash,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Failed to save phone number:', error);

    // Handle duplicate phone
    if (error.code === 'P2002') {
      return { success: false, error: 'This number is already on the waitlist' };
    }

    return { success: false, error: 'Failed to join waitlist' };
  }
}