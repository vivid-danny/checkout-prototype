# Checkout Prototype

A sandbox for prototyping and user-testing **checkout UX variations** for Vivid Seats.
It's a clickable, front-end-only prototype (no real backend or payments) that lets us
put different checkout experiences in front of users, share each as its own URL, and
compare ideas quickly.

This is a **throwaway prototyping playground**, not production code — favor fast iteration
over polish, and keep the shared infrastructure lean.

## What's in it

- A full checkout flow: **login → shipping → payment → confirmation** (the shipping step
  is skipped for e-ticket orders).
- Multiple **variations** of that flow, each reachable at its own URL and listed on a
  landing page, so studies can link straight to a specific experience.
- Preloaded test data (users, addresses, cards, orders) so testers land mid-flow without
  typing, plus a hidden prototype-controls panel (**Shift + H**) to switch user profiles,
  ticket type, and auto-fill forms.

## Tech stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) 18 (plain `.jsx`, no TypeScript)
- [React Router](https://reactrouter.com/) for client-side routing
- Deployed on [Vercel](https://vercel.com/) via GitHub integration

## Getting started

```bash
npm install     # install dependencies
npm run dev      # start the dev server at http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

Then open `http://localhost:5173/` to see the landing page listing every variation.

## Project structure

```
src/
  App.jsx                 # thin router: landing page + variant routes
  CheckoutFlow.jsx        # the shared checkout flow, parameterized per variant
  experiments/
    registry.js           # single source of truth for all variations
  pages/                  # LoginPage, ShippingPage, PaymentPage, Confirmation pages, LandingPage
  components/             # shared UI (Header, Sidebar, modals, offers, etc.)
  data/                   # test users + preloaded checkout seeds
  index.css               # global styles + design tokens
```

## Variations / experiments

Variations are defined in one registry and inherit from a shared baseline, so common
changes propagate everywhere. **See [EXPERIMENTS.md](./EXPERIMENTS.md)** for how the
system works, how to add a new variation, and how to decide whether something should be a
reusable shared component or a one-off custom flow.

## Deployment

Pushing to the repo triggers a Vercel deploy (PRs get preview URLs). `vercel.json` contains
an SPA rewrite so deep links like `/<variant>/checkout/confirmation` resolve to the app.
No build config is needed — Vercel auto-detects Vite.

## Notes

- There is no automated test suite. Verify changes with a clean `npm run build`, no console
  errors, and a manual click-through in the browser.
