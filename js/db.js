/* ============================================
   DATABASE MANAGEMENT SYSTEM
   IndexedDB for Offline-First Storage
   ============================================ */

class DatabaseManager {
    constructor() {
        this.dbName = 'StudyPlannerDB';
        this.version = 1;
        this.db = null;
        this.init();
    }

    // Initialize database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('Database failed to open');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database initialized successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;

                // Create object stores
                this.createObjectStores();
            };
        });
    }

    // Create all object stores
    createObjectStores() {
        // Tasks/Assignments store
        if (!this.db.objectStoreNames.contains('tasks')) {
            const taskStore = this.db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
            taskStore.createIndex('userId', 'userId', { unique: false });
            taskStore.createIndex('dueDate', 'dueDate', { unique: false });
            taskStore.createIndex('priority', 'priority', { unique: false });
            taskStore.createIndex('status', 'status', { unique: false });
            taskStore.createIndex('subject', 'subject', { unique: false });
        }

        // Subjects store
        if (!this.db.objectStoreNames.contains('subjects')) {
            const subjectStore = this.db.createObjectStore('subjects', { keyPath: 'id', autoIncrement: true });
            subjectStore.createIndex('userId', 'userId', { unique: false });
            subjectStore.createIndex('name', 'name', { unique: false });
        }

        // Schedule/Timetable store
        if (!this.db.objectStoreNames.contains('schedule')) {
            const scheduleStore = this.db.createObjectStore('schedule', { keyPath: 'id', autoIncrement: true });
            scheduleStore.createIndex('userId', 'userId', { unique: false });
            scheduleStore.createIndex('day', 'day', { unique: false });
            scheduleStore.createIndex('subject', 'subject', { unique: false });
        }

        // Study sessions store
        if (!this.db.objectStoreNames.contains('studySessions')) {
            const sessionStore = this.db.createObjectStore('studySessions', { keyPath: 'id', autoIncrement: true });
            sessionStore.createIndex('userId', 'userId', { unique: false });
            sessionStore.createIndex('date', 'date', { unique: false });
            sessionStore.createIndex('subject', 'subject', { unique: false });
        }

        // Notes store
        if (!this.db.objectStoreNames.contains('notes')) {
            const notesStore = this.db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
            notesStore.createIndex('userId', 'userId', { unique: false });
            notesStore.createIndex('subject', 'subject', { unique: false });
            notesStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Exams store
        if (!this.db.objectStoreNames.contains('exams')) {
            const examsStore = this.db.createObjectStore('exams', { keyPath: 'id', autoIncrement: true });
            examsStore.createIndex('userId', 'userId', { unique: false });
            examsStore.createIndex('date', 'date', { unique: false });
            examsStore.createIndex('subject', 'subject', { unique: false });
        }

        // Goals store
        if (!this.db.objectStoreNames.contains('goals')) {
            const goalsStore = this.db.createObjectStore('goals', { keyPath: 'id', autoIncrement: true });
            goalsStore.createIndex('userId', 'userId', { unique: false });
            goalsStore.createIndex('deadline', 'deadline', { unique: false });
            goalsStore.createIndex('status', 'status', { unique: false });
        }
    }

    // Generic add method
    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            // Add userId and timestamps
            const currentUser = Auth.getCurrentUser();
            const record = {
                ...data,
                userId: currentUser.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const request = store.add(record);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Generic get method
    async get(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Generic getAll method
    async getAll(storeName, indexName = null, value = null) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            
            let request;
            if (indexName && value) {
                const index = store.index(indexName);
                request = index.getAll(value);
            } else {
                request = store.getAll();
            }

            request.onsuccess = () => {
                // Filter by current user
                const currentUser = Auth.getCurrentUser();
                const results = request.result.filter(item => item.userId === currentUser.id);
                resolve(results);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Generic update method
    async update(storeName, id, updates) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const data = getRequest.result;
                if (!data) {
                    reject(new Error('Record not found'));
                    return;
                }

                const updatedData = {
                    ...data,
                    ...updates,
                    updatedAt: new Date().toISOString()
                };

                const updateRequest = store.put(updatedData);

                updateRequest.onsuccess = () => {
                    resolve(updatedData);
                };

                updateRequest.onerror = () => {
                    reject(updateRequest.error);
                };
            };

            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        });
    }

    // Generic delete method
    async delete(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Task-specific methods
    async addTask(task) {
        return this.add('tasks', task);
    }

    async getTasks(status = null) {
        const tasks = await this.getAll('tasks');
        if (status) {
            return tasks.filter(task => task.status === status);
        }
        return tasks;
    }

    async updateTask(id, updates) {
        return this.update('tasks', id, updates);
    }

    async deleteTask(id) {
        return this.delete('tasks', id);
    }

    async getTasksDueThisWeek() {
        const tasks = await this.getTasks();
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return tasks.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate >= now && dueDate <= weekFromNow;
        });
    }

    // Subject-specific methods
    async addSubject(subject) {
        return this.add('subjects', subject);
    }

    async getSubjects() {
        return this.getAll('subjects');
    }

    async updateSubject(id, updates) {
        return this.update('subjects', id, updates);
    }

    async deleteSubject(id) {
        return this.delete('subjects', id);
    }

    // Schedule-specific methods
    async addScheduleEntry(entry) {
        return this.add('schedule', entry);
    }

    async getSchedule(day = null) {
        const schedule = await this.getAll('schedule');
        if (day) {
            return schedule.filter(entry => entry.day === day);
        }
        return schedule;
    }

    async updateScheduleEntry(id, updates) {
        return this.update('schedule', id, updates);
    }

    async deleteScheduleEntry(id) {
        return this.delete('schedule', id);
    }

    // Study session methods
    async startStudySession(subject, duration) {
        const session = {
            subject: subject,
            plannedDuration: duration,
            startTime: new Date().toISOString(),
            endTime: null,
            actualDuration: 0,
            completed: false,
            date: new Date().toISOString().split('T')[0]
        };
        return this.add('studySessions', session);
    }

    async endStudySession(id) {
        const session = await this.get('studySessions', id);
        const endTime = new Date();
        const startTime = new Date(session.startTime);
        const actualDuration = Math.floor((endTime - startTime) / 60000); // minutes

        return this.update('studySessions', id, {
            endTime: endTime.toISOString(),
            actualDuration: actualDuration,
            completed: true
        });
    }

    async getStudySessions(date = null) {
        const sessions = await this.getAll('studySessions');
        if (date) {
            return sessions.filter(session => session.date === date);
        }
        return sessions;
    }

    async getTotalStudyTime(period = 'week') {
        const sessions = await this.getStudySessions();
        const now = new Date();
        
        let startDate;
        if (period === 'week') {
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (period === 'month') {
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        } else {
            startDate = new Date(0); // All time
        }

        const relevantSessions = sessions.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate >= startDate && session.completed;
        });

        return relevantSessions.reduce((total, session) => total + session.actualDuration, 0);
    }

    // Notes methods
    async addNote(note) {
        return this.add('notes', note);
    }

    async getNotes(subject = null) {
        const notes = await this.getAll('notes');
        if (subject) {
            return notes.filter(note => note.subject === subject);
        }
        return notes;
    }

    async updateNote(id, updates) {
        return this.update('notes', id, updates);
    }

    async deleteNote(id) {
        return this.delete('notes', id);
    }

    // Exam methods
    async addExam(exam) {
        return this.add('exams', exam);
    }

    async getExams() {
        return this.getAll('exams');
    }

    async getUpcomingExams() {
        const exams = await this.getExams();
        const now = new Date();
        
        return exams
            .filter(exam => new Date(exam.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    async updateExam(id, updates) {
        return this.update('exams', id, updates);
    }

    async deleteExam(id) {
        return this.delete('exams', id);
    }

    // Goal methods
    async addGoal(goal) {
        return this.add('goals', goal);
    }

    async getGoals(status = null) {
        const goals = await this.getAll('goals');
        if (status) {
            return goals.filter(goal => goal.status === status);
        }
        return goals;
    }

    async updateGoal(id, updates) {
        return this.update('goals', id, updates);
    }

    async deleteGoal(id) {
        return this.delete('goals', id);
    }

    // Analytics methods
    async getAnalytics() {
        const [tasks, sessions, subjects] = await Promise.all([
            this.getTasks(),
            this.getStudySessions(),
            this.getSubjects()
        ]);

        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const pendingTasks = tasks.filter(t => t.status === 'pending').length;
        const overdueTasks = tasks.filter(t => {
            return t.status !== 'completed' && new Date(t.dueDate) < new Date();
        }).length;

        const totalStudyTime = await this.getTotalStudyTime('all');
        const weekStudyTime = await this.getTotalStudyTime('week');

        // Study time by subject
        const studyTimeBySubject = {};
        sessions.forEach(session => {
            if (session.completed) {
                studyTimeBySubject[session.subject] = 
                    (studyTimeBySubject[session.subject] || 0) + session.actualDuration;
            }
        });

        return {
            tasks: {
                total: tasks.length,
                completed: completedTasks,
                pending: pendingTasks,
                overdue: overdueTasks,
                completionRate: tasks.length > 0 ? (completedTasks / tasks.length * 100).toFixed(1) : 0
            },
            studyTime: {
                total: totalStudyTime,
                thisWeek: weekStudyTime,
                bySubject: studyTimeBySubject,
                sessions: sessions.length
            },
            subjects: subjects.length
        };
    }

    // Clear all data (for testing/reset)
    async clearAllData() {
        const stores = ['tasks', 'subjects', 'schedule', 'studySessions', 'notes', 'exams', 'goals'];
        
        for (const storeName of stores) {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            await store.clear();
        }
    }

    // Export data
    async exportData() {
        const data = {
            tasks: await this.getTasks(),
            subjects: await this.getSubjects(),
            schedule: await this.getSchedule(),
            sessions: await this.getStudySessions(),
            notes: await this.getNotes(),
            exams: await this.getExams(),
            goals: await this.getGoals(),
            exportedAt: new Date().toISOString()
        };

        return data;
    }

    // Import data
    async importData(data) {
        try {
            for (const [storeName, records] of Object.entries(data)) {
                if (storeName === 'exportedAt') continue;
                
                for (const record of records) {
                    // Remove id to let database auto-generate new ones
                    const { id, ...recordData } = record;
                    await this.add(storeName, recordData);
                }
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Initialize database
const DB = new DatabaseManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DB;
}