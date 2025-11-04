# 💬 MERN Q&A App (Assignment)

A full-stack mini web app built with **MongoDB, Express, React (Vite + TypeScript), and Node.js**.  
This project was created as part of the **Frontend/MERN Stack Developer assignment** from **OriginBluy | Oneorg.ai**.

---

## 🚀 Features

### 👤 Authentication
- JWT-based login and registration.
- Two roles: **Member** and **Manager**.
- Role-based access (Manager-only features).

### ❓ Questions
- Members and Managers can post new questions.
- Search questions by title or tag.
- Clean, responsive UI with Vite + Tailwind.

### 💬 Answers
- Members and Managers can answer questions.
- Each answer shows author and role (Member/Manager badge).

### 📊 Insights (Manager Only)
- Managers can post a summary insight for any question.
- Insights act as official conclusions for the discussion.
- Manager-only dashboard to create and view insights.

### 🔍 Search & Filtering
- Real-time search by question title or tags.
- Filter system for better user experience.

---

## 🧠 Tech Stack

**Frontend:** React (Vite + TypeScript), TailwindCSS  
**Backend:** Node.js, Express.js, MongoDB, JWT Authentication  
**Database:** MongoDB Atlas (or local MongoDB)  
**Deployment:** Vercel (Frontend) + Render/Railway (Backend)

---

## 📦 Folder Structure

my-qa-app/
├── frontend/ # React + Vite + TypeScript app
│ └── src/
│ ├── pages/
│ ├── components/
│ └── api/
├── backend/ # Node.js + Express + MongoDB API
│ ├── src/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ └── server.ts
|-- .gitignore
└── README.md

---

## ⚙️ Setup Instructions

### 1️.-->  Clone the Repository
- git clone https://github.com/shubham-singh10/qa-app.git
- cd qa-app

### 2.-->  Backend Setup
- cd backend
- .env   # create your own .env file
- npm install
- npm run dev | npm start

 ###### Example .env ##########

- PORT=5000
- MONGO_URI=your_mongo_connection_string
- JWT_SECRET=your_secret_key


### 3.-->  Frontend Setup

- cd ./frontend
- npm install
- npm run dev


### 4. ---> Access the app
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

| Method | Endpoint               | Description                    | Role           |
| ------ | ---------------------- | ------------------------------ | -------------- |
| POST   | `/api/auth/register`       | Register user                  | Public         |
| POST   | `/api/auth/login`          | Login and get JWT              | Public         |
| POST   | `/api/question`           | Create new question            | Member/Manager |
| GET    | `/api/question`           | Get all questions (searchable) | Public         |
| GET    | `/api/question/:questionId` | Get questions by id          | Public.        |
| POST   | `/api/answer`             | Add answer to a question       | Member/Manager |
| GET    | `/api/answer/:questionId` | Fetch answers for a question   | Public         |
| POST   | `/api/insight`            | Create insight                 | Manager Only   |
| GET    | `/api/insight`            | View all insights              | Manager Only   |




### 🌐 Live Demo

- Frontend (React): https://qa-app-s69w.vercel.app
- Backend (API): https://qa-app-xi.vercel.app

### 👨‍💻 Author

**Shubham Kumar Singh**
- 📧 shubhamkumarsinghh@outlook.com
- 🔗 [LinkedIn](https://www.linkedin.com/in/shubham~kumar~singh/)
- 💻 [GitHub](https://github.com/shubham-singh10)
