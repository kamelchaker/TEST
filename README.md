# Al-Baseerah Academy — website

Production implementation of the approved Al-Baseerah Academy website design, built with Next.js (App Router), React, TypeScript (strict) and Tailwind CSS.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; defaults work for local development
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | TypeScript, strict mode |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm test` | Vitest unit and component tests (React Testing Library, jsdom) |
| `npm run test:e2e` | Playwright end-to-end, responsive and axe accessibility checks |
| `npm run check` | typecheck + lint + unit tests |

Playwright expects a Chromium matching its own version (`npx playwright install chromium`). To use a Chromium already on the machine, set `PLAYWRIGHT_CHROMIUM_PATH=/path/to/chrome`. The e2e run builds nothing itself: run `npm run build` first, then `npm run test:e2e` (it starts `next start` on port 3100).

## Routes

`/`, `/programs`, `/programs/[slug]`, `/curriculum`, `/our-approach`, `/families`, `/about`, `/admissions`, `/admissions/how-to-apply`, `/admissions/tuition`, `/admissions/faq`, `/schedule-a-tour`, `/request-information`, `/contact`, plus `/sitemap.xml` and `/robots.txt`.

There is no `/apply` route. Application buttons render only where a `ProgramOffering.applicationUrl` is set and open the external application system in a new tab.

## Project layout

```
src/app/                 Routes (Server Components by default)
src/components/
  layout/                Header, mobile drawer, footer, sticky CTA, skip link
  templates/             ProgramPageTemplate (all program pages), EditorialPageTemplate
  finder/                Program Finder (client shell over src/lib/finder)
  forms/                 Tour and Information forms (client) and shared fields
  ui/                    Buttons, sections, cards, photo slots, FAQ, tabs, icons
src/content/             Typed content records (the CMS-shaped data)
  types.ts               AcademicYear, Campus, Program, ProgramOffering, CurriculumDomain,
                         CurriculumStage, Faq, Tuition, AdmissionsContent, Faculty, SiteSettings
  photography.ts         Every photograph position, mapped to a file
src/lib/cms/             Content resolution and visibility rules (single entry point)
src/lib/finder/          Framework-independent eligibility logic + tests
src/lib/forms/           Zod schemas, server actions, spam controls, rate limiting, adapters
src/lib/seo.ts           Metadata builder; src/lib/structured-data.ts for schema.org
public/images/           Logo artwork; /temporary holds stand-in scene imagery
tests/e2e/               Playwright suites; tests/unit for component tests
```

## Content and configuration

All content lives in `src/content` and is read only through `src/lib/cms`. Values the school has not approved are `null` or empty and the pages omit them; no placeholder text is ever rendered.

- **Elementary grades** — `siteSettings.elementaryActive` (`src/content/site.ts`) is `false`. While false, elementary programs are excluded from listings, routes, the sitemap, form options and the Program Finder. Add grades to `siteSettings.elementaryGrades` (label plus inclusive month band) and flip the flag to open them.
- **Eligibility cutoffs** — `academicYears[].eligibilityCutoffDate` (`src/content/academic-years.ts`) is `null` until the school supplies a date. The finder never assumes a date; with none set it directs families to admissions. An offering may carry `dobCutoffOverride` to use its own date.
- **Offerings** — `src/content/offerings.ts` holds one record per program per year: status, `applicationUrl`, days, hours, class size. Null values are simply omitted from "Program details".
- **Tuition** — `src/content/tuition.ts`; figures appear only when `approved` is true and rows exist.
- **Campus contact details** — `src/content/campuses.ts`; address, phone and email render on `/contact` and in structured data once supplied.
- **Faculty** — `src/content/faculty.ts`; the type exists and the resolver returns approved profiles, but no section is rendered until profiles are supplied.
- **Photography** — `src/content/photography.ts` maps each design position (for example `preschoolHero`, `curriculumQuran`) to a file, size and objective alt text. Replace the file behind a key to change the image everywhere it is used without touching layouts. Files under `public/images/temporary` are stand-in visuals, not photographs of Al-Baseerah Academy.

## Program Finder

`src/lib/finder/finder.ts` is pure TypeScript with no framework or `Date` dependencies:

```
effectiveCutoff = offering.dobCutoffOverride ?? academicYear.eligibilityCutoffDate ?? null
```

Completed months are calculated at each offering's own effective cutoff and compared with its inclusive age band. With no approved cutoff nothing is calculated. Tests in `src/lib/finder/finder.test.ts` cover the academic-year cutoff, offering overrides, differing overrides per offering, inclusive boundaries, below-minimum age, missing cutoff, elementary inactive/active, leap-day birthdays and timezone independence.

## Forms

Two public forms exist: Schedule a Tour and Request Information. Contact is not a form page.

Server actions in `src/lib/forms/actions.ts` run the shared pipeline in `process.ts`: unexpected-field rejection → honeypot → Zod validation (authoritative) → signed timing token → rate limit → CRM and email adapters. Consent is required and recorded with the statement text and timestamp. The child's date of birth is validated and kept server-side as a date string only.

Adapters (`src/lib/forms/adapters`) let the app run without live credentials. `CRM_ADAPTER` and `EMAIL_ADAPTER` default to `console`, which logs a redacted summary. Implement `CrmAdapter` / `EmailAdapter` and register the implementation in `adapters/index.ts` to connect a real system.

Environment variables are listed in `.env.example`. Set `FORM_TOKEN_SECRET` and `NEXT_PUBLIC_SITE_URL` in production; the in-memory rate limiter should be replaced with a shared store when running more than one instance.

## Accessibility

Skip link, landmark structure, one `h1` per route, visible focus, a modal mobile drawer (focus trap, Escape, focus restoration, inert background, scroll lock), keyboard-operable curriculum tabs and FAQ disclosures, labelled form fields with linked error messages and a focused error summary, `prefers-reduced-motion` support and 44×44 targets. Use `ArabicText` (`src/components/ArabicText.tsx`) wherever genuine Arabic script is added so it carries `lang="ar"`.

Playwright runs axe (WCAG 2.1 A/AA) on every route and checks for horizontal overflow at 320×568, 375×667, 390×844, 360×800, 412×915, 768×1024, 1024×768, 1280×800 and 1536×960.
