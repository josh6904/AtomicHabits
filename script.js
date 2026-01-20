    /**
     * Atomic Habits Dashboard Logic v2
     * Added: Identity Tracking, Heatmap, Confetti System
     */
    const app = {
        data: {
            habits: []
        },
        quotes: [
            "You do not rise to the level of your goals. You fall to the level of your systems.",
            "Every action you take is a vote for the type of person you wish to become.",
            "Success is the product of daily habits—not once-in-a-lifetime transformations.",
            "Time magnifies the margin between success and failure.",
            "The most effective way to change your habits is to focus on who you wish to become."
        ],
        
        init() {
            const storedData = localStorage.getItem('atomicHabitsData');
            if (storedData) {
                this.data = JSON.parse(storedData);
            } else {
                // Seed data with Identity
                this.data.habits = [
                    { 
                        id: Date.now(), 
                        name: "Drink a glass of water", 
                        identity: "Healthy Person",
                        stack: "After I wake up", 
                        logs: {} 
                    }
                ];
            }

            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', options);
            document.getElementById('quoteDisplay').textContent = `"${this.quotes[Math.floor(Math.random() * this.quotes.length)]}"`;

            this.renderHabits();
            this.renderStats();
            this.renderHeatmap();

            document.getElementById('addHabitForm').addEventListener('submit', (e) => this.addHabit(e));
        },

        getTodayString() {
            const d = new Date();
            return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
        },

        save() {
            localStorage.setItem('atomicHabitsData', JSON.stringify(this.data));
            this.renderStats();
            this.renderHeatmap();
        },

        addHabit(e) {
            e.preventDefault();
            const nameInput = document.getElementById('habitName');
            const stackInput = document.getElementById('habitStack');
            const identityInput = document.getElementById('habitIdentity');

            const newHabit = {
                id: Date.now(),
                name: nameInput.value,
                identity: identityInput.value || null,
                stack: stackInput.value,
                logs: {}
            };

            this.data.habits.push(newHabit);
            this.save();
            this.renderHabits();

            nameInput.value = '';
            stackInput.value = '';
            identityInput.value = '';
            this.showToast("Identity created!");
        },

        deleteHabit(id) {
            if(confirm('Delete this habit? This will remove the history.')) {
                this.data.habits = this.data.habits.filter(h => h.id !== id);
                this.save();
                this.renderHabits();
            }
        },

        toggleHabit(id) {
            const habit = this.data.habits.find(h => h.id === id);
            const today = this.getTodayString();

            if (habit.logs[today]) {
                delete habit.logs[today];
            } else {
                habit.logs[today] = true;
                this.showToast("Voted for your identity! 🔥");
                this.fireConfetti(); // REWARD!
            }

            this.save();
            this.renderHabits();
        },

        // --- Confetti Engine (Simple & Lightweight) ---
        fireConfetti() {
            const canvas = document.getElementById('confetti');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const particles = [];
            const particleCount = 100;
            const colors = ['#10b981', '#34d399', '#fbbf24', '#ffffff'];

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    w: Math.random() * 10 + 5,
                    h: Math.random() * 10 + 5,
                    dx: (Math.random() - 0.5) * 20,
                    dy: (Math.random() - 0.5) * 20,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    life: 100
                });
            }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let activeParticles = 0;

                particles.forEach(p => {
                    if (p.life > 0) {
                        p.x += p.dx;
                        p.y += p.dy;
                        p.dy += 0.5; // Gravity
                        p.life--;
                        
                        ctx.fillStyle = p.color;
                        ctx.fillRect(p.x, p.y, p.w, p.h);
                        activeParticles++;
                    }
                });

                if (activeParticles > 0) {
                    requestAnimationFrame(animate);
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
            animate();
        },

        calculateStreak(habit) {
            let streak = 0;
            const today = new Date();
            const checkDate = new Date(today);
            checkDate.setHours(0,0,0,0);

            // If today is not checked, check yesterday to see if streak is alive
            if (!habit.logs[this.getISOString(checkDate)]) {
                checkDate.setDate(checkDate.getDate() - 1);
            }

            while (true) {
                const dateStr = this.getISOString(checkDate);
                if (habit.logs[dateStr]) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
            return streak;
        },

        getISOString(dateObj) {
            return dateObj.getFullYear() + "-" + String(dateObj.getMonth() + 1).padStart(2, '0') + "-" + String(dateObj.getDate()).padStart(2, '0');
        },

        // --- Heatmap Logic ---
        renderHeatmap() {
            const container = document.getElementById('heatmapContainer');
            container.innerHTML = '';
            
            // Calculate total completion percentage for each of the last 30 days
            const daysToRender = 30;
            const today = new Date();

            for (let i = daysToRender - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const dateStr = this.getISOString(d);
                
                // Calculate completion % for this specific date
                const totalHabits = this.data.habits.length;
                if (totalHabits === 0) {
                    const div = document.createElement('div');
                    div.className = 'heat-sq';
                    container.appendChild(div);
                    continue;
                }

                const completedOnDate = this.data.habits.filter(h => h.logs[dateStr]).length;
                const ratio = completedOnDate / totalHabits;
                
                const div = document.createElement('div');
                div.className = 'heat-sq';
                div.title = `${dateStr}: ${Math.round(ratio * 100)}%`;

                if (ratio === 0) div.classList.add('heat-l0'); // default gray
                else if (ratio <= 0.25) div.classList.add('heat-l1');
                else if (ratio <= 0.50) div.classList.add('heat-l2');
                else if (ratio <= 0.75) div.classList.add('heat-l3');
                else div.classList.add('heat-l4');

                container.appendChild(div);
            }
        },

        getLast7Days(habit) {
            const days = [];
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const dateStr = this.getISOString(d);
                days.push(habit.logs[dateStr] ? 'active' : '');
            }
            return days;
        },

        renderHabits() {
            const list = document.getElementById('habitList');
            const emptyState = document.getElementById('emptyState');
            const today = this.getTodayString();

            list.innerHTML = '';

            if (this.data.habits.length === 0) {
                emptyState.style.display = 'block';
                return;
            } else {
                emptyState.style.display = 'none';
            }

            this.data.habits.forEach(habit => {
                const isCompleted = !!habit.logs[today];
                const streak = this.calculateStreak(habit);
                const weekDots = this.getLast7Days(habit).map(cls => `<div class="mini-dot ${cls}"></div>`).join('');

                const li = document.createElement('li');
                li.className = `habit-item ${isCompleted ? 'completed' : ''}`;
                
                // HTML Structure with Identity Badge
                li.innerHTML = `
                    <div class="habit-checkbox" onclick="app.toggleHabit(${habit.id})">
                        ${isCompleted ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                    </div>
                    <div class="habit-info">
                        ${habit.identity ? `<div class="identity-badge">${habit.identity}</div>` : ''}
                        <div class="habit-name">${habit.name}</div>
                        ${habit.stack ? `<div class="habit-stacking">${habit.stack}</div>` : ''}
                    </div>
                    <div class="habit-meta">
                        <div class="mini-dots" title="Last 7 days">
                            ${weekDots}
                        </div>
                        <div class="streak-badge" title="Current Streak">
                            🔥 ${streak}
                        </div>
                        <button class="btn-delete" onclick="app.deleteHabit(${habit.id})" title="Delete Habit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                `;
                list.appendChild(li);
            });
        },

        renderStats() {
            const today = this.getTodayString();
            const total = this.data.habits.length;
            const completed = this.data.habits.filter(h => h.logs[today]).length;
            const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
            const activeStreaks = this.data.habits.reduce((acc, h) => acc + (this.calculateStreak(h) > 0 ? 1 : 0), 0);

            document.getElementById('totalHabits').textContent = total;
            document.getElementById('completionRate').textContent = `${rate}%`;
            document.getElementById('globalStreak').textContent = activeStreaks;
            
            document.getElementById('progressText').textContent = `${completed}/${total}`;
            document.getElementById('dailyProgressBar').style.width = `${rate}%`;
        },

        resetData() {
            if(confirm('Delete all history?')) {
                localStorage.removeItem('atomicHabitsData');
                location.reload();
            }
        },

        showToast(message) {
            const toast = document.getElementById("toast");
            toast.textContent = message;
            toast.className = "show";
            setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
        }
    };

    app.init();
