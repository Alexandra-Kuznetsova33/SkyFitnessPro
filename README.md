# SkyFitnessPro

Онлайн-платформа для фитнес-тренировок с курсами, уроками и отслеживанием прогресса.

## 🛠 Стек технологий

- **Next.js 16** (App Router, Turbopack, TypeScript)
- **Redux Toolkit** + **react-redux** — управление состоянием
- **Axios** — HTTP-запросы
- **CSS Modules** — стилизация (без Tailwind)
- **react-toastify** — уведомления
- **react-loading-skeleton** — скелетоны загрузки
- **Jest** + **React Testing Library** — тестирование
- **ESLint** + **Prettier** — качество и стиль кода

## ✨ Функционал

### Страницы

- **Главная** — каталог всех курсов из API с фильтрацией по статусу добавления
- **Авторизация / Регистрация** — модалка с валидацией полей и автологином после регистрации
- **Страница курса** — описание, направления, преимущества и кнопка добавления
- **Профиль** — только для авторизованных: карточка пользователя и список купленных курсов с прогрессом
- **Тренировка** — видео, упражнения, прогресс-бары и модалка заполнения

### Возможности

- Регистрация и вход с JWT-токеном
- Восстановление сессии при перезагрузке страницы
- Добавление и удаление курсов
- Заполнение и обновление прогресса по упражнениям
- Сброс прогресса курса и отдельных тренировок
- Кнопка «Наверх» на главной
- Адаптивная вёрстка (mobile-first)
- Защита роутов (редирект с `/profile` для гостей)
- Toast-уведомления об ошибках API

## 📁 Структура проекта

```
src/app/
├── components/          # UI-компоненты (каждый в своей папке)
│   ├── AuthModal/
│   ├── CourseCard/
│   ├── CoursesPage/
│   ├── Header/
│   ├── Layout/
│   ├── Modal/
│   ├── MyCourseCard/
│   ├── ProfilePage/
│   ├── ScrollToTop/
│   ├── WorkoutPage/
│   ├── WorkoutProgressModal/
│   ├── WorkoutProgressSuccessModal/
│   └── WorkoutSelectModal/
├── redux/               # Слайсы, store, типизированные хуки
│   ├── authSlice.ts
│   ├── coursesSlice.ts
│   ├── progressSlice.ts
│   ├── uiSlice.ts
│   ├── workoutsSlice.ts
│   ├── store.ts
│   ├── hooks.ts
│   ├── AuthInit.tsx
│   └── Providers.tsx
├── services/            # Axios-инстанс и API-сервисы
│   ├── api.ts
│   ├── auth.ts
│   ├── constants.ts
│   ├── courses.ts
│   ├── progress.ts
│   └── workouts.ts
├── sharedTypes/         # Общие TypeScript-типы
│   └── types.ts
├── utils/               # Утилиты и тесты
│   ├── calcCourseProgress.ts
│   ├── calcExerciseProgress.ts
│   ├── cleanExerciseName.ts
│   ├── courseColors.ts
│   ├── courseImages.ts
│   ├── handleApiError.ts
│   ├── getWorkoutTitle.ts
│   ├── getYoutubeEmbedUrl.ts
│   ├── sortCourses.ts
│   ├── sortWorkouts.ts
│   └── validators.ts
├── layout.tsx
└── page.tsx
```

## 🚀 Запуск проекта

### 1. Клонировать репозиторий

```bash
git clone https://github.com/Alexandra-Kuznetsova33/SkyFitnessPro.git
cd SkyFitnessPro
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Запустить dev-сервер

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### 4. Сборка и запуск production

```bash
npm run build
npm start
```

## 🧪 Тесты

```bash
npm test            # однократный запуск
npm run test:watch  # режим наблюдения
```

Покрыты чистые функции: `calcCourseProgress`, `calcExerciseProgress`, `handleApiError`, `sortCourses`, `validators`.

## 🎨 Дизайн

Макет: [Figma — SkyFitnessPro](https://www.figma.com/design/efIqPMajoJgo2FIfbFbn1G/SkyFitnessPro)

Дизайн-токены (цвета, радиусы, шрифты) описаны в `src/app/globals.css` как CSS-переменные.

## 🌐 API

Базовый URL: `https://wedev-api.sky.pro/api/fitness`

Запросы проксируются через `rewrites` в `next.config.ts`, чтобы избежать проблем с CORS. Токен автоматически подставляется в заголовок `Authorization: Bearer <token>` через интерсептор Axios.

**Особенность API:** мутационные запросы (`POST`, `PATCH`) принимают тело только с заголовком `Content-Type: text/plain`, иначе сервер возвращает `400`. Это учтено в `services/`.

## 🚀 Деплой

Проект задеплоен на **Cloudflare Pages**: [ссылка на деплой]

## 📜 Скрипты

| Команда | Назначение |
|---|---|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Production-сборка |
| `npm start` | Запуск production-сервера |
| `npm run lint` | Проверка ESLint |
| `npm test` | Запуск тестов Jest |
| `npm run test:watch` | Тесты в режиме наблюдения |

## 👤 Автор

**Alexandra Kuznetsova** — [GitHub](https://github.com/Alexandra-Kuznetsova33)

---

Проект выполнен в рамках дипломной работы курса «Frontend-разработчик» (Skypro).
