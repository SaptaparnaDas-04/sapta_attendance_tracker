// ========================================
// PROFILE PHOTO (shown in the navbar avatar on every page)
// Tap the avatar to choose a photo. Saved in this browser only.
// ========================================

(function () {
    const KEY = "profilePic";

    function applyPic() {
        const av = document.getElementById("userAvatar");
        if (!av) return;
        const pic = localStorage.getItem(KEY);
        if (pic) {
            av.style.backgroundImage = 'url("' + pic + '")';
            av.classList.add("has-pic");
        } else {
            av.style.backgroundImage = "";
            av.classList.remove("has-pic");
        }
    }

    // Crop to a centred square and shrink to 128px so storage stays tiny
    function toSquareDataUrl(file, done) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const size = 128, side = Math.min(img.width, img.height);
                const canvas = document.createElement("canvas");
                canvas.width = canvas.height = size;
                canvas.getContext("2d").drawImage(
                    img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size
                );
                done(canvas.toDataURL("image/jpeg", 0.85));
            };
            img.onerror = function () { alert("⚠️ Could not read that image."); };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    document.addEventListener("DOMContentLoaded", function () {
        const av = document.getElementById("userAvatar");
        if (!av) return;

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";
        document.body.appendChild(input);

        av.title = "Change profile photo";
        av.addEventListener("click", function () { input.click(); });

        input.addEventListener("change", function () {
            const file = input.files && input.files[0];
            if (!file) return;
            if (!file.type.startsWith("image/")) { alert("⚠️ Please choose an image file."); return; }
            toSquareDataUrl(file, function (dataUrl) {
                try {
                    localStorage.setItem(KEY, dataUrl);
                    applyPic();
                } catch (err) {
                    alert("⚠️ Could not save the photo (storage is full).");
                }
            });
            input.value = "";
        });

        applyPic();
    });
})();
