# 🤖 VocaYou — Your Personal AI Assistant

https://github.com/user-attachments/assets/c88c19e2-6eec-475e-88ac-4fa470a6b912

🔗 Live Project: [https://vocayou.onrender.com](https://vocayou.onrender.com)

---

## 📘 Project Description

**VocaYou** is a full-stack AI-powered virtual assistant built using the MERN stack. It provides seamless interaction through voice and text input, integrates with Gemini AI for intelligent responses, and offers full customization for a personalized user experience.

The assistant can:

* Converse using **voice input/output** via the Web Speech API.
* Respond intelligently using **Gemini AI**.
* Manage users securely with **JWT** and **bcrypt** authentication.
* Upload and display a custom assistant **avatar**.
* Be personalized with the user’s **own assistant name, image, and voice**.
* Accept commands via **text input** as well.

---

## 🏛 System Architecture

VocaYou is structured around a classic MERN stack architecture:

* **Frontend**: React-based UI for interactions and assistant display.
* **Backend**: Node.js + Express.js server with REST APIs.
* **Database**: MongoDB for storing user profiles and assistant configurations.
* **AI**: Gemini AI for generating smart conversational replies.
* **Deployment**: Render (for both frontend and backend).

---

## 🎨 Front-End

### Description

The frontend is developed in **React** and uses the **Web Speech API** to convert user speech to text and deliver spoken responses. It is mobile-responsive and enables full customization of the assistant’s personality and appearance.

### Key Features

* Voice command input and output via browser APIs.
* Option to interact using text input.
* Mobile-friendly, responsive UI.
* Assistant profile customization (name, image).
* Auth-protected dashboard using JWT tokens.

### Libraries & Tools

* `React` — Component-based frontend framework.
* `Web Speech API` — Voice input (speech recognition) and output (speech synthesis).
* `React Router` — Page routing and navigation.
* `Axios` — API communication.
* `TailwindCSS` *(if used)* — Utility-first styling.

---

## 🧠 Back-End

### Description

The backend is developed using **Express.js** and handles user authentication, AI request routing, image upload, and database communication.

### Key Features

* **User Authentication**

  * Register and login endpoints.
  * Password encryption using **bcryptjs**.
  * Session management using **JWT**.
  * Auth middleware for protected routes.

* **AI Integration**

  * Communicates with **Gemini AI** to generate responses.

* **Assistant Profile Management**

  * Upload profile image via **Multer**.
  * Store images on **Cloudinary**.
  * Save assistant name and avatar in the database.

### Libraries & Tools

* `Express.js` — Backend routing and middleware.
* `Mongoose` — Object modeling for MongoDB.
* `JWT` — Token-based authentication.
* `bcryptjs` — Secure password hashing.
* `dotenv` — Environment configuration.
* `Multer` — Image/file upload handler.
* `Cloudinary` — Cloud storage for uploaded images.

---

## 🌐 API Design

### REST Endpoints

| Method | Route                   | Description                   |
| ------ | ----------------------- | ----------------------------- |
| POST   | `/api/auth/signup`      | Register a new user           |
| POST   | `/api/auth/login`       | Login and receive JWT token   |
| GET    | `/api/user/info`        | Retrieve user profile         |
| POST   | `/api/user/image`       | Upload assistant avatar image |
| POST   | `/api/user/update`      | Update assistant name         |
| POST   | `/api/assistant/gemini` | Fetch AI response from Gemini |

> Protected routes require a valid JWT token in the `Authorization` header.

---

## 🔐 Authentication Flow

1. User registers with email and password → password hashed using `bcryptjs`.
2. On login, a JWT token is generated and sent to the frontend.
3. Token is stored client-side (e.g., localStorage).
4. All private API requests are authenticated via the token.

---

## 🚀 Deployment

| Layer        | Platform      |
| ------------ | ------------- |
| Frontend     | Render        |
| Backend APIs | Render        |
| Database     | MongoDB Atlas |
| Image Upload | Cloudinary    |

---

## ✅ Testing (Future Scope)

Testing is currently manual, but future plans include:

* **Unit Testing**: Using Jest + Supertest for backend.
* **UI Testing**: Using Cypress or Playwright for end-to-end.
* **Linting & Formatting**: With ESLint and Prettier.

---

## 🌟 Future Enhancements

| Feature                 | Description                                      | Priority |
| ----------------------- | ------------------------------------------------ | -------- |
| 🗂 Chat History         | Save and display past interactions               | High     |
| 🧠 AI Memory            | Persistent context for smarter responses         | High     |
| 🌍 Multilingual Support | Add support for multiple languages               | Medium   |
| 🔔 Notifications        | Alert users with reminders or assistant messages | Medium   |
| 📱 Mobile App           | Cross-platform version with React Native         | Medium   |
| 👥 Admin Mode           | Add multi-user or admin panel for analytics      | Low      |

---

## 🧾 Conclusion

**VocaYou** is a modern, full-stack AI assistant platform designed for seamless interaction through voice and text. With robust authentication, customizable UI, and intelligent AI integration, it offers a complete virtual assistant experience. The architecture is built to scale and offers numerous opportunities for feature expansion.

---

Built with ❤️ using **MERN Stack**, **Gemini AI**, **Web APIs**, and **Cloudinary**.
