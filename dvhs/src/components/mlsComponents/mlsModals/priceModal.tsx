import React, { useState } from "react";
import "../../../css/modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (minPrice: string, maxPrice: string) => void;
  // children: React.ReactNode;
}

export const PriceModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Price Range</h2>

        <div className="price-inputs">
          <div>
            <label htmlFor="">Minimum Price</label>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="">Maximum Price</label>
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="price-modal-btns">
          <button
            className="modal-close-btn search-bar-save-btn"
            onClick={() => {
              onApply(minPrice, maxPrice);
            }}
          >
            Apply
          </button>
          <button
            className="modal-close-btn search-bar-save-btn"
            onClick={onClose}
          >
            Close Without Saving
          </button>
        </div>
      </div>
    </div>
  );
};
