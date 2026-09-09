import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom'
import { Agentation } from 'agentation'
import CheckoutFlow from './CheckoutFlow'
import LandingPage from './pages/LandingPage'
import { getVariant, resolveConfig, SEED_ALIASES } from './experiments/registry'

// Resolves /<variantId>/... to a registry entry and renders its flow.
function VariantRoute() {
  const { variantId } = useParams()
  const variant = getVariant(variantId)
  if (!variant) return <Navigate to="/" replace />
  if (variant.type === 'custom') return variant.element
  // Merge the variant's partial config over BASELINE so it inherits shared defaults.
  return <CheckoutFlow config={resolveConfig(variant)} basePath={`/${variantId}`} />
}

// Back-compat for the retired ?seed= links from completed studies:
// /checkout/login?seed=1 -> /offer-modals/checkout/login (seed 2 -> offer-carousel,
// no/unknown seed -> baseline). Preserves the sub-path after /checkout.
function SeedRedirect() {
  const location = useLocation()
  const seed = new URLSearchParams(location.search).get('seed')
  const variantId = SEED_ALIASES[seed] || 'baseline'
  const sub = location.pathname.replace(/^\/checkout/, '')
  return <Navigate to={`/${variantId}/checkout${sub}`} replace />
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/checkout/*" element={<SeedRedirect />} />
        <Route path="/:variantId/*" element={<VariantRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}
