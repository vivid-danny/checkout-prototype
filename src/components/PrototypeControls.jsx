const TICKET_TYPES = [
  { id: 'hard-stock', label: 'Hard Stock' },
  { id: 'e-ticket', label: 'E-Tickets' },
]

export default function PrototypeControls({ actions = [], onReset, users = [], activeUser, onUserChange, ticketType, onTicketTypeChange }) {
  return (
    <div className="prototype-panel">
      <div className="prototype-panel-header">
        <span className="prototype-panel-title">Configuration</span>
      </div>
      <div className="prototype-panel-body">
        <div className="prototype-user-section">
          <span className="prototype-user-label">Ticket Type</span>
          <div className="prototype-user-btns">
            {TICKET_TYPES.map(({ id, label }) => (
              <button
                key={id}
                className={`prototype-user-btn${ticketType === id ? ' prototype-user-btn--active' : ''}`}
                onClick={() => onTicketTypeChange(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="prototype-panel-divider" />
        {users.length > 0 && (
          <>
            <div className="prototype-user-section">
              <span className="prototype-user-label">User Scenarios</span>
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
