self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => self.clients.claim());
self.addEventListener("fetch", () => {});


const App = {
  init() {
    console.log("App initialized");
    this.setupEventListeners();
    this.setupAuthModal();
    this.loadTheme();
    this.checkAuthentication();
  },

  setupEventListeners() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", this.toggleMobileMenu);
    }

    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", this.toggleTheme);
    }
  },

  toggleMobileMenu() {
    const navLinks = document.querySelector(".nav-links");
    if (navLinks) {
      navLinks.classList.toggle("active");
    }
  },

  toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode")
      ? "dark"
      : "light";
    localStorage.setItem("theme", theme);
  },

  loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") document.body.classList.add("dark-mode");
  },

  checkAuthentication() {
    const publicPages = ["index.html", "signup.html", ""];
    const currentPage = window.location.pathname.split("/").pop();

    // If Auth exists and user not logged in, redirect (Auth may be loaded after App; safe-guard)
    try {
      if (
        !publicPages.includes(currentPage) &&
        typeof Auth !== "undefined" &&
        !Auth.isLoggedIn()
      ) {
        window.location.href = "index.html#signup";
      }
    } catch (e) {
      // If Auth not available yet, do nothing — dashboard script will guard itself too
      console.warn("Auth check skipped (Auth not ready)", e);
    }
  },

  setupAuthModal() {
    const modal = document.getElementById("authModal");
    if (!modal) return;

    const openers = document.querySelectorAll("[data-auth-open]");
    const closeBtn = modal.querySelector("[data-auth-close]");

    const openModal = (e) => {
      if (e) e.preventDefault();
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    };

    const closeModal = () => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (window.location.hash === "#signup") {
        history.replaceState(null, "", window.location.pathname);
      }
    };

    openers.forEach((btn) => btn.addEventListener("click", openModal));
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    if (window.location.hash === "#signup") {
      openModal();
    }
  },
};

// Initialize app on DOM load
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
