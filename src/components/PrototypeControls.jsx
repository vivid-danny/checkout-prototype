export default function PrototypeControls({ actions = [], onReset }) {
  return (
    <div className="prototype-panel">
      <div className="prototype-panel-header">
        <div className="prototype-panel-dot" />
        <span className="prototype-panel-title">Prototype</span>
      </div>
      <div className="prototype-panel-body">
        {actions.length === 0 && !onReset ? (
          <p className="prototype-panel-empty">No actions</p>
        ) : (
          <>
            {actions.map((action, i) => (
              <button key={i} className="prototype-action-btn" onClick={action.onClick}>
                {action.label}
              </button>
            ))}
            {onReset && (
              <>
                {actions.length > 0 && <div className="prototype-panel-divider" />}
                <button className="prototype-action-btn prototype-action-btn--reset" onClick={onReset}>
                  Clear &amp; Restart
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
