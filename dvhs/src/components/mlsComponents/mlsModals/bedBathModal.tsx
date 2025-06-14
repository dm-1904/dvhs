import React, { useState } from "react";
import "../../../css/modal.css";

interface BedBathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (minBeds: string, minBaths: string, denOffice: boolean) => void;
}

export const BedBathModal: React.FC<BedBathModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [minBeds, setMinBeds] = useState("");
  const [minBaths, setMinBaths] = useState("");
  const [denOffice, setDenOffice] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Beds &amp; Baths</h2>

        <div
          className="price-inputs"
          id="bed-bath-inputs"
        >
          <div>
            <label>Minimum Beds</label>
            <input
              type="number"
              min={0}
              placeholder="Any"
              value={minBeds}
              onChange={(e) => setMinBeds(e.target.value)}
            />
          </div>

          <div>
            <label>Minimum Baths</label>
            <input
              type="number"
              min={0}
              placeholder="Any"
              value={minBaths}
              onChange={(e) => setMinBaths(e.target.value)}
            />
          </div>
          <div className="den-office-checkbox">
            <label className="den-office-checkbox-label">
              <input
                type="checkbox"
                checked={denOffice}
                onChange={(e) => setDenOffice(e.target.checked)}
              />
              Den / Office
            </label>
          </div>
        </div>

        <div className="price-modal-btns">
          <button
            className="modal-close-btn search-bar-save-btn"
            onClick={() => onApply(minBeds, minBaths, denOffice)}
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
