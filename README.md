# DentOffice landing page

A demo landing page for **DentOffice** (დენთ ოფისი), a dental clinic in Tbilisi. We built it as a pitch to win the job of building the clinic's full website.

- **Scope:** landing page only. The other pages in the nav aren't built yet.
- **Tone:** elegant and minimal.
- **Languages:** Georgian (default) and English, as separate pages.
- **Stack:** plain HTML, CSS and vanilla JavaScript. No build step.

## Running it locally

Serve the `frontend/` folder with any static server, for example:

```sh
cd frontend
python3 -m http.server 8765
```

Then open:

- Georgian: http://localhost:8765/
- English: http://localhost:8765/en/

Opening the HTML files straight from disk (`file://`) mostly works, but serving them is closer to production.

## Project structure

```
frontend/
├── index.html               Georgian page (default)
├── en/
│   └── index.html           English page
└── assets/
    ├── styles/main.css      Shared styles for both languages
    ├── scripts/main.js      Shared behaviour for both languages
    ├── fonts/               FiraGO (Light, Regular, Medium) + OFL.txt license
    └── images/
        ├── DO-Logo.avif     Logo (160×160)
        ├── hero-img.avif    Reception, used in the hero
        ├── office-1.avif    Staircase (portrait)
        ├── office-2.avif    Street entrance
        ├── office-3.avif    Waiting area and reception desk
        ├── office-4.avif    Treatment room
        ├── team.avif        Team photo
        └── pattern.jpg      Original brand pattern (reference only, redrawn in CSS)
```

Both pages share the same CSS and JS. Language-specific styles hang off `:lang(ka)`, and the script picks its strings from `<html lang>`.

## Page sections

**Booking happens by phone.** Every primary button is a `tel:` link, so it works without JavaScript. The popup is only a contact form for questions; it is not a booking form.

1. **Header:** logo, nav, language switch (EN/GE), "Call" button. The nav folds into a menu button below 1080px; the Call button stays visible until 900px.
2. **Hero:** welcome line, headline, address, live "open now" status, a call button showing the number, a "Send a message" link, and the reception photo.
3. **Services:** 10 services in 3 groups (everyday care, restoration and surgery, orthodontics and whitening), each with a one-line description, plus a separate emergency block with a tap-to-call number.
4. **The clinic:** gallery of four office photos.
5. **Office hours:** Mon–Sat 10:00–19:00, Sunday by appointment only, plus the live status. Sits on the redrawn brand pattern.
6. **The team:** team photo, short text, link to the about page.
7. **Contact:** address, phone, email, "Call to book" and "Send a message" buttons, map, and a "Get directions" link to Google Maps.
8. **Footer:** tagline, contact details, quick links, copyright, language link.
9. **Mobile call bar:** a fixed bottom bar below 900px with "Call" and "Message". It stays tucked away while the hero's own call button is on screen.
10. **Contact popup:** name, phone or email, and message in a `<dialog>`, plus Viber and WhatsApp links. Demo only: nothing is sent.

## Design system

### Concept

The page opens with the logo's `(`, drawn as a large thin white arc in the hero, and closes with a matching `)` in the footer. The brand pattern is redrawn as an SVG background on the Office Hours section, and the pattern's blue dot appears as a small mark on the hours card.

### Colours

Taken from the logo and pattern. Defined as tokens on `:root` in `main.css`.

| Token        | Hex       | Use                                         |
|--------------|-----------|---------------------------------------------|
| `--sky`      | `#8dbbd3` | Brand blue: hero panel, pattern, footer arc |
| `--sky-soft` | `#e9f3f8` | Light tint: emergency block, image placeholders |
| `--blue`     | `#2a5ba6` | Actions: buttons, focus rings, map pin      |
| `--ink`      | `#15273e` | Text, footer background                     |
| `--muted`    | `#55677a` | Secondary text                              |
| `--line`     | `#d5e2ea` | Dividers, input borders                     |
| `--paper`    | `#fbfdfe` | Page background                             |

### Typography

| Role     | Georgian                                    | English                                     |
|----------|---------------------------------------------|---------------------------------------------|
| Headings | Noto Serif Georgian, 300 (Google Fonts)     | Cormorant Garamond, 300–400 (Google Fonts)  |
| Body, UI | FiraGO 300/400/500 (self-hosted)            | FiraGO 300/400/500 (self-hosted)            |

FiraGO covers both Latin and Georgian, so body text looks the same in both languages. It is free under the SIL Open Font License (see `assets/fonts/OFL.txt`).

Georgian-specific rules:

- **No `text-transform: uppercase` on Georgian text.** Browsers turn it into Mtavruli (Georgian capitals), which reads as shouting.
- **Smaller display sizes.** Georgian words run about 20–30% longer.
- **More line-height:** 1.75 for Georgian body text, 1.6 for English.

