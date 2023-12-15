// eslint-disable-next-line no-unused-vars
import React from 'react'

// reusable component for modal
function ProcessConfirmModal({ children, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {children}
          </div>
        </div>
    );
}

export default ProcessConfirmModal;