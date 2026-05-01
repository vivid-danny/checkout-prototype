export default function PrototypeControls({ actions = [], onReset, users = [], activeUser, onUserChange }) {
  return (
    <div className="prototype-panel">
      <div className="prototype-panel-header">
        <span className="prototype-panel-title">Prototype</span>
      </div>
      <div className="prototype-panel-body">
        {users.length > 0 && (
          <>
            <div className="prototype-user-section">
              <span className="prototype-user-label">User Type</span>
              <div className="prototype-user-btns">
                {users.map(({ id, label }) => (
                  <button
                    key={id}
                    className={`prototype-user-btn${activeUser === id ? ' prototype-user-btn--active' : ''}`}
                    onClick={() => onUserChange(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="prototype-panel-divider" />
          </>
        )}

        {actions.length > 0 && actions.map((action, i) => (
          <button key={i} className="prototype-action-btn" onClick={action.onClick}>
            {action.label}
          </button>
        ))}

        {actions.length === 0 && users.length === 0 && !onReset && (
          <p className="prototype-panel-empty">No actions</p>
        )}

        {onReset && (
          <>
            {actions.length > 0 && <div className="prototype-panel-divider" />}
            <button className="prototype-action-btn prototype-action-btn--reset" onClick={onReset}>
              Clear &amp; Restart
            </button>
          </>
        )}
      </div>
    </div>
  )
}