### Motion

There is one load sequence: the hero arc draws, then the hero text settles in. Two small touches follow in the hero. When the clinic is open, the status dot breathes three times, then once more each time the status changes. Hovering or focusing the call button makes the arc lean in and thicken slightly. In Services, each group's dark rule draws across as it scrolls into view (only in browsers with scroll-driven animations; others show the static line), and the emergency number gets a pair of brackets, `( )`, on hover or focus. The booking popup fades in when opened. Everything else is static, and all motion is switched off under `prefers-reduced-motion`.

## Behaviour (`main.js`)

- **Header:** a border appears once the page scrolls.
- **Mobile menu:** toggles with the menu button and closes on Escape.
- **Office hours status:** works out Tbilisi time (`Asia/Tbilisi`) and shows open now, opens today, closed, or "Sunday by appointment". It re-checks every 30 seconds and counts down in the last hour before opening or closing ("closes in 25 min").
- **Live status:** fills every element marked `data-hours-status` (the hero and the hours card).
- **Contact popup:** any link with `data-open-message` opens it. These are links to `#contact`, so without JavaScript they scroll to the contact section instead. All three fields are required. A half-written message survives closing and reopening; the form only resets after a message is "sent". It closes with the × button or Escape.
- **Map:** Leaflet 1.9.4 from cdnjs with OpenStreetMap tiles. Leaflet loads only when the map comes within 600px of the viewport, so a slow CDN can't hold up the rest of the page. The tiles are toned down and the pin is a custom blue dot. Coordinates for 46 Viktor Dolidze St are `41.716167, 44.771934`, taken from OpenStreetMap's address search. If Leaflet fails to load, the address is shown as text.
- **Footer:** the copyright year updates automatically.

## Accessibility

- Skip link, landmark regions and labelled sections.
- Visible keyboard focus everywhere.
- Form errors are linked to their fields (`aria-describedby`, `aria-invalid`), and focus moves to the first invalid field.
- Focus returns to the button that opened the popup when it closes.
- Alt text on all photos in both languages.
- `hreflang` links between the two language versions.

## Content

### Clinic details

- **Address:** 46 Viktor Dolidze St, Tbilisi 0171, Georgia / ვიქტორ დოლიძის ქ. 46, თბილისი 0171
- **Phone:** +995 322 90 77 90. Labelled "Tel", not "Mob", because 322 is a Tbilisi landline code.
- **Email:** info@dentoffice.ge
- **Hours:** Mon–Sat 10:00–19:00; Sunday by appointment only (assumed correct)

### Copy changes from the original brief

- "We offer wide choice of dental services" → "We offer a wide range of dental services, from check-ups to implants."
- Title Case changed to sentence case ("Medical attention you can rely on").
- Added a one-line description for each service, a clinic gallery section, and an emergency call-out.

### Georgian copy

**All Georgian text is a draft by Claude and needs review by a native speaker.** The lines to check most carefully:

- Hero headline: "მზრუნველობა, რომელსაც შეგიძლიათ ენდოთ"
- Countdown strings in `main.js`: "ახლა ღიაა, დაიხურება {m} წუთში" and "გაიხსნება {m} წუთში"
- The service names and descriptions
- The brand spelling "დენთ ოფისი", taken from the storefront sign

## Known limitations and to-dos

- [ ] **The contact form sends nothing.** This is on purpose for the demo. For production, connect it to a backend or form service; see the `submit` handler in `main.js`.
- [ ] **Viber and WhatsApp links are demo links** pointing at the clinic's landline number. Replace them with the clinic's real messenger number.
- [ ] **Confirm the domain.** The `canonical` and `hreflang` URLs assume `https://dentoffice.ge/`, taken from the clinic's email address.
- [ ] **Nav links lead nowhere yet.** They point to `services.html`, `our-work.html`, `about.html` and `contact.html` (and their `en/` versions), which don't exist.
- [ ] **Georgian copy needs native review.**
- [ ] **Shrink the font files.** Each FiraGO file is about 250 KB because it covers every script. Cut them down to Latin and Georgian only, e.g. with `pyftsubset`.
- [ ] **Logo is a 160px raster.** Ask the client for an SVG; it will look soft on high-resolution screens.
- [ ] **Phone layout not verified on a real device.** Headless Chrome wouldn't render narrower than about 500px, so 390px widths still need a check in browser device mode or on a phone.
- [ ] **For production:** confirm OpenStreetMap tile usage terms, or switch to a commercial tile provider.
- [ ] **Add social sharing tags** (Open Graph) and a proper favicon set.
