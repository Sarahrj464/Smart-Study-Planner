// frontend/src/utils/analyticsHelper.js

export function generateStudyContext(tasks) {
  const now = new Date();
  const today = now.toDateString();
  
  // Filter tasks
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  
  // Priority breakdown
  const highPriority = activeTasks.filter(t => t.priority === 'high').length;
  const mediumPriority = activeTasks.filter(t => t.priority === 'medium').length;
  const lowPriority = activeTasks.filter(t => t.priority === 'low').length;
  
  // Overdue tasks
  const overdue = activeTasks.filter(t => 
    new Date(t.dueDate) < now
  ).length;
  
  // Due today
  const dueToday = activeTasks.filter(t => 
    new Date(t.dueDate).toDateString() === today
  ).length;
  
  // Due this week
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dueThisWeek = activeTasks.filter(t => 
    new Date(t.dueDate) <= weekFromNow && new Date(t.dueDate) >= now
  ).length;
  
  // Subject breakdown
  const subjects = {};
  tasks.forEach(task => {
    if (!subjects[task.subject]) {
      subjects[task.subject] = {
        completed: 0,
        pending: 0,
        totalTime: 0,
        avgTime: 0
      };
    }
    
    if (task.completed) {
      subjects[task.subject].completed++;
      subjects[task.subject].totalTime += task.actualMinutes || 0;
    } else {
      subjects[task.subject].pending++;
    }
  });
  
  // Calculate average time per subject
  Object.keys(subjects).forEach(subject => {
    const count = subjects[subject].completed || 1;
    subjects[subject].avgTime = Math.round(
      subjects[subject].totalTime / count
    );
  });
  
  // Study hours today
  const completedToday = completedTasks.filter(t => 
    t.completedAt && new Date(t.completedAt).toDateString() === today
  );
  const hoursToday = completedToday.reduce((sum, t) => 
    sum + (t.actualMinutes || t.estimatedMinutes || 0), 0
  ) / 60;
  
  // Study hours this week
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const completedThisWeek = completedTasks.filter(t =>
    t.completedAt && new Date(t.completedAt) >= weekAgo
  );
  const hoursThisWeek = completedThisWeek.reduce((sum, t) =>
    sum + (t.actualMinutes || t.estimatedMinutes || 0), 0
  ) / 60;
  
  // Current streak
  const streak = calculateStreak(tasks);
  
  // Upcoming exams
  const exams = activeTasks
    .filter(t => t.type === 'exam')
    .map(exam => ({
      subject: exam.subject,
      title: exam.title,
      date: exam.dueDate,
      daysLeft: Math.ceil((new Date(exam.dueDate) - now) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3); // Next 3 exams
  
  return {
    summary: {
      totalTasks: tasks.length,
      completed: completedTasks.length,
      pending: activeTasks.length,
      completionRate: Math.round((completedTasks.length / tasks.length) * 100) || 0
    },
    priorities: {
      high: highPriority,
      medium: mediumPriority,
      low: lowPriority
    },
    deadlines: {
      overdue,
      dueToday,
      dueThisWeek
    },
    subjects,
    studyStats: {
      hoursToday: Math.round(hoursToday * 10) / 10,
      hoursThisWeek: Math.round(hoursThisWeek * 10) / 10,
      avgPerDay: Math.round((hoursThisWeek / 7) * 10) / 10,
      streak
    },
    exams
  };
}

function calculateStreak(tasks) {
  const completedDates = tasks
    .filter(t => t.completed && t.completedAt)
    .map(t => new Date(t.completedAt).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));
  
  if (completedDates.length === 0) return 0;
  
  let streak = 1;
  let currentDate = new Date(completedDates[0]);
  
  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = new Date(completedDates[i]);
    const daysDiff = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      streak++;
      currentDate = prevDate;
    } else if (daysDiff > 1) {
      break;
    }
  }
  
  return streak;
}

export function generateContextPrompt(context) {
  const { summary, priorities, deadlines, subjects, studyStats, exams } = context;
  
  let prompt = `Student Context:\n\n`;
  
  // Task overview
  prompt += `📊 Tasks Overview:\n`;
  prompt += `- Total: ${summary.totalTasks} (${summary.completionRate}% completed)\n`;
  prompt += `- Pending: ${summary.pending} (High: ${priorities.high}, Medium: ${priorities.medium}, Low: ${priorities.low})\n`;
  
  // Deadlines
  if (deadlines.overdue > 0) {
    prompt += `- ⚠️ OVERDUE: ${deadlines.overdue} tasks\n`;
  }
  if (deadlines.dueToday > 0) {
    prompt += `- 🔥 Due Today: ${deadlines.dueToday} tasks\n`;
  }
  if (deadlines.dueThisWeek > 0) {
    prompt += `- 📅 Due This Week: ${deadlines.dueThisWeek} tasks\n`;
  }
  
  // Study stats
  prompt += `\n📈 Study Stats:\n`;
  prompt += `- Today: ${studyStats.hoursToday} hours\n`;
  prompt += `- This Week: ${studyStats.hoursThisWeek} hours (avg ${studyStats.avgPerDay}h/day)\n`;
  prompt += `- Current Streak: ${studyStats.streak} days 🔥\n`;
  
  // Exams
  if (exams.length > 0) {
    prompt += `\n📝 Upcoming Exams:\n`;
    exams.forEach(exam => {
      prompt += `- ${exam.subject}: ${exam.title} in ${exam.daysLeft} days\n`;
    });
  }
  
  // Subject performance
  const subjectList = Object.keys(subjects).slice(0, 3);
  if (subjectList.length > 0) {
    prompt += `\n📚 Top Subjects:\n`;
    subjectList.forEach(subject => {
      const s = subjects[subject];
      prompt += `- ${subject}: ${s.completed} done, ${s.pending} pending (avg ${s.avgTime}min)\n`;
    });
  }
  
  return prompt;
}