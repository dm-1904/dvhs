import React from "react";
import "../../../css/modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // children: React.ReactNode;
}

export const PriceModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Price Range</h2>
        <button
          className="modal-close-btn search-bar-save-btn"
          onClick={onClose}
        >
          Close Without Saving
        </button>
      </div>
    </div>
  );
};
