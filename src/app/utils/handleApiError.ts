import axios from 'axios';

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data;

      if (
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof data.message === 'string' &&
        data.message.trim().length > 0
      ) {
        return data.message;
      }

      return `Ошибка сервера: ${error.response.status}`;
    }

    if (error.request) {
      return 'Сервер не отвечает. Проверьте подключение к интернету.';
    }

    return error.message || 'Неизвестная ошибка';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Что-то пошло не так. Попробуйте позже.';
};