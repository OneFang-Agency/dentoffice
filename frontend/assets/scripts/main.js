(function () {
    "use strict";

    var lang = document.documentElement.lang === "en" ? "en" : "ka";

    var t = {
        ka: {
            openNow: "ახლა ღიაა, დაიხურება 19:00-ზე",
            closesIn: "ახლა ღიაა, დაიხურება {m} წუთში",
            opensToday: "დღეს გაიხსნება 10:00-ზე",
            opensIn: "გაიხსნება {m} წუთში",
            closedNow: "ახლა დაკეტილია, ხვალ 10:00-დან",
            sunday: "დღეს მხოლოდ წინასწარი ჩაწერით",
            saturdayClosed: "ახლა დაკეტილია, კვირას მხოლოდ ჩაწერით",
            errName: "შეიყვანეთ თქვენი სახელი",
            errContact: "შეიყვანეთ ტელეფონი ან ელ. ფოსტა, რომ გიპასუხოთ",
            errMessage: "დაწერეთ შეტყობინება",
            mapFallback: "რუკის ჩატვირთვა ვერ მოხერხდა. მისამართი: ვიქტორ დოლიძის ქ. 46, თბილისი",
            readMore: "მეტის წაკითხვა",
            readLess: "შეკეცვა",
            pin: "დენტ ოფისი"
        },
        en: {
            openNow: "Open now, closes at 19:00",
            closesIn: "Open now, closes in {m} min",
            opensToday: "Opens today at 10:00",
            opensIn: "Opens in {m} min",
            closedNow: "Closed now, opens tomorrow at 10:00",
            sunday: "Today by appointment only",
            saturdayClosed: "Closed now, Sunday by appointment only",
            errName: "Enter your name",
            errContact: "Enter a phone number or email so we can reply",
            errMessage: "Write your message",
            mapFallback: "The map didn't load. Address: 46 Viktor Dolidze St, Tbilisi",
            readMore: "Read more",
            readLess: "Show less",
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
    /* Re-checked every 30s, so a tab left open past 19:00 doesn't keep saying
       "open". In the last hour before opening or closing it counts down. */
    var statuses = document.querySelectorAll("[data-hours-status]");
    var clock = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Tbilisi",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    });

    function updateStatus() {
        var parts = clock.formatToParts(new Date());
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
            text = minutes >= 1080 ? t.closesIn.replace("{m}", 1140 - minutes) : t.openNow;
        } else if (minutes < 600) {
            text = minutes >= 540 ? t.opensIn.replace("{m}", 600 - minutes) : t.opensToday;
        } else {
            text = day === "Sat" ? t.saturdayClosed : t.closedNow;
        }
        statuses.forEach(function (el) {
            if (el.textContent === text) return;
            var first = !el.hasAttribute("data-state");
            el.textContent = text;
            el.setAttribute("data-state", state);
            // The hero dot breathes when the status changes, not on a loop
            el.classList.remove("is-fresh");
            void el.offsetWidth;
            el.classList.toggle("is-update", !first);
            el.classList.add("is-fresh");
        });
    }

    if (statuses.length) {
        updateStatus();
        setInterval(updateStatus, 30000);
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

    /* ---------- Reviews: trim long ones, "Read more" opens them in place ---------- */
    var quotes = document.querySelectorAll(".review blockquote");
    function clampReviews() {
        quotes.forEach(function (q) {
            if (q.classList.contains("is-open")) return;
            q.classList.add("is-clamped");
            var overflows = q.scrollHeight > q.clientHeight + 4;
            q.classList.toggle("is-clamped", overflows);
            var btn = q.nextElementSibling && q.nextElementSibling.classList.contains("review__more")
                ? q.nextElementSibling : null;
            if (overflows && !btn) {
                btn = document.createElement("button");
                btn.type = "button";
                btn.className = "review__more text-link";
                btn.textContent = t.readMore;
                btn.setAttribute("aria-expanded", "false");
                btn.setAttribute("aria-controls", q.id);
                btn.addEventListener("click", function () {
                    var open = q.classList.toggle("is-open");
                    btn.textContent = open ? t.readLess : t.readMore;
                    btn.setAttribute("aria-expanded", String(open));
                    if (!open) {
                        var top = q.closest(".review").getBoundingClientRect().top;
                        if (top < 0) q.closest(".review").scrollIntoView({ block: "start" });
                    }
                });
                q.insertAdjacentElement("afterend", btn);
            } else if (!overflows && btn) {
                btn.remove();
            }
        });
    }
    if (quotes.length) {
        clampReviews();
        var clampTimer;
        window.addEventListener("resize", function () {
            clearTimeout(clampTimer);
            clampTimer = setTimeout(clampReviews, 150);
        });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(clampReviews);
    }

    /* ---------- Footer arc: the closing ")" draws like the hero's "(" ----------
       It sits at the end of the page, so it draws when it comes into view
       rather than on load. The arc stretches with the footer and keeps a
       constant stroke (non-scaling-stroke), so its dash is measured in screen
       pixels: sample the curve on screen and hand the length to the CSS.
       Without JS or with reduced motion it is simply drawn. */
    var footer = document.querySelector(".site-footer");
    var footerArc = footer && footer.querySelector(".footer__arc");
    var arcPath = footerArc && footerArc.querySelector("path");
    var motionOK = window.matchMedia && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function screenLength(path) {
        var m = path.getScreenCTM();
        var total = path.getTotalLength();
        var len = 0, prev = null;
        for (var i = 0; i <= 64; i++) {
            var p = path.getPointAtLength((total * i) / 64);
            var x = m.a * p.x + m.c * p.y, y = m.b * p.x + m.d * p.y;
            if (prev) len += Math.hypot(x - prev[0], y - prev[1]);
            prev = [x, y];
        }
        return Math.ceil(len) + 2;
    }

    if (arcPath && motionOK && "IntersectionObserver" in window && arcPath.getScreenCTM) {
        var setArcLength = function () {
            footer.style.setProperty("--arc-len", screenLength(arcPath) + "px");
        };
        setArcLength();
        footer.classList.add("will-draw");
        window.addEventListener("resize", setArcLength);

        var arcIO = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                arcIO.disconnect();
                footer.classList.add("is-drawn");
                arcPath.addEventListener("animationend", function () {
                    window.removeEventListener("resize", setArcLength);
                    footer.classList.remove("will-draw", "is-drawn");
                }, { once: true });
            }
        }, { threshold: 0.5 });
        arcIO.observe(footerArc);
    }

    /* ---------- Reviews: "( 1 / 3 )" counter for the swipeable row on phones ---------- */
    var reviewList = document.querySelector(".reviews__list");
    if (reviewList && reviewList.children.length > 1) {
        var pager = document.createElement("p");
        pager.className = "reviews__pager";
        pager.setAttribute("aria-hidden", "true");
        reviewList.insertAdjacentElement("afterend", pager);
        var cards = reviewList.children;
        var shown = -1;
        function updatePager() {
            var step = cards[1].offsetLeft - cards[0].offsetLeft || 1;
            var i = Math.round(reviewList.scrollLeft / step);
            if (reviewList.scrollLeft + reviewList.clientWidth >= reviewList.scrollWidth - 2) i = cards.length - 1;
            i = Math.max(0, Math.min(cards.length - 1, i));
            if (i === shown) return;
            shown = i;
            pager.innerHTML = "<span>(</span>" + (i + 1) + " / " + cards.length + "<span>)</span>";
        }
        reviewList.addEventListener("scroll", updatePager, { passive: true });
        window.addEventListener("resize", updatePager);
        updatePager();
    }

    /* ---------- Footer year ---------- */
    var year = document.querySelector("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
})();
