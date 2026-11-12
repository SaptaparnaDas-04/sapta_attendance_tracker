// ========================================
// PROFILE PHOTO with crop screen
// Tap the navbar avatar -> choose photo -> drag + zoom -> Save.
// Saved in this browser only (localStorage "profilePic").
// ========================================

(function () {
    const KEY = "profilePic";
    const VIEW = 280;     // crop box size on screen (px)
    const OUT = 256;      // saved image size (px)

function applyPic() {
    const av = document.getElementById("userAvatar");
    if (!av) return;
    const pic = localStorage.getItem(KEY);
    if (pic) {
        av.style.backgroundImage = 'url("' + pic + '")';
        av.style.backgroundSize = "cover";
        av.style.backgroundPosition = "center";
        av.style.backgroundRepeat = "no-repeat";
        av.style.fontSize = "0";
        av.style.color = "transparent";
        av.classList.add("has-pic");
    } else {
        ["backgroundImage", "backgroundSize", "backgroundPosition",
         "backgroundRepeat", "fontSize", "color"].forEach(p => av.style[p] = "");
        av.classList.remove("has-pic");
    }
}

    // ---------- Crop screen ----------
    function openCropper(img) {
        const dark = document.body.classList.contains("dark-mode");
        const overlay = document.createElement("div");
        overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;";
        overlay.innerHTML =
            '<div style="background:' + (dark ? "#1e1e2e" : "#fff") + ";color:" + (dark ? "#e0e0e0" : "#1a1a2e") +
            ';border-radius:16px;padding:20px;width:100%;max-width:340px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.3);">' +
            '<h3 style="margin:0 0 4px;font-size:18px;">Crop your photo</h3>' +
            '<p style="margin:0 0 12px;font-size:13px;opacity:.7;">Drag to move. Use the slider to zoom.</p>' +
            '<canvas id="cropCanvas" width="' + VIEW + '" height="' + VIEW + '" style="width:' + VIEW + 'px;max-width:100%;border-radius:12px;touch-action:none;cursor:grab;background:#111;"></canvas>' +
            '<input type="range" id="cropZoom" min="1" max="3" step="0.01" value="1" style="width:100%;margin:14px 0 10px;accent-color:#4a6cf7;">' +
            '<div style="display:flex;gap:10px;justify-content:flex-end;">' +
            '<button id="cropCancel" style="padding:10px 18px;border:2px solid #e0e0e0;background:transparent;color:inherit;border-radius:8px;cursor:pointer;font-weight:600;">Cancel</button>' +
            '<button id="cropSave" style="padding:10px 18px;border:none;background:#4a6cf7;color:#fff;border-radius:8px;cursor:pointer;font-weight:600;">Save</button>' +
            "</div></div>";
        document.body.appendChild(overlay);

        const canvas = overlay.querySelector("#cropCanvas");
        const slider = overlay.querySelector("#cropZoom");
        const ctx = canvas.getContext("2d");

        const base = VIEW / Math.min(img.width, img.height); // fills the box at zoom 1
        let zoom = 1, ox = 0, oy = 0;                        // ox, oy = image centre offset from box centre

        function clamp() {
            const w = img.width * base * zoom, h = img.height * base * zoom;
            const mx = Math.max(0, (w - VIEW) / 2), my = Math.max(0, (h - VIEW) / 2);
            ox = Math.min(mx, Math.max(-mx, ox));
            oy = Math.min(my, Math.max(-my, oy));
        }

        function paint(c, size, withMask) {
            const k = size / VIEW, w = img.width * base * zoom * k, h = img.height * base * zoom * k;
            c.clearRect(0, 0, size, size);
            c.drawImage(img, size / 2 + ox * k - w / 2, size / 2 + oy * k - h / 2, w, h);
            if (withMask) {
                c.save();
                c.fillStyle = "rgba(0,0,0,.5)";
                c.beginPath();
                c.rect(0, 0, size, size);
                c.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2, true);
                c.fill("evenodd");
                c.strokeStyle = "#fff";
                c.lineWidth = 2;
                c.beginPath();
                c.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
                c.stroke();
                c.restore();
            }
        }

        function draw() { clamp(); paint(ctx, VIEW, true); }

        // Drag to move
        let dragging = false, lx = 0, ly = 0;
        canvas.addEventListener("pointerdown", e => {
            dragging = true; lx = e.clientX; ly = e.clientY;
            canvas.setPointerCapture(e.pointerId);
            canvas.style.cursor = "grabbing";
        });
        canvas.addEventListener("pointermove", e => {
            if (!dragging) return;
            const rect = canvas.getBoundingClientRect(), f = VIEW / rect.width;
            ox += (e.clientX - lx) * f; oy += (e.clientY - ly) * f;
            lx = e.clientX; ly = e.clientY;
            draw();
        });
        const stop = () => { dragging = false; canvas.style.cursor = "grab"; };
        canvas.addEventListener("pointerup", stop);
        canvas.addEventListener("pointercancel", stop);

        // Zoom with slider or mouse wheel
        slider.addEventListener("input", () => { zoom = Number(slider.value); draw(); });
        canvas.addEventListener("wheel", e => {
            e.preventDefault();
            zoom = Math.min(3, Math.max(1, zoom - e.deltaY * 0.002));
            slider.value = zoom; draw();
        }, { passive: false });

        const close = () => overlay.remove();
        overlay.querySelector("#cropCancel").onclick = close;
        overlay.addEventListener("click", e => { if (e.target === overlay) close(); });

        overlay.querySelector("#cropSave").onclick = () => {
            const out = document.createElement("canvas");
            out.width = out.height = OUT;
            paint(out.getContext("2d"), OUT, false);
            try {
                localStorage.setItem(KEY, out.toDataURL("image/jpeg", 0.85));
                applyPic();
                close();
            } catch (err) {
                alert("⚠️ Could not save the photo (storage is full).");
            }
        };

        draw();
    }

    // ---------- Wire up the avatar ----------
    document.addEventListener("DOMContentLoaded", function () {
        const av = document.getElementById("userAvatar");
        if (!av) return;

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";
        document.body.appendChild(input);

        av.title = "Change profile photo";
        av.addEventListener("click", () => input.click());

        input.addEventListener("change", function () {
            const file = input.files && input.files[0];
            input.value = "";
            if (!file) return;
            if (!file.type.startsWith("image/")) { alert("⚠️ Please choose an image file."); return; }

            const reader = new FileReader();
            reader.onload = e => {
                const img = new Image();
                img.onload = () => openCropper(img);
                img.onerror = () => alert("⚠️ Could not read that image.");
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });

        applyPic();
    });
})();
