// Updated dashboard JS (js/dashboard.js)
(function () {
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const allowedPages = ['dashboard.html', 'dashboard-studypro.html']; // include any names you use
  if (!allowedPages.includes(currentPage)) return;

  let studyChartInstance = null;
  let pomodoro = null;

  document.addEventListener('DOMContentLoaded', async () => {
    Utils.setupModalCloseHandlers();

    if (typeof DB !== 'undefined' && typeof DB.init === 'function') {
      try { await DB.init(); } catch (e) { console.warn('DB init failed', e); }
    }

    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('collapsed');
    });

    document.querySelectorAll('[data-action]').forEach(btn => btn.addEventListener('click', handleActionClick));

    const addTaskForm = document.getElementById('addTaskForm');
    addTaskForm?.addEventListener('submit', handleAddTaskSubmit);

    document.getElementById('timerStartBtn')?.addEventListener('click', onTimerStart);
    document.getElementById('timerPauseBtn')?.addEventListener('click', onTimerPause);
    document.getElementById('timerStopBtn')?.addEventListener('click', onTimerStop);

    pomodoro = new PomodoroTimer({
      work: parseInt(document.getElementById('workMins')?.value || 25, 10),
      short: parseInt(document.getElementById('shortMins')?.value || 5, 10),
      long: parseInt(document.getElementById('longMins')?.value || 15, 10),
      onTick: seconds => document.getElementById('timerDisplay') && (document.getElementById('timerDisplay').textContent = pomodoro.formatTime(seconds)),
      onModeChange: mode => { const el = document.getElementById('timerMode'); if (el) el.textContent = `Mode: ${mode.charAt(0).toUpperCase()+mode.slice(1)}`; },
      onFinish: mode => { Utils.showToast(`${mode === 'work' ? 'Work session finished' : 'Break finished'}`, 'info'); renderAnalyticsAndChart(); }
    });

    ['workMins','shortMins','longMins'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => {
        const work = parseInt(document.getElementById('workMins').value || 25,10);
        const short = parseInt(document.getElementById('shortMins').value || 5,10);
        const long = parseInt(document.getElementById('longMins').value || 15,10);
        pomodoro.setDurations({ work, short, long });
        document.getElementById('timerDisplay').textContent = pomodoro.formatTime(pomodoro.remaining);
      });
    });

    document.getElementById('dashboardSearch')?.addEventListener('input', Utils.debounce(async (e) => {
      const q = (e.target.value || '').trim().toLowerCase();
      if (!q) return await renderTasks();
      if (typeof DB !== 'undefined' && typeof DB.getTasks === 'function') {
        const tasks = await DB.getTasks();
        const filtered = tasks.filter(t => (t.title||'').toLowerCase().includes(q) || (t.subject||'').toLowerCase().includes(q));
        renderTaskList(filtered);
      }
    }, 220));

    await loadUserData();
    await renderAnalyticsAndChart();
    await renderTasks();
  });

  async function handleAddTaskSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const task = {
      title: (fd.get('title') || '').trim(),
      subject: (fd.get('subject') || '').trim(),
      dueDate: fd.get('dueDate') || null,
      estimatedDuration: parseInt(fd.get('estimatedDuration') || '45',10),
      priority: fd.get('priority') || 'normal',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    if (!task.title) return Utils.showToast('Please enter a title', 'warning');
    try {
      if (typeof DB !== 'undefined' && typeof DB.addTask === 'function') {
        await DB.addTask(task);
        Utils.showToast('Task created', 'success');
        Utils.closeModal('addTaskModal');
        e.target.reset();
        await renderTasks();
      } else Utils.showToast('DB unavailable', 'error');
    } catch (err) {
      console.error(err);
      Utils.showToast('Could not create task', 'error');
    }
  }

  function handleActionClick(e) {
    const action = e.currentTarget.dataset.action;
    if (action === 'add-task') return Utils.openModal('addTaskModal');
    if (action === 'timer') return Utils.openModal('timerModal');
    if (action === 'import') return importData();
    if (action === 'export') return exportData();
    Utils.showToast('Feature coming soon', 'info');
  }

  async function renderTasks() {
    if (typeof DB !== 'undefined' && typeof DB.getTasks === 'function') {
      const tasks = await DB.getTasks();
      renderTaskList(tasks);
    } else renderTaskList([]);
  }

  function renderTaskList(tasks) {
    const ul = document.getElementById('taskList');
    if (!ul) return;
    if (!tasks || tasks.length === 0) {
      ul.innerHTML = '<li class="task-empty">No upcoming tasks</li>';
      return;
    }
    tasks.sort((a,b) => new Date(a.dueDate||0) - new Date(b.dueDate||0));
    ul.innerHTML = tasks.map(t => {
      const checked = t.status === 'completed' ? 'checked' : '';
      const due = t.dueDate ? Utils.formatDate(t.dueDate,'MMM DD, YYYY') : 'No due date';
      const duration = t.estimatedDuration ? `${t.estimatedDuration}m` : '';
      return `<li class="task-item">
        <div class="task-left">
          <input type="checkbox" data-id="${t.id}" ${checked} aria-label="Mark completed">
          <div class="task-meta">
            <div class="task-title">${Utils.escapeHtml(t.title||'Untitled')}</div>
            <div class="task-sub">Due ${due} • ${Utils.escapeHtml(t.priority||'Normal')}</div>
          </div>
        </div>
        <div class="task-right">${duration}</div>
      </li>`;
    }).join('');

    document.querySelectorAll('#taskList input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', async () => {
        const id = parseInt(cb.dataset.id,10);
        const checked = cb.checked;
        try {
          if (typeof DB !== 'undefined' && typeof DB.updateTask === 'function') {
            await DB.updateTask(id, { status: checked ? 'completed' : 'pending' });
            Utils.showToast(checked ? 'Task completed' : 'Marked pending', 'success');
            await renderTasks();
            await renderAnalyticsAndChart();
          }
        } catch (err) {
          console.error(err);
          Utils.showToast('Failed to update', 'error');
        }
      });
    });
  }

  async function renderAnalyticsAndChart() {
    try {
      let analytics = null;
      if (typeof DB !== 'undefined' && typeof DB.getAnalytics === 'function') analytics = await DB.getAnalytics();
      if (analytics) {
        document.getElementById('studyHours').textContent = analytics.studyTime?.thisWeek || 0;
        document.getElementById('tasksDone').textContent = analytics.tasks?.completed || 0;
      }
      await renderWeeklyChart();
    } catch (err) { console.error(err); }
  }

  async function renderWeeklyChart() {
    let sessions = [];
    if (typeof DB !== 'undefined' && typeof DB.getStudySessions === 'function') sessions = await DB.getStudySessions();

    const today = new Date();
    const labels = [];
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      labels.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
      const iso = d.toISOString().split('T')[0];
      const minutes = sessions.filter(s => s.date === iso && s.completed).reduce((sum, s) => sum + (s.actualDuration || 0), 0);
      data.push(Math.round((minutes/60) * 10) / 10);
    }

    const placeholder = document.querySelector('.chart-placeholder');
    if (!placeholder) return;
    placeholder.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.id = 'studyChart';
    placeholder.appendChild(canvas);

    if (window.Chart) {
      const ctx = canvas.getContext('2d');
      if (studyChartInstance) studyChartInstance.destroy();
      studyChartInstance = new Chart(ctx, {
        type:'line',
        data:{ labels, datasets:[{ label:'Hours', data, borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.08)', fill:true, tension:0.35 }]},
        options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true, ticks:{ callback: v => `${v}h` } } }, plugins:{ legend:{ display:false }}}
      });
    } else {
      placeholder.innerHTML = '<div class="chart-legend">Chart.js not loaded</div>';
    }
  }

  async function exportData() {
    if (typeof DB !== 'undefined' && typeof DB.exportData === 'function') {
      try {
        const data = await DB.exportData();
        Utils.downloadFile(data, `studyplanner-export-${new Date().toISOString().slice(0,10)}.json`);
        Utils.showToast('Export successful', 'success');
      } catch (err) { console.error(err); Utils.showToast('Export failed','error'); }
    } else Utils.showToast('Export not supported','error');
  }

  async function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        if (typeof DB !== 'undefined' && typeof DB.importData === 'function') {
          const res = await DB.importData(json);
          if (res.success) { Utils.showToast('Import successful','success'); await renderTasks(); await renderAnalyticsAndChart(); }
          else Utils.showToast('Import failed: '+(res.error||''),'error');
        } else Utils.showToast('Import not supported','error');
      } catch (err) { console.error(err); Utils.showToast('Invalid file','error'); }
    });
    input.click();
  }

  function onTimerStart() {
    const subject = prompt('Study subject for this session (optional):', 'General') || 'General';
    pomodoro.start(subject);
    Utils.showToast('Timer started','success');
    document.getElementById('timerStartBtn').textContent = 'Running';
  }

  function onTimerPause() {
    pomodoro.pause();
    Utils.showToast('Timer paused','info');
    document.getElementById('timerStartBtn').textContent = 'Resume';
  }

  function onTimerStop() {
    pomodoro.stop();
    Utils.showToast('Timer stopped','info');
    document.getElementById('timerStartBtn').textContent = 'Start';
    renderAnalyticsAndChart();
  }

  async function loadUserData() {
    try {
      const user = (typeof Auth !== 'undefined') ? Auth.getCurrentUser() : null;
      if (!user) return;
      document.getElementById('userName').textContent = user.name || user.email || 'Student';
      document.getElementById('totalXP').textContent = user.stats?.xp || 0;
      document.getElementById('currentStreak').textContent = user.stats?.currentStreak || 0;
    } catch (err) { console.error(err); }
  }

})();