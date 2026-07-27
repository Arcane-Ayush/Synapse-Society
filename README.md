> Disclaimer: This README has been written with the help of AI.

# ✨ Google Club CU - Digital Experience

Welcome to the official repository for the Google Club CU website! This project is a dynamic, theme-switchable platform designed to showcase our club's activities, projects, and achievements in a visually engaging way.

## 🚀 Overview

We've built this site to be more than just an information board. It's an immersive experience that reflects the creativity and diverse interests of our members. Whether you're a fan of sci-fi, retro gaming, or anime, there's a theme here for you.

### 🎨 Immersive Themes
*   **🌌 Space (Start Trek/Sci-Fi)**: Sleek, holographic interfaces with "Glassmorphism" effects.
*   **🕹️ Arcade (Retro Gaming)**: 8-bit aesthetic, pixel fonts, and neon visuals.
*   **🌸 Anime (Pop Culture)**: Soft colors, dynamic cards, and "Sakura" particle effects.

---

## 🛠️ Technology Stack

We believe in using modern, powerful tools to build the best experiences:
*   **React 18**: For building a responsive and interactive UI.
*   **Vite**: For lightning-fast development and building.
*   **Tailwind CSS**: For rapid, utility-first styling.
*   **Framer Motion**: For smooth, complex animations and transitions.
*   **Lucide React**: For beautiful, consistent iconography.

---

## ⚡ Getting Started

Follow these simple steps to run the project locally on your machine:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Arcane-Ayush/GoogleClub-site.git
    cd GoogleClub-site
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open your browser to `http://localhost:5173` to see the magic happen!

---

## 📡 Remote Data Management (Headless Mode)

To make it easier for our team to update content without needing to push code, we have implemented a "Headless" data feature. This allows the site to fetch content (Activities, Projects, Leaderboard) from a remote JSON file.

### How to Update Content Remotely:

1.  **Host Your Data**:
    *   We use a simple `JSON` structure. You can find a template in `google_club_data.json` in this folder.
    *   Upload this content to a service like **GitHub Gists** (gist.github.com).
    *   Once created, click the **"Raw"** button to get the direct file URL.

2.  **Connect to the App**:
    *   Open `src/hooks/useData.js`.
    *   Update the `REMOTE_URL` constant with your new Raw URL:
        ```javascript
        const REMOTE_URL = "https://gist.githubusercontent.com/.../raw/clubData.json";
        ```

3.  **Automatic Updates**:
    *   The site is built to be resilient. It will attempt to fetch your fresh data from the URL first.
    *   **Safety Net**: If the internet is down or the URL is broken, the app gracefully falls back to the internal `mockData.js`, ensuring the site never crashes.

---

## 🤝 Contributing

We welcome contributions from everyone! Whether you're fixing a bug, adding a new theme, or just fixing a typo, your help is appreciated.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

*Crafted with ❤️ by the Google Club Team.*
