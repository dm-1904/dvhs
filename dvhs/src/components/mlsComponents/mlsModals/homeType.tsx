import React, { useState, useEffect } from "react";
import "../../../css/modal.css";

interface Props {
  /** show / hide modal */
  isOpen: boolean;
  /** close handler (no changes) */
  onClose: () => void;
  /**
   * called when user clicks **Apply**.
   * The array contains the RESO *PropertySubType* strings
   * the user left checked.
   */
  onApply: (selected: string[]) => void;
}

/** UI label → Spark / RESO field value */
const PTYPES: Record<string, string> = {
  Houses: "Single Family Residence",
  Townhomes: "Townhouse",
  "Multi-family": "Multi Family",
  "Condos/Co-ops": "Apartment",
  "Lots/Land": "Land",
  Manufactured: "Manufactured Home",
};

export const PropertyTypeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  /* keep local checkbox state */
  const [selected, setSelected] = useState<string[]>(() =>
    Object.values(PTYPES)
  );

  /* reset the modal every time it’s reopened */
  useEffect(() => {
    if (isOpen) setSelected(Object.values(PTYPES));
  }, [isOpen]);

  if (!isOpen) return null;

  /* helpers */
  const toggle = (value: string) =>
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const deselectAll = () => setSelected([]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Property Type</h2>

        {/* ── Select / Deselect controls ────────────── */}
        <button
          style={{
            alignSelf: "flex-end",
            marginBottom: "0.75rem",
            fontSize: "0.9rem",
          }}
          onClick={deselectAll}
        >
          Deselect all
        </button>

        {/* ── Checkbox list ─────────────────────────── */}
        <div style={{ width: "100%", padding: "0 1.5rem" }}>
          {Object.entries(PTYPES).map(([label, value]) => (
            <label
              key={value}
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                margin: "0.4rem 0",
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(value)}
                onChange={() => toggle(value)}
              />
              {label}
            </label>
          ))}
        </div>

        {/* ── Action buttons ────────────────────────── */}
        <div className="price-modal-btns">
          <button
            className="modal-close-btn search-bar-save-btn"
            onClick={() => {
              onApply(selected); // ⬅️ send to parent
              onClose();
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
