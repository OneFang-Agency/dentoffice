(function () {
    "use strict";

    var lang = document.documentElement.lang === "en" ? "en" : "ka";

    var t = {
        ka: {
            openNow: "ახლა ღიაა, დაიხურება 19:00-ზე",
            opensToday: "დღეს გაიხსნება 10:00-ზე",
            closedNow: "ახლა დაკეტილია, ხვალ 10:00-დან",
            sunday: "დღეს მხოლოდ წინასწარი ჩაწერით",
            saturdayClosed: "ახლა დაკეტილია, კვირას მხოლოდ ჩაწერით",
            errName: "შეიყვანეთ თქვენი სახელი",
            errContact: "შეიყვანეთ ტელეფონი ან ელ. ფოსტა, რომ გიპასუხოთ",
            errMessage: "დაწერეთ შეტყობინება",
            mapFallback: "რუკის ჩატვირთვა ვერ მოხერხდა. მისამართი: ვიქტორ დოლიძის ქ. 46, თბილისი",
            pin: "დენთ ოფისი"
        },
        en: {
            openNow: "Open now, closes at 19:00",
            opensToday: "Opens today at 10:00",
            closedNow: "Closed now, opens tomorrow at 10:00",
            sunday: "Today by appointment only",
            saturdayClosed: "Closed now, Sunday by appointment only",
            errName: "Enter your name",
            errContact: "Enter a phone number or email so we can reply",
            errMessage: "Write your message",
            mapFallback: "The map didn't load. Address: 46 Viktor Dolidze St, Tbilisi",
            pin: "DentOffice"
        }
    }[lang];

    /* ---------- Header: border on scroll ---------- */
    var header = document.querySelector(".site-header");
    function onScroll() {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile nav ---------- */
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("main-nav");
    function setNav(open) {
        toggle.setAttribute("aria-expanded", String(open));
        nav.classList.toggle("is-open", open);
    }
    toggle.addEventListener("click", function () {
        setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && nav.classList.contains("is-open")) {
            setNav(false);
            toggle.focus();
        }
    });
    window.matchMedia("(min-width: 1081px)").addEventListener("change", function (mq) {
        if (mq.matches) setNav(false);
    });

    /* ---------- Office hours: live status in Tbilisi time ---------- */
    var statuses = document.querySelectorAll("[data-hours-status]");
    if (statuses.length) {
        var parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Tbilisi",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        }).formatToParts(new Date());
        var get = function (type) {
            for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
        };
        var day = get("weekday");
        var minutes = parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10);
        var state = "closed";
        var text;

        if (day === "Sun") {
            text = t.sunday;
        } else if (minutes >= 600 && minutes < 1140) {
            state = "open";
            text = t.openNow;
        } else if (minutes < 600) {
            text = t.opensToday;
        } else {
            text = day === "Sat" ? t.saturdayClosed : t.closedNow;
        }
        statuses.forEach(function (el) {
            el.textContent = text;
            el.setAttribute("data-state", state);
        });
    }

    /* ---------- Contact popup (demo: nothing is sent) ----------
       Triggers are links to #contact, so without JS they still scroll to the
       contact section. */
    var dialog = document.getElementById("message");
    var form = document.getElementById("message-form");
    var success = dialog.querySelector(".message-dialog__success");
    var lastTrigger = null;

    function resetForm() {
        form.reset();
        form.hidden = false;
        success.hidden = true;
        form.querySelectorAll("[aria-invalid]").forEach(function (el) {
            el.removeAttribute("aria-invalid");
        });
        form.querySelectorAll(".field__error").forEach(function (el) {
            el.textContent = "";
        });
    }

    function openMessage(e) {
        if (typeof dialog.showModal !== "function") return; // fall back to #contact
        e.preventDefault();
        lastTrigger = e.currentTarget;
        setNav(false);
        // Keep a half-written message; start fresh only after one was sent.
        if (!success.hidden) resetForm();
        dialog.showModal();
        document.body.style.overflow = "hidden";
        form.elements.name.focus();
    }

    dialog.addEventListener("close", function () {
        document.body.style.overflow = "";
        if (lastTrigger) lastTrigger.focus();
    });

    document.querySelectorAll("[data-open-message]").forEach(function (el) {
        el.addEventListener("click", openMessage);
    });
    dialog.querySelectorAll("[data-close-message]").forEach(function (el) {
        el.addEventListener("click", function () {
            dialog.close();
        });
    });

    function setError(input, message) {
        var error = document.getElementById(input.getAttribute("aria-describedby"));
        if (message) {
            input.setAttribute("aria-invalid", "true");
            if (error) error.textContent = message;
        } else {
            input.removeAttribute("aria-invalid");
            if (error) error.textContent = "";
        }
    }

    function validate() {
        var checks = [
            [form.elements.name, form.elements.name.value.trim().length >= 2, t.errName],
            [form.elements.contact, form.elements.contact.value.trim().length >= 5, t.errContact],
            [form.elements.body, form.elements.body.value.trim().length >= 2, t.errMessage]
        ];
        var firstInvalid = null;
        checks.forEach(function (c) {
            setError(c[0], c[1] ? "" : c[2]);
            if (!c[1] && !firstInvalid) firstInvalid = c[0];
        });
        if (firstInvalid) firstInvalid.focus();
        return !firstInvalid;
    }

    form.addEventListener("input", function (e) {
        if (e.target.getAttribute("aria-invalid") === "true") setError(e.target, "");
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validate()) return;
        form.hidden = true;
        success.hidden = false;
        success.querySelector("h2").focus();
    });

    /* ---------- Map: load Leaflet only when the map nears the viewport ----------
       Keeps the CDN off the critical path, so a slow CDN can't hold up the rest. */
    var mapEl = document.getElementById("map");
    var LEAFLET = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/";

    function mapFallback() {
        mapEl.innerHTML = '<p class="map__fallback">' + t.mapFallback + "</p>";
    }

    function initMap() {
        var coords = [41.716167, 44.771934]; // 46 Viktor Dolidze St
        var map = L.map(mapEl, { center: coords, zoom: 16, scrollWheelZoom: false });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        L.marker(coords, {
            title: t.pin,
            alt: t.pin,
            icon: L.divIcon({ className: "", html: '<div class="map-pin"></div>', iconSize: [22, 22], iconAnchor: [11, 11] })
        }).addTo(map);
    }

    function loadMap() {
        var css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = LEAFLET + "leaflet.min.css";
        document.head.appendChild(css);

        var js = document.createElement("script");
        js.src = LEAFLET + "leaflet.min.js";
        js.onload = function () {
            window.L ? initMap() : mapFallback();
        };
        js.onerror = mapFallback;
        document.head.appendChild(js);
    }

    if (mapEl) {
        if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    io.disconnect();
                    loadMap();
                }
            }, { rootMargin: "600px 0px" });
            io.observe(mapEl);
        } else {
            loadMap();
        }
    }

    /* ---------- Call bar: tuck away while the hero's call button is visible ---------- */
    var callBar = document.querySelector(".call-bar");
    var heroActions = document.querySelector(".hero__actions");
    if (callBar && heroActions && "IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
            callBar.classList.toggle("is-tucked", entries[0].isIntersecting);
        }).observe(heroActions);
    }

    /* ---------- Footer year ---------- */
    var year = document.querySelector("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
})();
