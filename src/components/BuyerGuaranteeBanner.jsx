const ShieldCheckIcon = () => (
  <svg
    className="guarantee-icon"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 2.5L3.75 5v4.375c0 4.063 2.625 7.863 6.25 8.75 3.625-.887 6.25-4.687 6.25-8.75V5L10 2.5z"
      stroke="#04092C"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 10l1.875 1.875L12.5 8.125"
      stroke="#04092C"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function BuyerGuaranteeBanner() {
  return (
    <div className="guarantee-banner">
      <div className="guarantee-inner">
        <ShieldCheckIcon />
        <p className="guarantee-text">
          {'100% buyer guarantee for every ticket sold. '}
          <a href="#">Learn more.</a>
        </p>
      </div>
    </div>
  )
}
