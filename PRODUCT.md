# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Patients choosing a dentist in Tbilisi. Two groups matter equally:

- **Local Georgian residents**, mostly from Saburtalo and nearby districts, including parents bringing their children.
- **English-speaking expats and visitors**, including former patients who live abroad and come back to the same doctor.

They usually have one of three jobs: finding a clinic they can trust for regular care, getting help fast for a toothache or injury, or checking the address, hours and phone number before they call.

The site has a second, temporary audience: the **clinic owner**, who will judge this demo. It is a pitch to win the job of building the clinic's full website.

## Product Purpose

DentOffice (დენტ ოფისი) is a dental clinic at 46 Viktor Dolidze St, Saburtalo, Tbilisi, open since 2010. The website should turn a visitor's interest into a phone call: booking happens by phone, and the contact form is only for questions.

Success for the pitch: the owner sees a site that looks more premium and trustworthy than their current online presence, and hires the team to build the rest. Success for the live site: visitors call to book.

## Positioning

The client stands behind four claims, and each one can be backed up:

- **Friendly, unhurried care.** It is their own word ("friendly"), and the reviews praise doctors who are gentle with children and nervous patients.
- **Longevity and trust.** Open since 2010, a team of 15, and patients who keep coming back, some from other countries.
- **Fast emergency help.** Last-minute visits for dental emergencies.
- **English-speaking doctors.** Foreign patients are treated comfortably in English.

## Operating Context

- Visitors look the clinic up on their phones, often straight from Google Maps, and then call.
- Booking is by phone only: +995 322 90 77 90, a Tbilisi landline. Viber and WhatsApp links are planned, but the real messenger number is still unknown.
- Hours: Monday to Saturday 10:00–19:00; Sunday by appointment only. Live open or closed status is calculated in Tbilisi time.

## Capabilities and Constraints

- Only the landing page exists. The nav links to Services, Our work, About us and Contact, but those pages are not built yet.
- The site has two languages: Georgian is the default, and English is a separate page. Every change has to be made in both.
- The stack is plain HTML, CSS and vanilla JavaScript, with no build step. The page must work without JavaScript wherever possible.
- The demo contact form sends nothing.
- The domain `dentoffice.ge` is assumed, not confirmed.

## Brand Commitments

- The name is **DentOffice**, written **დენტ ოფისი** in Georgian, as on the storefront sign.
- The logo (`frontend/assets/images/DO-Logo.avif`, a 160px raster; an SVG has been requested) and the original brand pattern (`frontend/assets/images/pattern.jpg`) are the client's assets.
- The client's own tagline: "A friendly dental clinic in Saburtalo, since 2010."
- The brief asks for an elegant and minimal tone.
- Never uppercase Georgian text: browsers turn it into Mtavruli capitals.

## Evidence on Hand

- **Google rating:** 4.9. A TODO in the source says to check it against the live profile.
- **Three Google Maps reviews**, kept word for word in English. They name Dr. Natia (orthodontist) and Dr. Nana.
- **Photos** in `frontend/assets/images/`: reception (hero), staircase, street entrance, waiting area, treatment room, and the team.
- **Facts:** open since 2010, team of 15, the address, phone, email and hours.
- **Not available, so never invent:** doctor bios or credentials, prices, patient counts, awards, before-and-after cases, or more reviews. Also do not give doctors' specialties beyond what the reviews say.
- All Georgian copy is a draft and still needs review by a native speaker.

## Product Principles

1. **One action, the phone call.** Every section makes it easy to call, and nothing competes with that.
2. **Quiet confidence over hype.** Trust comes from real facts (since 2010, 15 people, real reviews, real rooms), not superlatives.
3. **Two languages, equal care.** Georgian and English visitors get the same quality of experience. Neither is a translation afterthought.
4. **Only claims the clinic can stand behind.** Everything is drawn from evidence on hand, and gaps are left honest.

## Accessibility & Inclusion

- The target is WCAG AA: keyboard focus visible everywhere, labelled landmarks, linked form errors, and alt text in both languages.
- All motion respects `prefers-reduced-motion`.
- Georgian text needs more line-height and smaller display sizes than English, because Georgian words run longer.
