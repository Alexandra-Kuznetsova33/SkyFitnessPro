'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Logo } from '../Logo/Logo';
import { logout } from '../../redux/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import styles from './Header.module.css';

export const Header = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const login = user?.email.split('@')[0] ?? '';

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    router.push('/');
  };

  const handleProfile = () => {
    setIsMenuOpen(false);
    router.push('/profile');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Logo />
          <span className={styles.subtitle}>Онлайн-тренировки для занятий дома</span>
        </div>

        {user ? (
          <div className={styles.userMenu} ref={menuRef}>
            <button
              type="button"
              className={styles.userButton}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span className={styles.avatar}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" fill="#7B7B7B" />
                  <path
                    d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V22H4V20Z"
                    fill="#7B7B7B"
                  />
                </svg>
              </span>
              <span className={styles.login}>{login}</span>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                className={styles.chevron}
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#000000" strokeWidth="1.5" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{login}</span>
                  <span className={styles.userEmail}>{user.email}</span>
                </div>
                <button type="button" className={styles.profileButton} onClick={handleProfile}>
                  Мой профиль
                </button>
                <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                  Выйти
                </button>
              </div>
            )}
          </div>
        ) : (
          <button type="button" className={styles.loginButton}>
            Войти
          </button>
        )}
      </div>
    </header>
  );
};
