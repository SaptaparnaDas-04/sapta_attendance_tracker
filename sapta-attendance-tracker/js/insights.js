// ========================================
// INSIGHTS HELPERS (risk badges, planner, what-if)
// Reads localStorage directly. No dependency on other files.
// ========================================

const Insights = {
    read(key, fallback) {
        try {
            const v = JSON.parse(localStorage.getItem(key));
            return v == null ? fallback : v;
        } catch (e) { return fallback; }
    },
    subjects() { return this.read("subjects", []); },
    records()  { return this.read("attendanceRecords", []); },
    schedule() { return this.read("weeklySchedule", {}); },
    holidays() { return this.read("holidays", []); },
    target() {
        const t = Number(localStorage.getItem("attendanceTarget"));
        return t > 0 && t <= 100 ? t : 75;
    },
    esc(s) {
        return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    },
    dateKey(d) {
        const p = n => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    },

    // Cancelled classes are ignored, same as the rest of the app
    stats(id) {
        let p = 0, a = 0;
        this.records().forEach(r => {
            if (r.subjectId !== id) return;
            if (r.status === "present") p++;
            else if (r.status === "absent") a++;
        });
        const n = p + a;
        return { p, a, n, pct: n === 0 ? null : (p / n) * 100 };
    },

    project(id, attend, skip) {
        const s = this.stats(id);
        const p = s.p + attend, n = s.n + attend + skip;
        return n === 0 ? null : (p / n) * 100;
    },

    risk(pct, t) {
        if (pct === null) return { key: "none", icon: "⚪", label: "No data" };
        if (pct >= t + 5) return { key: "safe", icon: "🟢", label: "Safe" };
        if (pct >= t)     return { key: "careful", icon: "🟡", label: "Careful" };
        return { key: "danger", icon: "🔴", label: "Danger" };
    },

    canSkip(p, n, t) { return Math.max(0, Math.floor((p * 100) / t - n + 1e-9)); },
    need(p, n, t) {
        if ((n === 0 ? 100 : (p / n) * 100) >= t) return 0;
        if (t >= 100) return Infinity;
        return Math.ceil((t * n - 100 * p) / (100 - t) - 1e-9);
    },

    badge(pct, t) {
        const r = this.risk(pct, t);
        const txt = pct === null ? r.label : `${r.label} · ${pct.toFixed(1)}%`;
        return `<span class="risk-badge risk-${r.key}">${r.icon} ${txt}</span>`;
    },

    // Counts unmarked classes per subject between two dates.
    // Skips Sundays, holidays, and classes already marked.
    classesInRange(startStr, endStr) {
        const schedule = this.schedule();
        const hMap = {};
        this.holidays().forEach(h => { (hMap[h.date] = hMap[h.date] || []).push(h.name); });
        const marked = new Set(this.records().map(r => r.date + "|" + r.subjectId));
        const counts = {}, holidays = [];
        let sundays = 0, classDays = 0;
        const d = new Date(startStr + "T00:00:00");
        const end = new Date(endStr + "T00:00:00");
        while (d <= end) {
            const key = this.dateKey(d), dow = d.getDay();
            if (dow === 0) sundays++;
            else if (hMap[key]) holidays.push({ date: key, name: hMap[key].join(" + ") });
            else {
                classDays++;
                (schedule[dow] || []).forEach(id => {
                    if (!marked.has(key + "|" + id)) counts[id] = (counts[id] || 0) + 1;
                });
            }
            d.setDate(d.getDate() + 1);
        }
        return { counts, holidays, sundays, classDays };
    }
};

// Used on the Subjects page: badge + one line of advice
function renderRiskBadge(subjectId) {
    const t = Insights.target();
    const s = Insights.stats(subjectId);
    let line;
    if (s.pct === null) {
        line = "Mark some classes to see your status.";
    } else if (s.pct >= t) {
        const k = Insights.canSkip(s.p, s.n, t);
        line = k > 0 ? `You can skip ${k} more class${k > 1 ? "es" : ""}.` : "Don't skip the next class.";
    } else {
        const k = Insights.need(s.p, s.n, t);
        line = k === Infinity ? "Attend every class from now on." : `Attend the next ${k} class${k > 1 ? "es" : ""} in a row to reach ${t}%.`;
    }
    return `<div style="margin:8px 0 4px">${Insights.badge(s.pct, t)}</div><p style="font-size:12px;margin-bottom:6px">${line}</p>`;
}

// Badge colours (readable in light and dark mode)
(function () {
    const css = document.createElement("style");
    css.textContent = `
    .risk-badge{display:inline-block;font-size:12px;font-weight:700;padding:3px 10px;border-radius:12px;border:1px solid}
    .risk-safe{background:rgba(34,197,94,.15);color:#15803d;border-color:#22c55e}
    .risk-careful{background:rgba(245,158,11,.18);color:#b45309;border-color:#f59e0b}
    .risk-danger{background:rgba(220,38,38,.14);color:#b91c1c;border-color:#dc2626}
    .risk-none{background:rgba(156,163,175,.18);color:#6b7280;border-color:#9ca3af}
    body.dark-mode .risk-safe{color:#6ee7b7}
    body.dark-mode .risk-careful{color:#fcd34d}
    body.dark-mode .risk-danger{color:#fca5a5}
    body.dark-mode .risk-none{color:#d1d5db}`;
    document.head.appendChild(css);
})();
