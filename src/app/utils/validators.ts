const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~;']/;
const UPPERCASE_REGEX = /[A-Z]/;

export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Введите email';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Введите корректный Email';
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Введите пароль';
  }
  if (password.length < 6) {
    return 'Пароль должен содержать не менее 6 символов';
  }
  const specialCharsCount = password
    .split('')
    .filter((char) => SPECIAL_CHAR_REGEX.test(char)).length;
  if (specialCharsCount < 2) {
    return 'Пароль должен содержать не менее 2 спецсимволов';
  }
  if (!UPPERCASE_REGEX.test(password)) {
    return 'Пароль должен содержать как минимум одну заглавную букву';
  }
  return undefined;
};