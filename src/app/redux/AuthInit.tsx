'use client';

import { useEffect } from 'react';

import { initializeAuthThunk } from './authSlice';
import { useAppDispatch } from './hooks';

export const AuthInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuthThunk());
  }, [dispatch]);

  return null;
};