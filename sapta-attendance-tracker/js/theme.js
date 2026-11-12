// ========================================
// THEME MEMORY: keeps dark/light mode and colour theme on every page
// Add in the <head> of every page, after style.css:
//   <script src="js/theme.js"></script>
// ========================================

(function () {
    const KEY = "uiThemeState";   // saved list of body classes, e.g. ["dark-mode","theme-green"]
    const isThemeClass = c => c === "dark-mode" || c.indexOf("theme-") === 0;

    function readSaved() {
        try {
            const v = JSON.parse(localStorage.getItem(KEY));
            if (Array.isArray(v)) return v;
        } catch (e) {}
        // First run: fall back to the old dark mode key
        return localStorage.getItem("darkMode") === "enabled" ? ["dark-mode"] : null;
    }

    function apply(list) {
        const b = document.body;
        if (!b || !list) return;
        Array.from(b.classList).filter(isThemeClass).forEach(c => b.classList.remove(c));
        list.forEach(c => b.classList.add(c));
    }

    function save() {
        const list = Array.from(document.body.classList).filter(isThemeClass);
        try {
            localStorage.setItem(KEY, JSON.stringify(list));
            // keep the old key in step so existing code agrees
            localStorage.setItem("darkMode", list.indexOf("dark-mode") !== -1 ? "enabled" : "disabled");
        } catch (e) {}
    }

    // Settings panel: Dark = dark mode, Blue/Green/Purple = light mode
    function wrapSetTheme() {
        if (typeof window.setTheme !== "function" || window.setTheme.__wrapped) return;
        const original = window.setTheme;
        window.setTheme = function (name) {
            const result = original.apply(this, arguments);
            document.body.classList.toggle("dark-mode", name === "dark");
            if (name !== "dark") document.body.classList.remove("theme-dark");
            return result;
        };
        window.setTheme.__wrapped = true;
    }

    // 1. Apply as soon as <body> exists (avoids a white flash)
    const saved = readSaved();
    if (saved) {
        if (document.body) apply(saved);
        else new MutationObserver(function (m, obs) {
            if (document.body) { apply(saved); obs.disconnect(); }
        }).observe(document.documentElement, { childList: true });
    }

    // 2. After the page's own scripts ran, re-apply, then remember every change
    window.addEventListener("load", function () {
        apply(readSaved());
        wrapSetTheme();
        setTimeout(function () {
            apply(readSaved());
            new MutationObserver(save).observe(document.body, { attributes: true, attributeFilter: ["class"] });
            if (!localStorage.getItem(KEY)) save();
        }, 400);
    });

    // 3. Another tab changed the theme
    window.addEventListener("storage", function (e) {
        if (e.key === KEY) apply(readSaved());
    });
})();
