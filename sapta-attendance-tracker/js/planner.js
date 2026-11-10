// ========================================
// PLANNER: holiday-aware bunk planner + what-if simulator
// Needs js/insights.js
// ========================================

let plan = { info: null, skip: {} };
let whatIf = {};

function fmtDate(str) {
    return new Date(str + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

// ---------- Result line shared by both sections ----------
function resultHtml(id, attend, skip) {
    const t = Insights.target();
    const cur = Insights.stats(id).pct;
    const proj = Insights.project(id, attend, skip);
    const curTxt = cur === null ? "–" : cur.toFixed(1) + "%";
    const projTxt = proj === null ? "–" : proj.toFixed(1) + "%";
    return `<span class="pl-pct">${curTxt} → <b>${projTxt}</b></span> ${Insights.badge(proj, t)}`;
}

// ---------- 1. BUNK PLANNER ----------
function calculatePlan() {
    const start = document.getElementById("planStart").value;
    const end = document.getElementById("planEnd").value;
    const box = document.getElementById("planResult");

    if (!start || !end) { box.innerHTML = `<p class="pl-note">Pick a start and end date.</p>`; return; }
    if (end < start) { box.innerHTML = `<p class="pl-note">The end date must be on or after the start date.</p>`; return; }
    if ((new Date(end) - new Date(start)) / 86400000 > 120) { box.innerHTML = `<p class="pl-note">Pick a range of 120 days or less.</p>`; return; }

    plan.info = Insights.classesInRange(start, end);
    plan.skip = {};
    Insights.subjects().forEach(s => { plan.skip[s.id] = plan.info.counts[s.id] || 0; }); // default: skip everything
    renderPlan();
}

function renderPlan() {
    const box = document.getElementById("planResult");
    const info = plan.info;
    const subs = Insights.subjects().filter(s => info.counts[s.id] > 0);

    let html = `<div class="pl-chips">
        <span>📚 ${info.classDays} class days</span>
        <span>🎉 ${info.holidays.length} holidays</span>
        <span>☀️ ${info.sundays} Sundays</span></div>`;

    if (info.holidays.length) {
        html += `<ul class="pl-holidays">${info.holidays.map(h => `<li>${fmtDate(h.date)}: ${Insights.esc(h.name)}</li>`).join("")}</ul>`;
    }

    if (!subs.length) {
        box.innerHTML = html + `<p class="pl-note">No unmarked classes in this range. Check that your subjects have days set on the Subjects page.</p>`;
        return;
    }

    html += `<div class="pl-actions">
        <button class="secondary-btn" onclick="setAllSkip(true)">Skip all</button>
        <button class="secondary-btn" onclick="setAllSkip(false)">Attend all</button></div>`;

    subs.forEach(s => {
        const n = info.counts[s.id];
        html += `<div class="pl-row">
            <div class="pl-name">${Insights.esc(s.name)} <small>${n} class${n > 1 ? "es" : ""} in range</small></div>
            <input type="range" min="0" max="${n}" value="${plan.skip[s.id]}" oninput="onSkip('${s.id}', this.value)">
            <div class="pl-sub" id="pl-val-${s.id}"></div>
            <div class="pl-res" id="pl-res-${s.id}"></div></div>`;
    });
    box.innerHTML = html;
    subs.forEach(s => updatePlanRow(s.id));
}

function onSkip(id, v) { plan.skip[id] = Number(v); updatePlanRow(id); }

function updatePlanRow(id) {
    const n = plan.info.counts[id], skip = plan.skip[id], attend = n - skip;
    document.getElementById("pl-val-" + id).textContent = `Skip ${skip}, attend ${attend}`;
    document.getElementById("pl-res-" + id).innerHTML = resultHtml(id, attend, skip);
}

function setAllSkip(skipAll) {
    Object.keys(plan.info.counts).forEach(id => { plan.skip[id] = skipAll ? plan.info.counts[id] : 0; });
    renderPlan();
}

// ---------- 2. WHAT-IF SIMULATOR ----------
function renderWhatIf() {
    const box = document.getElementById("whatIfList");
    const subs = Insights.subjects();
    if (!subs.length) {
        box.innerHTML = `<p class="pl-note">No subjects yet. <a href="subjects.html">Add subjects</a> first.</p>`;
        return;
    }
    box.innerHTML = subs.map(s => {
        whatIf[s.id] = whatIf[s.id] || { a: 0, s: 0 };
        return `<div class="pl-row">
            <div class="pl-name">${Insights.esc(s.name)}</div>
            <label class="pl-lbl">Attend <b id="wi-a-${s.id}">0</b> more
                <input type="range" min="0" max="30" value="0" oninput="onWhatIf('${s.id}','a',this.value)"></label>
            <label class="pl-lbl">Skip <b id="wi-s-${s.id}">0</b> more
                <input type="range" min="0" max="30" value="0" oninput="onWhatIf('${s.id}','s',this.value)"></label>
            <div class="pl-res" id="wi-res-${s.id}"></div></div>`;
    }).join("");
    subs.forEach(s => updateWhatIf(s.id));
}

function onWhatIf(id, key, v) { whatIf[id][key] = Number(v); updateWhatIf(id); }

function updateWhatIf(id) {
    document.getElementById("wi-a-" + id).textContent = whatIf[id].a;
    document.getElementById("wi-s-" + id).textContent = whatIf[id].s;
    document.getElementById("wi-res-" + id).innerHTML = resultHtml(id, whatIf[id].a, whatIf[id].s);
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("targetPill").textContent = `🎯 Target: ${Insights.target()}%`;
    const s = new Date(); s.setDate(s.getDate() + 1);
    const e = new Date(s); e.setDate(e.getDate() + 3);
    document.getElementById("planStart").value = Insights.dateKey(s);
    document.getElementById("planEnd").value = Insights.dateKey(e);
    renderWhatIf();
});
