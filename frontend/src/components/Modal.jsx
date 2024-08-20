// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, bidders }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Bidders</h2>
        <ul>
          {bidders.map((bidder, index) => (
            <li key={index}>{bidder}</li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 300px;
        }
      `}</style>
    </div>
  );
};

export default Modal;
