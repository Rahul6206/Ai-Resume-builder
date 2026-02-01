# 🚀 CVPilot – AI Resume Builder

CVPilot is a full-stack MERN application that helps users create AI-powered resumes, verify accounts via email OTP, and download professionally designed PDF resumes.

Built for students, developers, and job seekers.

 ## ✨ Features

 🔐 JWT-based authentication

📄 AI-generated resume PDFs

📧 Email OTP verification (Brevo)

🎨 Modern & responsive UI (TailwindCSS)

🛡️ Secure backend & input validation

## 🛠️ Tech Stack

**Frontend:** React, TailwindCSS, Axios
**Backend:** Node.js, Express, JWT
**PDF:** Puppeteer + Handlebars
**Database:** MongoDB
**Email:** Brevo API

##📂 Project Structure
CVPilot/
├── client/
├── server/
│   └── src/
│       ├── routes controllers models middleware
│       └── templates utils validations
└── README.md

## ⚙️ Environment Variables
```
MONGO_URI=
JWT_SECRET=
BREVO_API_KEY=
GOOGLE_GEMINI_API_KEY=
CLIENT_URL=
PORT=3000 
```
## 🚀 Setup
```
git clone https://github.com/your-username/cvpilot.git
cd cvpilot

cd server && npm install && npm run start
cd client && npm install && npm run dev
```

## 🧠 Workflow

User enters resume details

AI processes content

Resume PDF is generated

User downloads the resume
