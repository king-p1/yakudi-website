/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { z } from 'zod';

const phoneSchema = z.string().min(10).max(20);
const emailSchema = z.string().email();

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_KEY!;

if (!SECRET_KEY || Buffer.from(SECRET_KEY, 'hex').length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
}

function encrypt(value: string): { encryptedData: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: cipher.getAuthTag().toString('hex'),
  };
}

function hash(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export async function submitWaitlistEntry(phoneNumber: string, email: string) {
  try {
    const validatedPhone = phoneSchema.parse(phoneNumber);
    const validatedEmail = emailSchema.parse(email.toLowerCase().trim());

    const phoneEncrypted = encrypt(validatedPhone);
    const emailEncrypted = encrypt(validatedEmail);

    await prisma.user.create({
      data: {
        phoneNumber: phoneEncrypted.encryptedData,
        phoneIV: phoneEncrypted.iv,
        phoneAuthTag: phoneEncrypted.authTag,
        phoneHash: hash(validatedPhone),
        emailAddress: emailEncrypted.encryptedData,
        emailIV: emailEncrypted.iv,
        emailAuthTag: emailEncrypted.authTag,
        emailHash: hash(validatedEmail),
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Failed to save waitlist entry:', error);

    if (error.code === 'P2002') {
      const target = error.meta?.target as string[] | undefined;
      if (target?.includes('emailHash')) {
        return { success: false, error: 'This email is already on the waitlist' };
      }
      return { success: false, error: 'This number is already on the waitlist' };
    }

    return { success: false, error: 'Failed to join waitlist' };
  }
}
