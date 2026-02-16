/* ============================================
   AUTHENTICATION SYSTEM
   Secure Local Storage with Encryption
   ============================================ */

class AuthSystem {
  constructor() {
    this.storageKey = "studyplanner_user";
    this.sessionKey = "studyplanner_session";
    this.init();
  }

  init() {
    if (!localStorage.getItem("studyplanner_users")) {
      localStorage.setItem("studyplanner_users", JSON.stringify([]));
    }
  }

  encrypt(text) {
    return btoa(text);
  }

  decrypt(text) {
    return atob(text);
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  validatePassword(password) {
    if (password.length < 6) {
      return {
        valid: false,
        message: "Password must be at least 6 characters",
      };
    }
    return { valid: true };
  }

  async register(userData) {
    try {
      const { name, email, password } = userData;

      if (!name || !email || !password) {
        throw new Error("All fields are required");
      }

      if (!this.validateEmail(email)) {
        throw new Error("Invalid email address");
      }

      const passwordCheck = this.validatePassword(password);
      if (!passwordCheck.valid) {
        throw new Error(passwordCheck.message);
      }

      const users = JSON.parse(localStorage.getItem("studyplanner_users"));

      if (users.find((user) => user.email === email)) {
        throw new Error("User with this email already exists");
      }

      const newUser = {
        id: this.generateId(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: this.encrypt(password),
        createdAt: new Date().toISOString(),
        profile: {
          avatar: null,
          bio: "",
          university: "",
          major: "",
          year: "",
        },
        settings: {
          theme: "light",
          notifications: true,
          studyReminders: true,
        },
        stats: {
          totalStudyHours: 0,
          tasksCompleted: 0,
          currentStreak: 0,
          xp: 0,
          level: 1,
        },
      };

      users.push(newUser);
      localStorage.setItem("studyplanner_users", JSON.stringify(users));

      return {
        success: true,
        message: "Registration successful",
        user: this.sanitizeUser(newUser),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async login(email, password, remember = false) {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const users = JSON.parse(localStorage.getItem("studyplanner_users"));
      const user = users.find((u) => u.email === email.toLowerCase().trim());

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const decryptedPassword = this.decrypt(user.password);
      if (decryptedPassword !== password) {
        throw new Error("Invalid email or password");
      }

      user.lastLogin = new Date().toISOString();
      const userIndex = users.findIndex((u) => u.id === user.id);
      users[userIndex] = user;
      localStorage.setItem("studyplanner_users", JSON.stringify(users));

      const session = {
        userId: user.id,
        loginTime: new Date().toISOString(),
        remember: remember,
        expiresAt: remember
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      if (remember) {
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
      } else {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
      }

      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.sanitizeUser(user)),
      );

      return {
        success: true,
        message: "Login successful",
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.sessionKey);
    sessionStorage.removeItem(this.sessionKey);
    window.location.href = "index.html";
  }

  isLoggedIn() {
    const session = this.getSession();
    if (!session) return false;

    if (new Date(session.expiresAt) < new Date()) {
      this.logout();
      return false;
    }

    return true;
  }

  getSession() {
    let session = sessionStorage.getItem(this.sessionKey);
    if (!session) {
      session = localStorage.getItem(this.sessionKey);
    }
    return session ? JSON.parse(session) : null;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem(this.storageKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}

const Auth = new AuthSystem();

if (typeof module !== "undefined" && module.exports) {
  module.exports = Auth;
}