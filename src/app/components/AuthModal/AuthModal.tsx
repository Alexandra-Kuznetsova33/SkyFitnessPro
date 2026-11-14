'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import { Modal } from '../Modal/Modal';
import { loginThunk, registerThunk } from '../../redux/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { closeAuthModal } from '../../redux/uiSlice';
import styles from './AuthModal.module.css';

type Mode = 'login' | 'register';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~;'']/g;
const UPPERCASE_REGEX = /[A-Z]/;

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Введите email';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Введите корректный Email';
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Введите пароль';
  }
  if (password.length < 6) {
    return 'Пароль должен содержать не менее 6 символов';
  }
  const specialChars = password.match(SPECIAL_CHAR_REGEX);
  if (!specialChars || specialChars.length < 2) {
    return 'Пароль должен содержать не менее 2 спецсимволов';
  }
  if (!UPPERCASE_REGEX.test(password)) {
    return 'Пароль должен содержать как минимум одну заглавную букву';
  }
  return undefined;
};

export const AuthModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isAuthModalOpen);
  const isAuthLoading = useAppSelector((state) => state.auth.isLoading);

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const handleClose = () => {
    dispatch(closeAuthModal());
    resetForm();
    setMode('login');
  };

  const switchMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setErrors({});
    setConfirmPassword('');
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {
      email: validateEmail(email),
    };

    if (mode === 'register') {
      nextErrors.password = validatePassword(password);

      if (!confirmPassword) {
        nextErrors.confirmPassword = 'Повторите пароль';
      } else if (confirmPassword !== password) {
        nextErrors.confirmPassword = 'Пароли не совпадают';
      }
    } else if (!password) {
      nextErrors.password = 'Введите пароль';
    }

    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password && !nextErrors.confirmPassword;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const action =
      mode === 'login'
        ? await dispatch(loginThunk({ email, password }))
        : await dispatch(registerThunk({ email, password }));

    if (loginThunk.rejected.match(action) || registerThunk.rejected.match(action)) {
      const errorMessage = typeof action.payload === 'string' ? action.payload : null;
      if (errorMessage) {
        toast.error(errorMessage);
      }
      return;
    }

    toast.success(mode === 'login' ? 'Вы успешно вошли!' : 'Регистрация прошла успешно!');
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>SkyFitnessPro</h2>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <input
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder={mode === 'login' ? 'Логин' : 'Эл. почта'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isAuthLoading}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <input
              type="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              disabled={isAuthLoading}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          {mode === 'register' && (
            <div className={styles.field}>
              <input
                type="password"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isAuthLoading}
              />
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button type="submit" className={styles.submitButton} disabled={isAuthLoading}>
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>

          <button type="button" className={styles.switchButton} onClick={switchMode}>
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>
      </div>
    </Modal>
  );
};