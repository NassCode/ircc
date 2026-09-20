import { useState } from 'react';

export function AdminAccordion({ title, description, badge, icon = 'fas fa-sliders-h', defaultOpen = false, children, className = '' }) {
  const [open, setOpen] = useState(defaultOpen);
  return <details className={`admin-accordion ${badge !== undefined ? 'admin-accordion-has-badge' : ''} ${className}`} open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
    <summary>
      <span className="admin-accordion-section-icon" aria-hidden="true"><span className={icon} /></span>
      <span className="admin-accordion-heading"><strong>{title}</strong>{description && <small>{description}</small>}</span>
      {badge !== undefined && <span className="admin-accordion-badge">{badge}</span>}
      <span className="admin-accordion-icon" aria-hidden="true" />
    </summary>
    <div className="admin-accordion-content">{children}</div>
  </details>;
}
