/**
 * Encryption Service for Sensitive Data
 * Uses AES-256-GCM encryption for Amazon credentials and other sensitive data
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Get encryption key from environment variable
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || process.env.SESSION_SECRET;
  
  if (!secret) {
    throw new Error('ENCRYPTION_SECRET or SESSION_SECRET must be set in environment variables');
  }
  
  // Derive a key from the secret using PBKDF2
  const salt = crypto.createHash('sha256').update('astra-commerce-salt').digest();
  return crypto.pbkdf2Sync(secret, salt, 100000, KEY_LENGTH, 'sha256');
}

/**
 * Encrypt a string using AES-256-GCM
 */
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Combine IV + encrypted data + auth tag
    const result = iv.toString('hex') + encrypted + authTag.toString('hex');
    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt a string encrypted with AES-256-GCM
 */
export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey();
    
    // Extract IV, encrypted data, and auth tag
    const iv = Buffer.from(encryptedText.slice(0, IV_LENGTH * 2), 'hex');
    const authTag = Buffer.from(encryptedText.slice(-TAG_LENGTH * 2), 'hex');
    const encrypted = encryptedText.slice(IV_LENGTH * 2, -TAG_LENGTH * 2);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Encrypt Amazon credentials for storage
 */
export interface AmazonCredentials {
  email: string;
  password: string;
  totpSecret?: string;
}

export function encryptAmazonCredentials(credentials: AmazonCredentials): string {
  const json = JSON.stringify(credentials);
  return encrypt(json);
}

export function decryptAmazonCredentials(encrypted: string): AmazonCredentials {
  const json = decrypt(encrypted);
  return JSON.parse(json);
}

/**
 * Hash a string (one-way, for comparison only)
 */
export function hash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
