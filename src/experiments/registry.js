import ConfirmationPage from '../pages/ConfirmationPage'
import ConfirmationPageV2 from '../pages/ConfirmationPageV2'
import { SEED_CHECKOUTS } from '../data/users'

// Single source of truth for every checkout experiment/variation.
// Both the landing page (src/pages/LandingPage.jsx) and the router (src/App.jsx)
// read from this list, so adding a variation here is all it takes to give it a
// shareable URL (/<id>/checkout/...) and a landing-page card.
//
// ── How variants relate to the baseline ────────────────────────────────────
// BASELINE is the default checkout config. A config variant only declares what
// it *changes*; everything else is inherited from BASELINE via resolveConfig().
// So a change to BASELINE (or to a shared component) propagates to every variant
// that didn't override that particular field. This is the whole point: keep the
// common experience in one place and let variations be small deltas.
//
// Two kinds of variant:
//   - type: 'config'  -> reuses the shared <CheckoutFlow>; `config` is a partial
//                        override merged over BASELINE.
//   - type: 'custom'  -> the escape hatch. Supplies its own `element` (a
//                        self-contained flow) for ideas that diverge too much to
//                        express as a config delta. A custom flow should still
//                        import the shared components/pages so it inherits their
//                        look and behavior — duplicate composition, not internals.
//
// offerMode: 'modal'  -> forced full-screen offer modal sequence (seed 1)
//            'inline' -> offers shown inline on the confirmation page (seed 2)
//            'none'   -> clean confirmation, no post-purchase offers
//
// timer: null            -> no checkout timer (default)
//        { minutes: N }  -> an N-minute countdown runs across the flow steps and
//                           shows in the header; on expiry the flow resets and the
//                           user is sent back to the landing page.
//
// reassurance: 'none'    -> no "you won't be timed" message (default)
//              'modal'   -> shown once as a modal at the start of checkout
//              'rail'    -> a tinted card in the right rail directly under the
//                           order total, persistent on every checkout step
export const BASELINE = {
  seedData: null,
  ConfirmationComponent: ConfirmationPage,
  offerMode: 'none',
  timer: null,
  reassurance: 'none',
}

export const VARIANTS = [
  {
    id: 'baseline',
    name: 'Baseline Checkout',
    description:
      'The clean end-to-end checkout flow with a standard confirmation page and no post-purchase offers. Good for demos, and the base every config variant inherits from.',
    group: 'Baseline',
    type: 'config',
    config: {}, // pure BASELINE
  },
  {
    id: 'offer-modals',
    name: 'Forced Offer Modals (Seed 1)',
    description:
      'Post-purchase offers presented as a forced full-screen modal sequence on the confirmation page.',
    group: 'Post-purchase offers',
    type: 'config',
    // Inherits ConfirmationComponent from BASELINE; only changes the data + offer mode.
    config: {
      seedData: SEED_CHECKOUTS['1'],
      offerMode: 'modal',
    },
  },
  {
    id: 'offer-carousel',
    name: 'Inline Offer Carousel (Seed 2)',
    description:
      'Redesigned confirmation page that shows the same offers inline as a carousel instead of forced modals.',
    group: 'Post-purchase offers',
    type: 'config',
    config: {
      seedData: SEED_CHECKOUTS['2'],
      ConfirmationComponent: ConfirmationPageV2,
      offerMode: 'inline',
    },
  },
  {
    id: 'countdown-timer',
    name: '10-Minute Countdown',
    description:
      'A 10-minute countdown runs in the header during checkout. If it hits zero before you finish, you get kicked back out to the landing page.',
    group: 'Checkout timing & pressure',
    type: 'config',
    config: {
      timer: { minutes: 10 },
    },
  },
  {
    id: 'no-timer-modal',
    name: 'No-Timer Reassurance (Modal)',
    description:
      "A modal at the start of checkout reassures the user they won't be timed, unlike competitors.",
    group: 'Checkout timing & pressure',
    type: 'config',
    config: {
      reassurance: 'modal',
    },
  },
  {
    id: 'no-timer-inline',
    name: 'No-Timer Reassurance (Order Summary)',
    description:
      'The same "no timer" reassurance as the modal variant, shown as a tinted card in the order summary directly under the total. Persistent on every checkout step rather than shown once.',
    group: 'Checkout timing & pressure',
    type: 'config',
    config: {
      reassurance: 'rail',
    },
  },

  // Example of a diverging variation via the escape hatch (uncomment + implement):
  // {
  //   id: 'one-page',
  //   name: 'One-Page Checkout',
  //   description: 'Collapses login/shipping/payment into a single scrollable page.',
  //   group: 'Flow structure',
  //   type: 'custom',
  //   element: <OnePageCheckout basePath="/one-page" />,
  // },
]

export function getVariant(id) {
  return VARIANTS.find((v) => v.id === id) || null
}

// Merges a variant's partial config over BASELINE so unspecified fields are inherited.
// Shallow merge is enough for today's flat config; if we later add a nested slot map
// (see the "reusable component kit" future enhancement in EXPERIMENTS.md), deep-merge
// that key here so a variant overriding one slot still inherits the rest.
export function resolveConfig(variant) {
  return { ...BASELINE, ...(variant.config || {}) }
}

// Maps the retired ?seed= param to its variant id so completed-study links keep working.
export const SEED_ALIASES = { '1': 'offer-modals', '2': 'offer-carousel' }
