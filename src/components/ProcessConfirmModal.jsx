import React from 'react'

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