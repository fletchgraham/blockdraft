"use server";
import bcrypt from "bcryptjs";

export async function isAlphaNumeric(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}

export async function isLongerThan(str, length) {
  return str.length > length;
}

export async function isShorterThan(str, length) {
  return str.length < length;
}

export async function validatePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
