# Checkout prototype — experiment system

This repo hosts multiple checkout UX variations for user testing on a single Vercel
instance. Variations are addressed by URL (`/<id>/checkout/...`) and listed on a landing
page at `/`. Everything is driven by one registry.

## How it fits together

| File | Role |
|------|------|
| `src/experiments/registry.js` | Single source of truth: the `BASELINE` config + the list of `VARIANTS`. |
| `src/CheckoutFlow.jsx` | The shared checkout flow (login → shipping → payment → confirmation), parameterized by a resolved `config` + `basePath`. |
| `src/pages/LandingPage.jsx` | Auto-generated index at `/`, grouping variants into cards. |
| `src/App.jsx` | Thin router: `/` → landing, `/<id>/checkout/...` → variant, `?seed=` back-compat, unknown → `/`. |

## Baseline + overrides (how propagation works)

`BASELINE` holds the default checkout config. A **config variant** declares only what it
*changes*; `resolveConfig()` merges that partial over `BASELINE`, so every field the
variant doesn't touch is inherited. Change `BASELINE` (or a shared component) once and it
propagates to every variant that didn't override that field. Responsive/mobile styling
lives in the shared components + `index.css`, so it propagates the same way.

## Adding a variation

### Config variant (most cases — no flow code)
Add one entry to `VARIANTS`:

```js
{
  id: 'my-idea',                 // becomes /my-idea/checkout/...
  name: 'My Idea',
  description: 'One line shown on the landing page.',
  group: 'Post-purchase offers', // clusters related variants on the landing page
  type: 'config',
  config: {                      // only the deltas from BASELINE
    seedData: SEED_CHECKOUTS['1'],
    ConfirmationComponent: ConfirmationPageV2,
    offerMode: 'inline',         // 'modal' | 'inline' | 'none'
  },
}
```

It gets a URL and a landing-page card automatically.

### Custom variant (the escape hatch — diverging ideas)
When an idea diverges too much to express as a config delta, register a self-contained
flow:

```js
{
  id: 'one-page', name: 'One-Page Checkout', group: 'Flow structure',
  type: 'custom',
  element: <OnePageCheckout basePath="/one-page" />,
}
```

A custom flow should still **import the shared components/pages** so it inherits their look
and behavior — the goal is to duplicate *composition*, not component internals.

## Reusable component or custom? How to decide

When a new idea comes in, figure out which bucket it's in. The key question is:
**"Will we want to reuse or vary this same thing again in future experiments?"**

1. **It's already a shared option** → just set it in the variant's `config`. No setup.
   Today's shared options: `seedData` (preloaded data), `ConfirmationComponent` (which
   confirmation page), `offerMode` (`modal` / `inline` / `none`). Two of these are simple
   settings; `ConfirmationComponent` is a swappable component — both work the same way.

2. **A new piece we'll want to reuse across experiments** — usually a **reusable
   component** (a payment layout, a banner, a timer), sometimes a setting → **make it
   shared.** Add it to the shared flow once as a swappable component/option; every future
   variant can then use it, and baseline changes still propagate. Small one-time cost,
   pays off each reuse.

3. **A one-off idea that diverges a lot and we won't revisit**
   (a radically different flow shape, a throwaway concept) → **go custom**
   (`type: 'custom'`). Full freedom, but it trades away automatic inheritance of
   baseline changes.

**Tie-breaker (rule of two):** if you're unsure between #2 and #3, start **custom** — it's
cheap and isolated. If a *second* experiment later wants the same thing, that's the signal
to promote it into a shared reusable component. Don't build shared infrastructure for
something only one experiment needs.

When in doubt, ask — describe the idea and we'll classify it together before building.

## Back-compat

The retired `?seed=1` / `?seed=2` links from completed studies still resolve:
`SEED_ALIASES` maps them to `offer-modals` / `offer-carousel` via a redirect in `App.jsx`.

---

## Future enhancements (deferred — not built yet)

These were considered while hardening the system and intentionally deferred to keep the
sandbox lean. Revisit when a concrete experiment needs them.

### 3. Decompose the baseline into a reusable component kit
`PaymentPage.jsx` (~730 lines) and the other pages are monolithic. Breaking them into
smaller reusable blocks (`PaymentForm`, `CardFields`, `BillingAddress`, `PriceSummary`,
`AddressForm`, field primitives) would make both slot-injection and full forks cheap: a
diverging variant re-composes a short page from shared blocks instead of copying hundreds
of lines, and baseline fixes (including responsive CSS) still reach it because it consumes
the blocks rather than duplicating them. **Not required for mobile/responsive** — that is
CSS on the existing shared components and propagates already.

### 4. Data-driven step sequence (test a *new page* in the flow)
Today the step order (login → shipping → payment) and the e-ticket branch are hardcoded in
`CheckoutFlow.jsx`, and "continue" navigates to hardcoded paths. To add, remove, reorder,
or A/B a whole page by config, make the sequence data: a `steps: ['login','shipping',
'payment']` list + a step registry (`id → { path, component, progressLabel }`), with
navigation advancing to the next step in the list and progress labels computed from list
length. Build this against the first real new-page experiment rather than speculatively.

### Also possible
- **Page-scoped slot map** — organize config `slots` by page (`chrome`, `login`, `payment`,
  `confirmation`) with named injection points, so components can be placed on specific
  pages or shown across steps. Pairs naturally with #3.
- **Testable mobile-layout variants** — distinct mobile layouts as their own experiments
  (viewport-gated component swaps), beyond baseline responsiveness.
