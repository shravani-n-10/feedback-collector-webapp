# Smart Feedback Analyzer 🚀

A full-stack MERN (MongoDB, Express, React, Node.js) web application designed to securely collect, manage, and analyze user feedback in real time using advanced sentiment analysis.

![Demo Mockup](https://via.placeholder.com/800x400.png?text=Smart+Feedback+Analyzer)

## 📌 Key Features

* **Real-time Synchronization**: Powered by `Socket.io`, new feedback instantly populates the dashboard for all connected devices without needing a page refresh.
* **AI Sentiment Analysis**: Every feedback message is automatically processed by an AI sentiment engine (Positive/Neutral/Negative) making it wildly easier to spot critical customer issues instantly.
* **Secure Authentication**: Highly secure JWT token-based authentication system with encrypted passwords using `bcryptjs`.
* **Dark Mode Glassmorphism UI**: A gorgeous, modern frontend built with Vite, Tailwind CSS v4, and React Hot Toast for a premium user experience.
* **Cloud Storage**: Seamless image upload integration using `multer` configured directly to a secure `Cloudinary` bucket for screenshot attachments.
* **Robust Filtering Algorithm**: A dedicated Search architecture allows users to perform strict text-searches, filter by star ratings, and sort dynamically.

## 🛠️ Technology Stack

### Frontend
* **React 19 + Vite**: High-performance single page application.
* **Tailwind CSS v4**: Utility-first CSS framework for rapid and responsive UI development.
* **React Router v7**: Declarative routing for standard component navigation.
* **Socket.io-client**: Dual-channel websocket communication for live dashboard updates.

### Backend
* **Node.js & Express**: Secure, scalable server architecture and RESTful routing.
* **MongoDB Atlas + Mongoose**: Cloud NoSQL database with strict schema validation.
* **Sentiment**: Textual analysis library for natural language processing.
* **Cloudinary**: Cloud-based image and multimedia delivery platform.
* **JSON Web Tokens (JWT)**: Secure user session management.

## 🚀 Getting Started

### Prerequisites
* Node.js (v24+ recommended)
* MongoDB Atlas Cluster URI
* Cloudinary API Keys

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shravani-n-10/feedback-collector-webapp.git
   cd feedback-collector-webapp
   ```

2. **Setup Environment Variables:**
   Navigate into the `backend` folder and create a `.env` file replacing all the placeholders:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.exmple.mongodb.net/
   JWT_SECRET=super_secret_jwt_key_123

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Install Dependencies:**
   Run these commands in separate terminals to install all frontend & backend dependencies.
   ```bash
   # Install Backend
   cd backend
   npm install

   # Install Frontend
   cd frontend
   npm install
   ```

4. **Boot Up the Servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome. Feel free to check issues page if you want to contribute.

## 💡 Author
Developed by **Shravani**
