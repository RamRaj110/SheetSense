# SheetSense
SheetSense
# SheetSense: Data Visualization from Spreadsheets


SheetSense is a full-stack web application that allows users to upload spreadsheet files (like `.xlsx`), process the data, and visualize it through interactive charts. It features a secure authentication system, separate dashboards for users and administrators, and a modern, responsive user interface.

## ✨ Features

*   **Secure User Authentication**: JWT-based sign-up and login system.
*   **File Upload**: Users can upload spreadsheet files.
*   **Data Visualization**: Dynamic charts are generated from the uploaded data.
*   **Role-Based Access Control**: Separate dashboards and permissions for regular users and administrators.
*   **Admin Dashboard**: Admins can view all users and manage the application.
*   **User Dashboard**: Users can manage their uploaded files and view their data visualizations.

## 🛠️ Tech Stack

| Category      | Technology                                                              |
| ------------- | ----------------------------------------------------------------------- |
| **Frontend**  | [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Redux Toolkit](https://redux-toolkit.js.org/), [Tailwind CSS](https://tailwindcss.com/) |
| **Backend**   | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/), [JWT](https://jwt.io/) |
| **Deployment**| Backend on [Render](https://render.com/), Frontend on [Vercel](https://vercel.com/) |

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or later)
*   [pnpm](https://pnpm.io/installation)
*   [Git](https://git-scm.com/)
*   A [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud-based like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/RamRaj110/SheetSense.git
    cd SheetSense
    ```

2.  **Setup the Backend (`Zidio_server`):**
    ```sh
    cd Zidio_server
    pnpm install
    ```
    Create a `.env` file in the `Zidio_server` directory and add the following variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    PORT=5000
    EMAIL_USER=your_email_for_sending_mail
    EMAIL_PASSWORD=your_email_password_or_app_password
    ```
    Start the backend server:
    ```sh
    pnpm start
    ```

3.  **Setup the Frontend (`Zidio_frontend`):**
    Open a new terminal window.
    ```sh
    cd Zidio_frontend
    pnpm install
    ```
    Create a `.env.local` file in the `Zidio_frontend` directory and add the following:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
    Start the frontend development server:
    ```sh
    pnpm dev
    ```

The application should now be running at `http://localhost:5173`.

## 📂 Project Structure

```
.
├── Zidio_frontend/     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── App.jsx
│   └── package.json
│
└── Zidio_server/       # Node.js Backend
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── uploads/
    └── server.js
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.