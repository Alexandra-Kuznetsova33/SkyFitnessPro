import type { ReactNode } from 'react';

import { AuthModal } from '../AuthModal/AuthModal';
import { Header } from '../Header/Header';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <AuthModal />
    </div>
  );
};