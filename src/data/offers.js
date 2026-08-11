// Shared by both prototypes: seed 2 presents these in a carousel, seed 1 as back-to-back modals.
// Logo width/height are the design's box dimensions, applied as native img attributes so each
// logo keeps its own aspect ratio without a per-offer CSS rule.
export const OFFERS = [
  {
    id: 'apple-music',
    headline: 'Get over 100 million songs on Apple Music free for 1 month!',
    body: "You'll never hear a commercial and you can download anything for offline listening.",
    primaryCta: 'Join Now',
    logo: { src: '/apple-music-logo.png', alt: 'Apple Music', width: 120, height: 30 },
  },
  {
    id: 'shipments-free',
    headline: "You've unlocked $15 cashback!",
    body: 'Experience the convenience of ShipmentsFree.com and claim your offer to try now!',
    primaryCta: 'Claim Offer',
    logo: { src: '/shipments-free-logo.png', alt: 'Shipments Free', width: 174, height: 40 },
  },
  {
    id: 'aarp',
    headline: 'Become an AARP Member and Choose your Free Gift!',
    body: "Join AARP for only $12 your first year with automatic renewal - that's as little as $1 a month.",
    primaryCta: 'Join Now',
    logo: { src: '/aarp-logo.png', alt: 'AARP', width: 90, height: 56 },
  },
  {
    id: 'barkbox',
    headline: "You've earned a free box worth $35 from BarkBox!",
    body: 'Join now & double your box with 2 extra toys & 2 bags of treats in your first order! Your furry friend will thank you later.',
    primaryCta: 'Claim Offer',
    logo: { src: '/barkbox-photo.png', alt: 'BarkBox', width: 88, height: 88 },
  },
]
