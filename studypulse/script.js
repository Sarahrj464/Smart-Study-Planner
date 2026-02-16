/**
 * StudyPulse - Single File Implementation
 * Architecture:
 * 1. Store: LocalStorage wrapper with reactivity
 * 2. Utils: Helpers for DOM, Date, etc.
 * 3. Views: Render functions for each page
 * 4. Controllers: Logic for specific features (Auth, Tasks, Pomodoro)
 */

// --- 1. STORE & STATE ---
const Store = {
    state: {
        theme: localStorage.getItem('theme') || 'dark', // Default dark
        currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
        users: JSON.parse(localStorage.getItem('users')) || [],
        tasks: JSON.parse(localStorage.getItem('tasks')) || [],
        moodLogs: JSON.parse(localStorage.getItem('moodLogs')) || [],
        settings: JSON.parse(localStorage.getItem('settings')) || {},
        filteredTasks: [], // For search/filter
        view: 'dashboard', // current view
        taskTab: 'all', // NEW: current task tab
        timerState: { timeLeft: 1500, isRunning: false, mode: 'focus' }, // 25 min default
        chatOpen: false
    },
    listeners: [],

    save() {
        localStorage.setItem('theme', this.state.theme);
        localStorage.setItem('users', JSON.stringify(this.state.users));
        localStorage.setItem('tasks', JSON.stringify(this.state.tasks));
        localStorage.setItem('moodLogs', JSON.stringify(this.state.moodLogs));
        if (this.state.currentUser) {
            // Update user inside users array
            const idx = this.state.users.findIndex(u => u.id === this.state.currentUser.id);
            if (idx !== -1) this.state.users[idx] = this.state.currentUser;
            localStorage.setItem('currentUser', JSON.stringify(this.state.currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    },

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.save();
        this.notify();
    },

    subscribe(fn) { this.listeners.push(fn); },
    notify() { this.listeners.forEach(fn => fn(this.state)); }
};

// --- 2. UTILS ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const html = (strings, ...values) => String.raw({ raw: strings }, ...values); // simple tag for syntax highlighting if supported

const Toast = {
    show(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        const colors = { info: 'var(--primary)', success: 'var(--success)', danger: 'var(--danger)', warning: 'var(--warning)' };
        toast.style.borderLeftColor = colors[type];
        toast.innerHTML = `<span style="font-size:1.2em">${type === 'success' ? '✅' : type === 'danger' ? '⚠️' : 'ℹ️'}</span> <span>${msg}</span>`;

        document.getElementById('toast-container').appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

const Modal = {
    show(content) {
        const container = document.getElementById('modal-container');
        container.innerHTML = `
            <div class="modal-overlay" onclick="if(event.target === this) Modal.close()">
                ${content}
            </div>
        `;
    },
    close() {
        document.getElementById('modal-container').innerHTML = '';
    }
};

const icon = (name) => {
    const icons = {
        dashboard: '🏠',
        calendar: '📅',
        tasks: '✅',
        timer: '⏱️',
        settings: '⚙️'
    };
    return `<i>${icons[name] || '•'}</i>`;
};

// --- 3. CONTROLLERS ---

const Auth = {
    login(email, password) {
        const user = Store.state.users.find(u => u.email === email && u.password === password);
        if (user) {
            Store.setState({ currentUser: user, view: 'dashboard' });
            Toast.show(`Welcome back, ${user.name}!`, 'success');
            Modal.close();
        } else {
            Toast.show('Invalid credentials', 'danger');
        }
    },
    signup(name, email, password) {
        if (Store.state.users.some(u => u.email === email)) {
            Toast.show('Email already registered', 'danger');
            return;
        }
        const newUser = {
            id: Date.now(), name, email, password,
            xp: 0, level: 1, joinDate: new Date().toISOString()
        };
        const newUsers = [...Store.state.users, newUser];
        Store.state.users = newUsers; // Set directly to avoid overwrite
        Store.setState({ currentUser: newUser, view: 'dashboard' });
        Toast.show('Account created! Welcome!', 'success');
        Modal.close();
    },
    logout() {
        Store.setState({ currentUser: null, view: 'landing' });
        Toast.show('Logged out successfully', 'info');
        Modal.close();
    }
};

const Gamification = {
    addXP(amount) {
        if (!Store.state.currentUser) return;
        const user = Store.state.currentUser;
        user.xp += amount;

        // Level Thresholds
        // L1: 0-199, L2: 200, L3: 500, L4: 1000, L5: 2000
        let newLevel = 1;
        if (user.xp >= 2000) newLevel = 5;
        else if (user.xp >= 1000) newLevel = 4;
        else if (user.xp >= 500) newLevel = 3;
        else if (user.xp >= 200) newLevel = 2;

        if (newLevel > user.level) {
            user.level = newLevel;
            // Celebration Modal
            Modal.show(`
                <div class="modal-confirm bg-card rounded p-12 text-center" style="max-width:500px">
                    <div style="font-size:5rem; margin-bottom:1rem; animation: pulse 1s infinite;">🎉</div>
                    <h2 class="text-2xl font-bold mb-2 text-primary">Level Up!</h2>
                    <p class="text-xl mb-6">You reached <span class="text-accent font-bold">Level ${newLevel}</span></p>
                    <div style="background:var(--bg); padding:1rem; border-radius:0.5rem; margin-bottom:2rem;">
                        <p class="text-muted text-sm">Next Level at ${newLevel === 2 ? 500 : newLevel === 3 ? 1000 : newLevel === 4 ? 2000 : 'MAX'} XP</p>
                    </div>
                    <button onclick="Modal.close()" class="btn btn-primary w-full">Awesome!</button>
                </div>
            `);
            Store.state.confetti = true;
            // setTimeout(() => Store.setState({confetti:false}), 5000);
        } else {
            Toast.show(`+${amount} XP`, 'success');
        }
        Store.save();
        Store.notify(); // Update UI
    }
};

let timerInterval;
const Pomodoro = {
    toggle() {
        const { isRunning } = Store.state.timerState;
        if (isRunning) {
            clearInterval(timerInterval);
            Store.setState({ timerState: { ...Store.state.timerState, isRunning: false } });
        } else {
            Store.setState({ timerState: { ...Store.state.timerState, isRunning: true } });
            timerInterval = setInterval(() => {
                const { timeLeft, mode } = Store.state.timerState;
                if (timeLeft > 0) {
                    Store.setState({ timerState: { ...Store.state.timerState, timeLeft: timeLeft - 1 } });
                } else {
                    clearInterval(timerInterval);
                    Store.setState({ timerState: { ...Store.state.timerState, isRunning: false, timeLeft: mode === 'focus' ? 300 : 1500, mode: mode === 'focus' ? 'break' : 'focus' } });
                    this.completeSession();
                }
            }, 1000);
        }
    },
    reset() {
        clearInterval(timerInterval);
        Store.setState({ timerState: { timeLeft: 1500, isRunning: false, mode: 'focus' } });
    },
    completeSession() {
        // Audio beep could go here
        Gamification.addXP(50);
        Toast.show("Session Complete! Take a break.", 'success');
        Modal.show(`
            <div class="modal-confirm bg-card rounded text-center">
                <div style="font-size:3rem; margin-bottom:1rem;">☕</div>
                <h3 class="font-bold mb-2">Focus Session Complete!</h3>
                <p class="text-muted mb-6">You've earned 50 XP. Time to recharge.</p>
                <button onclick="Modal.close()" class="btn btn-primary">Continue</button>
            </div>
        `);
    }
};

// --- 4. VIEWS ---

const renderNavbar = (user, theme) => `
    <nav class="navbar">
        <div class="logo-area" onclick="Store.setState({view: user ? 'dashboard' : 'landing'})">
            <!-- <div class="logo-circle">SP</div> -->
             <img src="../assets/logo.png" alt="StudyPulse Logo" style="height: 40px; width: auto;"> 
            <span class="brand-name text-gradient">StudyPulse</span>
        </div>
        <div class="flex items-center gap-4">
            <button class="btn btn-icon" onclick="Store.setState({theme: '${theme === 'dark' ? 'light' : 'dark'}'})">
                ${theme === 'dark' ? '☀️' : '🌙'}
            </button>
            ${user ? `
            <div class="flex items-center gap-3 cursor-pointer" onclick="Store.setState({view:'dashboard'})">
                <div class="text-right hidden sm:block">
                    <div class="text-sm font-bold">${user.name}</div>
                    <div class="text-xs text-muted">Lvl ${user.level} Scholar</div>
                </div>
                <div class="logo-circle" style="width:35px;height:35px;font-size:1rem;">${user.name.charAt(0)}</div>
            </div>
            ` : `
            <button onclick="window.showAuth('signin')" class="btn btn-outline text-sm">Sign In</button>
            <button onclick="window.showAuth('signup')" class="btn btn-primary text-sm">Get Started</button>
            `}
        </div>
    </nav>
`;

const renderLanding = () => `
    <div class="landing-page">
        <section class="hero">
            <div class="container" style="max-width:1200px; margin:0 auto; padding:0 2rem;">
               <div style="display:inline-block; padding:0.5rem 1rem; background:rgba(45,126,247,0.1); color:var(--primary); border-radius:2rem; font-size:0.9rem; font-weight:600; margin-bottom:2rem;">
                    ✨ V2.0 is here: Now with AI & Gamification
                </div>
                <h1 class="hero-title">
                    Master Your Studies.<br>
                    <span class="text-gradient">Own Your Future.</span>
                </h1>
                <p class="hero-subtitle">
                    The all-in-one workspace for students. Manage tasks, track exams, 
                    stay focused with Pomodoro, and gamify your learning journey.
                </p>
                <div class="flex gap-4 justify-center">
                    <button onclick="window.showAuth('signup')" class="btn btn-primary" style="padding:1rem 2.5rem; font-size:1.1rem;">Get Started Free</button>
                    <button class="btn btn-outline" style="padding:1rem 2.5rem; font-size:1.1rem;">View Demo</button>
                </div>

                <div class="feature-grid">
                    <div class="card text-center">
                        <div style="font-size:2.5rem; margin-bottom:1rem;">🤖</div>
                        <h3 class="font-bold mb-2">AI Tutor</h3>
                        <p class="text-muted text-sm">Instant answers and study guides powered by Kai AI.</p>
                    </div>
                    <div class="card text-center">
                        <div style="font-size:2.5rem; margin-bottom:1rem;">🎮</div>
                        <h3 class="font-bold mb-2">Gamified Learning</h3>
                        <p class="text-muted text-sm">Earn XP, level up, and compete on the leaderboard.</p>
                    </div>
                    <div class="card text-center">
                        <div style="font-size:2.5rem; margin-bottom:1rem;">⚡</div>
                        <h3 class="font-bold mb-2">Offline First</h3>
                        <p class="text-muted text-sm">Study anywhere, anytime. No internet required.</p>
                    </div>
                       <div class="card text-center">
                        <div style="font-size:2.5rem; margin-bottom:1rem;">🧠</div>
                        <h3 class="font-bold mb-2">Mental Wellness</h3>
                        <p class="text-muted text-sm">Track your mood and stay balanced.</p>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Problem/Solution Section Mockup -->
        <section style="padding: 4rem 2rem; background: var(--bg);">
            <div style="max-width:1000px; margin:0 auto; display:grid; grid-template-columns: 1fr 1fr; gap:4rem; align-items:center;">
                <div>
                    <h2 class="text-3xl font-bold mb-4">Stop juggling multiple apps.</h2>
                    <p class="text-muted mb-6">Calendar, To-Do list, Timer, Notes... it's a mess. StudyPulse brings everything into one cohesive ecosystem designed for students.</p>
                    <ul class="text-muted">
                        <li class="mb-2">✅ Integrated Task & Exam tracking</li>
                        <li class="mb-2">✅ Distraction-free Focus Timer</li>
                        <li class="mb-2">✅ Smart Class Scheduling</li>
                    </ul>
                </div>
                <div class="card" style="height:300px; background: linear-gradient(135deg, #111827 0%, #1F2937 100%); display:flex; align-items:center; justify-content:center;">
                    <span class="text-muted">App Screenshot Mockup</span>
                </div>
            </div>
        </section>

        <!-- Pricing -->
        <section style="padding: 6rem 2rem; text-align:center;">
             <h2 class="text-3xl font-bold mb-12">Simple, Transparent Pricing</h2>
             <div class="flex justify-center gap-6 flex-wrap">
                <div class="card" style="width:300px; text-align:left;">
                    <h3 class="font-bold text-xl">Free</h3>
                    <p class="text-muted mb-4">For getting started</p>
                    <div class="text-3xl font-bold mb-6">$0<span class="text-sm font-normal text-muted">/mo</span></div>
                    <button class="btn btn-outline w-full mb-6">Join Now</button>
                    <ul class="text-sm text-muted">
                        <li class="mb-2">✓ Unlimited Tasks</li>
                        <li class="mb-2">✓ Basic Pomodoro</li>
                        <li class="mb-2">✓ 5 AI Chats / day</li>
                    </ul>
                </div>
                <div class="card" style="width:300px; text-align:left; border: 2px solid var(--primary); transform:scale(1.05);">
                    <div style="background:var(--primary); color:white; padding:0.2rem 0.5rem; font-size:0.8rem; border-radius:1rem; display:inline-block; margin-bottom:0.5rem;">Most Popular</div>
                    <h3 class="font-bold text-xl">Pro Scholar</h3>
                    <p class="text-muted mb-4">For serious students</p>
                    <div class="text-3xl font-bold mb-6">$4<span class="text-sm font-normal text-muted">/mo</span></div>
                    <button class="btn btn-primary w-full mb-6">Start Trial</button>
                    <ul class="text-sm text-muted">
                        <li class="mb-2">✓ Everything in Free</li>
                        <li class="mb-2">✓ Unlimited AI Tutor</li>
                        <li class="mb-2">✓ Advanced Analytics</li>
                        <li class="mb-2">✓ Cloud Sync (Coming Soon)</li>
                    </ul>
                </div>
             </div>
        </section>

        <footer style="padding: 4rem 2rem; border-top: 1px solid var(--border); text-align:center; color: var(--text-muted);">
            <div class="mb-4">
                <span class="font-bold text-primary">StudyPulse</span> &copy; 2026
            </div>
            <div class="flex justify-center gap-6 text-sm">
                <a>Privacy</a>
                <a>Terms</a>
                <a>Contact</a>
                <a>Twitter</a>
            </div>
        </footer>
    </div>
`;

const renderDashboard = (currentUser, tasks) => {
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const completedTasks = tasks.filter(t => t.completed).length;

    return `
    <div class="page-section">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
            <div class="flex items-center gap-4">
                <div class="logo-circle" style="width:50px;height:50px;font-size:1.5rem;box-shadow:0 10px 20px rgba(0,0,0,0.1);">${currentUser.name.charAt(0)}</div>
                <div>
                    <h2 class="text-2xl font-bold">Good Morning, ${currentUser.name.split(' ')[0]}!</h2>
                    <p class="text-muted">Ready to conquer the day? 🚀</p>
                </div>
            </div>
            <div class="text-right hidden sm:block">
                <div class="text-2xl font-bold">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div class="text-sm text-muted">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            </div>
        </div>

        <!-- Stats Grid (Pastel) -->
        <div class="stats-grid mb-8">
            <div class="stat-card" style="background:var(--card-bg); border-left:4px solid #FFAB91;">
                <div class="flex justify-between items-start">
                     <div>
                        <h4 class="text-muted text-xs uppercase font-bold text-accent">Pending</h4>
                        <div class="stat-value text-accent">${pendingTasks}</div>
                     </div>
                     <div style="background:#FFAB91; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:0.8rem;">📝</div>
                </div>
            </div>
             <div class="stat-card" style="background:var(--card-bg); border-left:4px solid #82DE89;">
                <div class="flex justify-between items-start">
                     <div>
                        <h4 class="text-muted text-xs uppercase font-bold text-success">Finished</h4>
                        <div class="stat-value text-success">${completedTasks}</div>
                     </div>
                     <div style="background:#82DE89; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:0.8rem;">✅</div>
                </div>
            </div>
             <div class="stat-card" style="background:var(--card-bg); border-left:4px solid #81D4FA;">
                <div class="flex justify-between items-start">
                     <div>
                        <h4 class="text-muted text-xs uppercase font-bold text-primary">Level</h4>
                        <div class="stat-value text-primary">${currentUser.level}</div>
                     </div>
                     <div style="background:#81D4FA; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:0.8rem;">⭐</div>
                </div>
            </div>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
             <!-- AI Insight -->
             <div class="card md:col-span-2 relative overflow-hidden">
                <div style="position:absolute; top:-10px; right:-10px; width:100px; height:100px; background:var(--primary); opacity:0.1; border-radius:50%;"></div>
                <h3 class="font-bold mb-4 flex items-center gap-2">🤖 AI Insight</h3>
                <p class="text-muted italic">"Based on your history, you are most productive between 10 AM and 2 PM. Try scheduling your Calculus study block then!"</p>
                <button class="btn btn-outline btn-sm mt-4 text-xs">Ask Kai for more</button>
             </div>

             <!-- Quick Actions -->
             <div class="card flex flex-col justify-center gap-3">
                <button class="btn btn-primary w-full" onclick="window.addTask()">+ Add Task</button>
                <button class="btn btn-outline w-full" onclick="Store.setState({view:'focus'})">Start Focus</button>
             </div>
        </div>

        <!-- Recent Tasks -->
        <div class="mt-8">
             <h3 class="font-bold mb-4 text-lg">Up Next</h3>
             <div class="card p-0 overflow-hidden">
                ${tasks.slice(0, 3).map(t => `
                    <div class="task-item" style="border-bottom:1px solid var(--border)">
                         <div class="flex items-center gap-3">
                            <div class="task-check ${t.completed ? 'checked' : ''}" onclick="window.toggleTask(${t.id})"></div>
                            <span>${t.title}</span>
                         </div>
                         <span class="text-xs text-muted">Today</span>
                    </div>
                `).join('')}
                ${tasks.length === 0 ? '<div class="p-4 text-center text-muted">No tasks yet. Add one!</div>' : ''}
                <div class="p-2 text-center bg-input cursor-pointer hover:opacity-80 transition" onclick="Store.setState({view:'tasks'})">
                    <span class="text-xs font-bold text-primary">View All Tasks -></span>
                </div>
             </div>
        </div>
    </div>
    `;
};

const renderFocus = ({ timeLeft, isRunning, mode }) => {
    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');
    const progress = (timeLeft / (mode === 'focus' ? 1500 : 300)) * 880;

    return `
    <div class="page-section flex flex-col items-center justify-center" style="min-height: 80vh;">
        <div class="mb-8 text-center">
            <h2 class="text-3xl font-bold mb-2">${mode === 'focus' ? 'Focus Mode' : 'Break Time'}</h2>
            <p class="text-muted">${mode === 'focus' ? 'Stay distracted free for 25 minutes.' : 'Relax and recharge.'}</p>
        </div>
        
        <div class="timer-ring">
            <svg class="timer-svg">
                <circle cx="150" cy="150" r="140" class="timer-circle-bg" />
                <circle cx="150" cy="150" r="140" class="timer-circle-fg" style="stroke-dashoffset: ${880 - progress}; stroke: ${mode === 'focus' ? 'var(--primary)' : 'var(--success)'}" />
            </svg>
            <div class="timer-text">${mins}:${secs}</div>
        </div>

        <div class="flex gap-6 mt-12">
            <button class="btn btn-outline btn-icon" style="width:60px; height:60px; font-size:1.5rem;" onclick="Pomodoro.reset()">↺</button>
            <button class="btn btn-primary btn-icon" style="width:80px; height:80px; font-size:2rem; box-shadow: 0 10px 30px rgba(45,126,247,0.4);" onclick="Pomodoro.toggle()">
                ${isRunning ? '⏸' : '▶'}
            </button>
            <button class="btn btn-outline btn-icon" style="width:60px; height:60px; font-size:1.5rem;" onclick="window.toggleMic()">mic</button>
        </div>
    </div>
    `;
};

const renderCalendar = () => `
    <div class="page-section">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Calendar</h2>
            <div class="flex gap-2">
                <button class="btn btn-outline text-sm">Day</button>
                <button class="btn btn-outline text-sm">Week</button>
                <button class="btn btn-primary text-sm">Month</button>
            </div>
        </div>
        <!-- Mock Calendar Grid -->
        <div class="card p-0 overflow-hidden">
            <div class="grid grid-cols-7 text-center border-bottom text-sm font-bold bg-muted p-2" style="border-bottom:1px solid var(--border)">
                 <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
            </div>
            <div class="grid grid-cols-7" style="min-height:400px;">
                ${Array(35).fill(0).map((_, i) => `
                    <div style="border:1px solid var(--border); border-top:none; border-left:none; padding:0.5rem; min-height:80px; position:relative;">
                        <span class="text-sm text-muted">${i + 1 <= 31 ? i + 1 : ''}</span>
                        ${i === 4 ? '<div style="background:rgba(45,126,247,0.2); color:var(--primary); font-size:0.7rem; padding:2px 4px; border-radius:4px; margin-top:4px;">Math Class</div>' : ''}
                        ${i === 12 ? '<div style="background:rgba(255,71,87,0.2); color:var(--danger); font-size:0.7rem; padding:2px 4px; border-radius:4px; margin-top:4px;">Exam</div>' : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
`;

const renderClasses = () => `
    <div class="page-section">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Classes</h2>
            <button class="btn btn-primary">+ Add Class</button>
        </div>
        <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
            <div class="card" style="border-left: 5px solid var(--primary);">
                <h3 class="font-bold">Computer Science</h3>
                <p class="text-muted text-sm mb-4">Room 304 • Prof. Smith</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-xs bg-input rounded px-2 py-1">Mon, Wed 10:00 AM</span>
                </div>
            </div>
            <div class="card" style="border-left: 5px solid var(--danger);">
                <h3 class="font-bold">Calculus II</h3>
                <p class="text-muted text-sm mb-4">Room 102 • Dr. Johnson</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-xs bg-input rounded px-2 py-1">Tue, Thu 2:00 PM</span>
                </div>
            </div>
        </div>
    </div>
`;

const renderExams = () => `
    <div class="page-section">
         <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Exams</h2>
            <button class="btn btn-primary">+ Add Exam</button>
        </div>
        <div class="card">
            <div class="task-item">
                <div class="flex items-center gap-3">
                    <div class="text-2xl">📅</div>
                    <div>
                        <h4 class="font-bold">Midterm: Calculus</h4>
                        <p class="text-sm text-danger">Due in 3 days</p>
                    </div>
                </div>
                <button class="btn btn-outline text-sm">Edit</button>
            </div>
        </div>
    </div>
`;


const renderTasks = (tasks) => {
    const tab = Store.state.taskTab || 'all';
    const filtered = tab === 'all' ? tasks : tasks.filter(t => t.tag === tab);

    return `
        <div class="page-section">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">My Tasks</h2>
                <button onclick="window.addTask()" class="btn btn-primary">+ New Task</button>
            </div>
            
            <!-- Tabs -->
            <div class="flex gap-4 mb-6 border-b border-border pb-2 overflow-x-auto">
                <button onclick="Store.setState({taskTab:'all'})" class="pb-2 ${tab === 'all' ? 'text-primary font-bold border-b-2 border-primary' : 'text-muted hover:text-primary'}">All Tasks</button>
                <button onclick="Store.setState({taskTab:'school'})" class="pb-2 ${tab === 'school' ? 'text-primary font-bold border-b-2 border-primary' : 'text-muted hover:text-primary'}">School</button>
                <button onclick="Store.setState({taskTab:'personal'})" class="pb-2 ${tab === 'personal' ? 'text-primary font-bold border-b-2 border-primary' : 'text-muted hover:text-primary'}">Personal</button>
                <button onclick="Store.setState({taskTab:'work'})" class="pb-2 ${tab === 'work' ? 'text-primary font-bold border-b-2 border-primary' : 'text-muted hover:text-primary'}">Work</button>
            </div>

            <div class="card">
                 ${filtered.length === 0 ? `
                    <div class="text-center py-12">
                        <div style="font-size:3rem; margin-bottom:1rem; opacity:0.5;">📝</div>
                        <h3 class="font-bold text-lg mb-2">No tasks found</h3>
                        <p class="text-muted">You're all caught up in "${tab}"! Enjoy.</p>
                    </div>
                 ` : `
                     <div class="task-list">
                        ${filtered.map(t => `
                            <div class="task-item">
                                <div class="flex items-center gap-3">
                                    <div class="task-check ${t.completed ? 'checked' : ''}" onclick="window.toggleTask(${t.id})"></div>
                                    <div class="flex-1">
                                         <span style="${t.completed ? 'text-decoration:line-through;opacity:0.5' : ''} display:block;">${t.title}</span>
                                         ${t.tag ? `<span class="text-xs bg-input px-2 py-0.5 rounded text-muted mt-1 inline-block uppercase" style="font-size:0.6rem;">${t.tag}</span>` : ''}
                                    </div>
                                </div>
                                <button onclick="window.deleteTask(${t.id})" class="text-muted text-sm hover:text-danger">✖</button>
                            </div>
                        `).join('')}
                    </div>
                 `}
            </div>
        </div>
     `;
};

const renderMentalHealth = () => `
    <div class="page-section">
        <h2 class="text-xl font-bold mb-6">Mental Wellness</h2>
        <div class="grid gap-6 md:grid-cols-2">
            <div class="card">
                <h3 class="font-bold mb-4">How are you feeling?</h3>
                <div class="flex justify-between text-4xl py-4">
                    <button onclick="window.logMood('great')" class="btn-icon hover:scale-110 transition-transform">😄</button>
                    <button onclick="window.logMood('good')" class="btn-icon hover:scale-110 transition-transform">🙂</button>
                    <button onclick="window.logMood('meh')" class="btn-icon hover:scale-110 transition-transform">😐</button>
                    <button onclick="window.logMood('bad')" class="btn-icon hover:scale-110 transition-transform">😫</button>
                </div>
                <p class="text-center text-sm text-muted mt-2">Log your mood to track trends.</p>
            </div>
            <div class="card bg-primary text-white">
                <h3 class="font-bold mb-2">Daily Affirmation</h3>
                <p class="text-lg italic opacity-90">"You are capable of amazing things. Take it one step at a time."</p>
            </div>
        </div>
         <h3 class="font-bold mt-8 mb-4">Recent Logs</h3>
         <div class="card">
            ${Store.state.moodLogs && Store.state.moodLogs.length ? Store.state.moodLogs.slice(0, 5).map(m => `
                <div class="flex justify-between items-center border-b border-border py-2 last:border-0">
                    <span>${m.mood === 'great' ? '😄 Great' : m.mood === 'good' ? '🙂 Good' : m.mood === 'meh' ? '😐 Meh' : '😫 Bad'}</span>
                    <span class="text-sm text-muted">${new Date(m.date).toLocaleDateString()}</span>
                </div>
            `).join('') : '<p class="text-muted text-center">No logs yet.</p>'}
         </div>
    </div>
`;

const renderAuthModal = (mode) => {
    const isSignup = mode === 'signup';
    return `
        <div class="modal-content modal-auth">
            <div class="modal-left">
                <h2 class="text-xl font-bold mb-4">${isSignup ? 'Join StudyPulse' : 'Welcome Back'}</h2>
                <p style="opacity:0.9; line-height:1.6;">Anything to stay on track. Manage your classes, tasks, exams and more. All in one place.</p>
            </div>
            <div class="modal-right">
                <h2 class="text-xl font-bold mb-6">${isSignup ? 'Create Account' : 'Sign In'}</h2>
                <form onsubmit="event.preventDefault(); window.handleAuthSubmit('${mode}', this)">
                    ${isSignup ? `
                    <div class="input-group">
                        <label class="input-label">Full Name</label>
                        <input name="name" class="form-input" required placeholder="John Doe">
                    </div>` : ''}
                    <div class="input-group">
                        <label class="input-label">Email</label>
                        <input type="email" name="email" class="form-input" required placeholder="student@example.com">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Password</label>
                        <input type="password" name="password" class="form-input" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn btn-primary w-full mt-4">${isSignup ? 'Create Account' : 'Sign In'}</button>
                </form>
                <p class="text-center mt-4 text-sm text-muted">
                    ${isSignup ? 'Already have an account?' : 'Don\'t have an account?'} 
                    <a onclick="window.showAuth('${isSignup ? 'signin' : 'signup'}')" class="text-primary font-bold cursor-pointer">
                        ${isSignup ? 'Sign In' : 'Sign Up'}
                    </a>
                </p>
            </div>
        </div>
    `;
};

// --- 5. APP INIT & RENDER ---
const render = (state) => {
    const app = $('#app');
    document.documentElement.className = state.theme === 'dark' ? '' : 'light-mode';

    // Layout Wrapper
    const layout = `
        ${renderNavbar(state.currentUser, state.theme)}
        ${state.currentUser ? `
            <div class="app-layout">
                <aside class="sidebar">
                    <div class="nav-item ${state.view === 'dashboard' ? 'active' : ''}" onclick="Store.setState({view:'dashboard'})">
                        ${icon('dashboard')} <span>Dashboard</span>
                    </div>
                    <div class="nav-item ${state.view === 'calendar' ? 'active' : ''}" onclick="Store.setState({view:'calendar'})">
                        ${icon('calendar')} <span>Calendar</span>
                    </div>
                    <div class="nav-item ${state.view === 'tasks' ? 'active' : ''}" onclick="Store.setState({view:'tasks'})">
                        ${icon('tasks')} <span>Activities</span>
                    </div>
                    <div class="nav-item pl-8 text-sm" onclick="Store.setState({view:'tasks'})">
                        <span>• Tasks</span>
                    </div>
                     <div class="nav-item pl-8 text-sm" onclick="Store.setState({view:'classes'})">
                        <span>• Classes</span>
                    </div>
                    <div class="nav-item pl-8 text-sm" onclick="Store.setState({view:'exams'})">
                        <span>• Exams</span>
                    </div>
                    <div class="nav-item ${state.view === 'focus' ? 'active' : ''}" onclick="Store.setState({view:'focus'})">
                        ${icon('timer')} <span>Focus Timer</span>
                    </div>
                    
                    <!-- Premium CTA -->
                    <div style="margin: 1rem 0.5rem; padding: 1rem; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 0.5rem; color: white; text-align: center;">
                        <h4 class="font-bold text-sm mb-2">Try Premium Free</h4>
                        <p class="text-xs opacity-80 mb-3">Unlock unlimited tasks & AI</p>
                        <button class="btn btn-outline text-xs w-full" style="border-color:white; color:white;">Upgrade</button>
                    </div>

                    <div style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border)">
                        <div class="nav-item" onclick="window.confirmLogout()">
                            <i>🚪</i> <span>Logout</span>
                        </div>
                    </div>
                </aside>
                <main class="main-content">
                    ${state.view === 'dashboard' ? renderDashboard(state.currentUser, state.tasks) : ''}
                    ${state.view === 'focus' ? renderFocus(state.timerState) : ''}
                    ${state.view === 'calendar' ? renderCalendar() : ''}
                    ${state.view === 'classes' ? renderClasses() : ''}
                    ${state.view === 'exams' ? renderExams() : ''}
                    ${state.view === 'tasks' ? renderTasks(state.tasks) : ''}
                    ${state.view === 'wellness' ? renderMentalHealth() : ''}
                </main>
                <!-- Kai Chatbot -->
                <div class="chatbot-btn" onclick="Store.setState({chatOpen: !Store.state.chatOpen})">🤖</div>
                ${state.chatOpen ? `
                    <div class="chat-panel">
                        <div class="chat-header">
                            <span>Kai | AI Assistant</span>
                            <span style="cursor:pointer" onclick="Store.setState({chatOpen:false})">✖</span>
                        </div>
                        <div class="chat-messages">
                            <div class="chat-msg bot">Hi ${state.currentUser.name.split(' ')[0]}! I'm Kai. How can I help you study today?</div>
                        </div>
                        <div class="chat-input-area">
                            <input type="text" class="form-input" placeholder="Ask a question..." style="padding:0.5rem;">
                            <button class="btn btn-primary btn-icon">➤</button>
                        </div>
                    </div>
                ` : ''}
            </div>
        ` : renderLanding()}
    `;

    app.innerHTML = layout;
};

// --- 6. EVENT BINDINGS (Window Global) ---
window.showAuth = (mode) => {
    Modal.show(renderAuthModal(mode));
};

window.handleAuthSubmit = (mode, form) => {
    const formData = new FormData(form);
    if (mode === 'signup') Auth.signup(formData.get('name'), formData.get('email'), formData.get('password'));
    else Auth.login(formData.get('email'), formData.get('password'));
};

window.addTask = () => {
    Modal.show(`
        <div class="modal-content">
            <h2 class="text-xl font-bold mb-4">Add New Task</h2>
            <form onsubmit="event.preventDefault(); window.handleTaskSubmit(this)">
                <div class="input-group">
                    <label class="input-label">Title</label>
                    <input name="title" class="form-input" required placeholder="Study Math...">
                </div>
                <div class="input-group">
                    <label class="input-label">Tag</label>
                    <select name="tag" class="form-input">
                        <option value="school">School</option>
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                    </select>
                </div>
                <div class="flex gap-4 mt-6">
                    <button type="button" onclick="Modal.close()" class="btn btn-outline flex-1">Cancel</button>
                    <button type="submit" class="btn btn-primary flex-1">Add Task</button>
                </div>
            </form>
        </div>
    `);
};

window.handleTaskSubmit = (form) => {
    const newTask = {
        id: Date.now(),
        title: form.title.value,
        tag: form.tag.value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    Store.setState({ tasks: [...Store.state.tasks, newTask] });
    Gamification.addXP(10);
    Toast.show('Task added!', 'success');
    Modal.close();
};

window.deleteTask = (id) => {
    if (confirm("Delete task?")) {
        Store.setState({ tasks: Store.state.tasks.filter(t => t.id !== id) });
    }
};

window.toggleTask = (id) => {
    const tasks = [...Store.state.tasks];
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    Store.setState({ tasks });
    if (task.completed) Gamification.addXP(25);
};

window.logMood = (mood) => {
    const log = { date: new Date().toISOString(), mood };
    Store.setState({ moodLogs: [log, ...Store.state.moodLogs] });
    Toast.show('Mood logged. Keep it up!', 'success');
    Gamification.addXP(5);
};

window.confirmLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
        Auth.logout();
    }
};

window.toggleMic = () => {
    // Simulated voice command
    Store.setState({ isMicListening: true });
    Toast.show('Listening... (Try "Go to tasks")', 'info');
    setTimeout(() => {
        Store.setState({ isMicListening: false });
        Toast.show('Command recognized: "Go to tasks"', 'success');
        Store.setState({ view: 'tasks' });
    }, 2000);
};

// --- INIT ---
Store.subscribe(render);
render(Store.state); // First Render
