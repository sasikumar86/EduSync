# EduSync Client

The frontend for the **EduSync School Management System**. Built with React, Vite, and Tailwind CSS. Now features a public-facing Marketing Website and a comprehensive Dashboard.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Backend server running on port `5001`.

### Installation

1.  Navigate to the client directory:
    ```bash
    cd client
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

-   **Development Mode**:
    ```bash
    npm run dev
    ```
    The app runs at `http://localhost:5173`.
    -   **Landing Page**: `http://localhost:5173/`
    -   **Login**: `http://localhost:5173/login`
    -   **API Proxy**: Calls to `/api` are proxied to `http://localhost:5001`.

-   **Build for Production**:
    ```bash
    npm run build
    ```
    Output files will be in `dist/`.

## 📂 Project Structure

```
client/
├── index.html          # Entry HTML
├── src/
│   ├── main.jsx        # React Entry point
│   ├── App.jsx         # Main App component & Routing
│   ├── components/     # Reusable UI components
│   │   ├── website/    # Landing Page components (Hero, Pricing, etc.)
│   │   ├── Chatbot.jsx # AI Assistant
│   │   └── ProtectedRoute.jsx # Auth Guard
│   ├── contexts/       # Global State (AuthContext)
│   ├── layouts/        # Page Layouts
│   │   ├── DashboardLayout.jsx # App Shell for logged-in users
│   │   └── WebsiteLayout.jsx   # Public Site Shell
│   ├── pages/          # Page Views
│   │   ├── public/     # Marketing Pages (Home, Contact)
│   │   ├── admin/      # School Admin pages
│   │   ├── auth/       # Login page
│   │   ├── parent/     # Parent portal
│   │   ├── student/    # Student portal
│   │   ├── superadmin/ # Super Admin pages
│   │   └── teacher/    # Teacher portal
│   ├── services/       # API Service (Axios configuration)
│   └── index.css       # Global Styles & Tailwind Directives
└── ...config files     # Vite, Tailwind, etc.
```

## 🧱 Key Components

### 1. Public Marketing Website
-   **Landing Page (`src/pages/public/Home.jsx`)**: Modern, animated homepage with automated scroll effects.
-   **Components**: `HeroSection`, `FeatureCard`, `PricingCard`, `TestimonialCarousel`.
-   **AI Chatbot**: Floating widget (`src/components/website/ChatbotWidget.jsx`) for visitor engagement.

### 2. Routing (`src/App.jsx`)
-   **Public Routes**: `/`, `/about`, `/contact`.
-   **Protected Routes**: `/dashboard`, `/superadmin`, etc., wrapped in `<ProtectedRoute>` to enforce authentication and role checks.
-   **Role-Based Access**: Different paths for `/admin`, `/teacher`, `/student`, users are redirected based on their role.

### 3. State Management
-   **AuthContext** (`src/contexts/AuthContext.jsx`): Manages user login state, token storage, and logout.

### 4. Layouts (`src/layouts/`)
-   `WebsiteLayout.jsx`: Responsive Navbar and Footer for public pages.
-   `DashboardLayout.jsx`: Sidebar and Topbar for authenticated users.

## 🎨 Styling & Theming

### Tailwind CSS (`tailwind.config.js`)
We use Tailwind CSS for styling. Custom configuration includes:
-   **Colors**: Custom `primary` (Education Blue), `accent`, and `surface` palettes.
-   **Fonts**: Inter font family.
-   **Animations**: Custom fade-in, slide-up, and blob animations for the Hero section.

### Libraries Used
-   **Vite**: Build tool.
-   **React Router DOM**: Navigation.
-   **Framer Motion**: Animations for the landing page.
-   **Lucide React**: Icons.
-   **Axios**: API requests.
