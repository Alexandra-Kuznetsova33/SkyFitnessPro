import { validateEmail, validatePassword } from './validators';

describe('validateEmail', () => {
  it('возвращает ошибку для пустой строки', () => {
    expect(validateEmail('')).toBe('Введите email');
  });

  it('возвращает ошибку для строки из пробелов', () => {
    expect(validateEmail('   ')).toBe('Введите email');
  });

  it('возвращает ошибку, если нет @', () => {
    expect(validateEmail('userexample.com')).toBe('Введите корректный Email');
  });

  it('возвращает ошибку, если нет домена', () => {
    expect(validateEmail('user@')).toBe('Введите корректный Email');
  });

  it('возвращает ошибку, если нет точки в домене', () => {
    expect(validateEmail('user@example')).toBe('Введите корректный Email');
  });

  it('возвращает undefined для корректного email', () => {
    expect(validateEmail('user@example.com')).toBeUndefined();
  });

  it('принимает email с поддоменом', () => {
    expect(validateEmail('user@mail.example.com')).toBeUndefined();
  });
});

describe('validatePassword', () => {
  it('возвращает ошибку для пустой строки', () => {
    expect(validatePassword('')).toBe('Введите пароль');
  });

  it('возвращает ошибку, если пароль короче 6 символов', () => {
    expect(validatePassword('Ab1!')).toBe('Пароль должен содержать не менее 6 символов');
  });

  it('возвращает ошибку, если меньше 2 спецсимволов', () => {
    expect(validatePassword('Password1')).toBe(
      'Пароль должен содержать не менее 2 спецсимволов',
    );
  });

  it('возвращает ошибку, если только 1 спецсимвол', () => {
    expect(validatePassword('Password1!')).toBe(
      'Пароль должен содержать не менее 2 спецсимволов',
    );
  });

  it('возвращает ошибку, если нет заглавной буквы', () => {
    expect(validatePassword('password1!@')).toBe(
      'Пароль должен содержать как минимум одну заглавную букву',
    );
  });

  it('возвращает undefined для корректного пароля', () => {
    expect(validatePassword('Password1!@')).toBeUndefined();
  });

  it('принимает пароль с разными спецсимволами', () => {
    expect(validatePassword('MyPass#$')).toBeUndefined();
  });

  it('принимает пароль ровно из 6 символов', () => {
    expect(validatePassword('Pa1!@b')).toBeUndefined();
  });
});