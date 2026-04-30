# Task Manager

Backend scaffold created for a Django REST + PostgreSQL task management system with:

- public signup and login
- custom user model for admins and members
- project and team management
- task assignment and status updates
- task comments/progress notes
- admin dashboard analytics

## Backend setup

1. Open the `backend` folder.
2. Create a virtual environment.
3. Install dependencies:
   `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and update PostgreSQL values.
5. Run:
   `python manage.py makemigrations`
   `python manage.py migrate`
   `python manage.py runserver`

### Backend `.env`

Create [backend/.env](C:/Users/Welcome/Documents/Codex/2026-04-29-hii/backend/.env) with:

```env
SECRET_KEY=django-insecure-change-this-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

What each variable does:

- `SECRET_KEY`: Django security key. Use any long random string.
- `DEBUG`: Keep `True` for local development.
- `ALLOWED_HOSTS`: Hosts Django accepts requests from.
- `DB_NAME`: Your PostgreSQL database name.
- `DB_USER`: PostgreSQL username.
- `DB_PASSWORD`: PostgreSQL password.
- `DB_HOST`: Usually `localhost` for local development.
- `DB_PORT`: Usually `5432` for PostgreSQL.
- `CORS_ALLOWED_ORIGINS`: Frontend URL allowed to call the backend.

## Main API routes

- `POST /api/auth/login/`
- `POST /api/auth/signup/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`
- `GET,POST /api/members/`
- `GET,POST /api/projects/`
- `GET,PUT,PATCH,DELETE /api/projects/<id>/`
- `GET /api/dashboard/admin/`
- `GET,POST /api/tasks/`
- `GET,PATCH,PUT,DELETE /api/tasks/<id>/`
- `GET,POST /api/tasks/<id>/comments/`

## Frontend setup

1. Open the `frontend` folder.
2. Install dependencies:
   `npm install`
3. Copy `.env.example` to `.env`
4. Start the app:
   `npm run dev`

### Frontend `.env`

Create [frontend/.env](C:/Users/Welcome/Documents/Codex/2026-04-29-hii/frontend/.env) with:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

What it does:

- `VITE_API_BASE_URL`: Base API URL used by Axios in the React app.

## Local Run Order

1. Start PostgreSQL and make sure the database from `DB_NAME` exists.
2. In `backend`, install packages and run migrations.
3. Optionally create a superuser with `python manage.py createsuperuser` if you also want Django admin access.
4. Start Django with `python manage.py runserver`.
5. In `frontend`, install packages and run `npm run dev`.
6. Open `http://localhost:3000` and use the public signup page.

## Frontend pages

- `/login`
- `/signup`
- `/admin`
- `/admin/projects`
- `/admin/members`
- `/admin/tasks/new`
- `/member`
- `/member/projects`
