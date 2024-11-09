export function isAlphaNumeric(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}

export function isLongerThan(str, length) {
  return str.length > length;
}

export function isShorterThan(str, length) {
  return str.length < length;
}
