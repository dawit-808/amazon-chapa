# Amazon-clone Web App with Firebase Auth & Stripe

This is a full-stack web application built with:

- ✅ **Frontend**: React.js
- ⚙️ **Backend**: Node.js (Express)
- 🛢️ **Database**: MySQL
- 🔐 **Authentication**: Firebase Authentication
- 💳 **Payments**: Stripe

---

## 🌐 Live Demo

👉 [**View Live Site**](https://ama808zon.netlify.app/) 👈

---

## 🚀 Features

- User authentication with Firebase (signup, login, logout)
- Secure backend routes using Firebase ID tokens
- User data stored in MySQL
- Stripe payment integration (checkout session)
- Modern React UI with protected routes
- Modular structure for scalability

---

## 🔧 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/dawit-808/amazon-clone.git
cd yamazon-clone

> ⚠️ This project uses your **local MySQL database**, your own **Firebase project**, and your **Stripe account**. Make sure to configure your `.env` file with the correct credentials.

# Frontend
cd client
npm install

# Backend
cd ../server
npm install

### 2. Start Development Servers

# In /client
npm start

# In /server
npm run dev


