import { AxiosError, AxiosHeaders } from 'axios';
import type { AxiosResponse } from 'axios';

import { getApiErrorMessage } from './handleApiError';

const createAxiosError = (options: {
  response?: { data: unknown; status: number };
  request?: unknown;
  message?: string;
}): AxiosError => {
  const error = new AxiosError(options.message ?? 'Axios error');

  if (options.response) {
    error.response = {
      data: options.response.data,
      status: options.response.status,
      statusText: 'Error',
      headers: {},
      config: { headers: new AxiosHeaders() },
    } as AxiosResponse;
  }

  if (options.request) {
    error.request = options.request;
  }

  return error;
};

describe('getApiErrorMessage', () => {
  describe('когда пришла ошибка Axios с ответом сервера', () => {
    it('возвращает message из response.data', () => {
      const error = createAxiosError({
        response: { data: { message: 'Пользователь не найден' }, status: 404 },
      });

      expect(getApiErrorMessage(error)).toBe('Пользователь не найден');
    });

    it('возвращает fallback с кодом, если в ответе нет message', () => {
      const error = createAxiosError({
        response: { data: {}, status: 500 },
      });

      expect(getApiErrorMessage(error)).toBe('Ошибка сервера: 500');
    });

    it('возвращает fallback, если message пустая строка', () => {
      const error = createAxiosError({
        response: { data: { message: '' }, status: 400 },
      });

      expect(getApiErrorMessage(error)).toBe('Ошибка сервера: 400');
    });

    it('возвращает fallback, если message состоит из пробелов', () => {
      const error = createAxiosError({
        response: { data: { message: '   ' }, status: 400 },
      });

      expect(getApiErrorMessage(error)).toBe('Ошибка сервера: 400');
    });

    it('возвращает fallback, если message не строка', () => {
      const error = createAxiosError({
        response: { data: { message: 42 }, status: 400 },
      });

      expect(getApiErrorMessage(error)).toBe('Ошибка сервера: 400');
    });

    it('возвращает fallback, если data равно null', () => {
      const error = createAxiosError({
        response: { data: null, status: 400 },
      });

      expect(getApiErrorMessage(error)).toBe('Ошибка сервера: 400');
    });
  });

  describe('когда запрос ушёл, но ответа нет', () => {
    it('возвращает сообщение о недоступности сервера', () => {
      const error = createAxiosError({ request: {} });

      expect(getApiErrorMessage(error)).toBe(
        'Сервер не отвечает. Проверьте подключение к интернету.',
      );
    });
  });

  describe('когда ошибка Axios без response и без request', () => {
    it('возвращает оригинальный message', () => {
      const error = createAxiosError({ message: 'Custom axios message' });

      expect(getApiErrorMessage(error)).toBe('Custom axios message');
    });
  });

  describe('когда пришла обычная ошибка Error', () => {
    it('возвращает message ошибки', () => {
      expect(getApiErrorMessage(new Error('Что-то сломалось'))).toBe('Что-то сломалось');
    });
  });

  describe('когда пришло что-то не являющееся ошибкой', () => {
    it('возвращает fallback для строки', () => {
      expect(getApiErrorMessage('some string')).toBe('Что-то пошло не так. Попробуйте позже.');
    });

    it('возвращает fallback для null', () => {
      expect(getApiErrorMessage(null)).toBe('Что-то пошло не так. Попробуйте позже.');
    });

    it('возвращает fallback для undefined', () => {
      expect(getApiErrorMessage(undefined)).toBe('Что-то пошло не так. Попробуйте позже.');
    });

    it('возвращает fallback для числа', () => {
      expect(getApiErrorMessage(42)).toBe('Что-то пошло не так. Попробуйте позже.');
    });
  });
});