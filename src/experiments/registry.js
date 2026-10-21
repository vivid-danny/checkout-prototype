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
//
// timerIntro: 'none'   -> the timer (if any) just appears (default)
//             'modal'  -> a modal on the first post-login step explains why there
//                         is a countdown, and the clock starts when it's dismissed
//                         rather than on arrival. Only meaningful alongside `timer`.
//
// defaultTicketType: 'hard-stock' -> the flow starts on the shipped order, so the
//                                    user fills in a shipping step (default)
//                    'e-ticket'   -> digital tickets: login goes straight to
//                                    payment and the flow is 2 steps instead of 3
//
// pricing: 'always'      -> the rail price breakdown is visible on every step (default)
//          'after-login'  -> the breakdown is withheld on the login step and appears
//                           once the user is into the checkout steps
//
// railDetail: 'full'     -> the rail shows the full price breakdown and the in-hand
//                           date (default)
//             'minimal'  -> the breakdown collapses to an "All-In Ticket Price" row
//                           (fees and shipping folded into the unit price) plus taxes
//                           over a "Total Amount" row, and the in-hand date is dropped
export const BASELINE = {
  seedData: null,
  ConfirmationComponent: ConfirmationPage,
  offerMode: 'none',
  timer: null,
  reassurance: 'none',
  timerIntro: 'none',
  defaultTicketType: 'hard-stock',
  pricing: 'always',
  railDetail: 'full',
}

export const VARIANTS = [
  {
    id: 'baseline',
    name: 'Baseline',
    description: 'Standard checkout. No offers, no timer.',
    group: 'Baseline',
    type: 'config',
    config: {}, // pure BASELINE
  },
  {
    id: 'offer-modals',
    name: 'Forced Offer Modals (Seed 1)',
    description: 'Post-purchase offers as full-screen modals.',
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
    description: 'Post-purchase offers inline on a redesigned confirmation page.',
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
    name: '10-Minute Timer',
    description: 'Digital tickets. Countdown in the header, expiry kicks you back out.',
    group: 'Checkout timing & pressure',
    type: 'config',
    config: {
      timer: { minutes: 10 },
      defaultTicketType: 'e-ticket',
      pricing: 'after-login',
      railDetail: 'minimal',
    },
  },
  {
    id: 'countdown-timer-context',
    name: '10-Minute Timer, Explained',
    description: 'Digital tickets. A modal explains the countdown before the clock starts.',
    group: 'Checkout timing & pressure',
    type: 'config',
    config: {
      timer: { minutes: 10 },
      timerIntro: 'modal',
      defaultTicketType: 'e-ticket',
      pricing: 'after-login',
      railDetail: 'minimal',
    },
  },
  {
    id: 'no-timer-modal',
    name: 'No-Timer Promise (Modal)',
    description: "Digital tickets. Modal up front: you won't be timed.",
    group: 'Checkout timing & pressure',
    type: 'config',
    config: {
      reassurance: 'modal',
      defaultTicketType: 'e-ticket',
      pricing: 'after-login',
      railDetail: 'minimal',
    },
  },
  {
    id: 'no-timer-inline',
    name: 'No-Timer Promise (Order Summary)',
    description: 'Digital tickets. The same promise pinned under the order total.',
    group: 'Checkout timing & pressure',
    type: 'config',
    config: {
      reassurance: 'rail',
      defaultTicketType: 'e-ticket',
      pricing: 'after-login',
      railDetail: 'minimal',
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
