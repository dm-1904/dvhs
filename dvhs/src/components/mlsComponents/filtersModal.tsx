// import React, { useState, useEffect } from "react";

// interface FiltersState {
//   priceMin: string;
//   priceMax: string;
//   bedsMin: string;
//   bathsMin: string;
//   propertyTypes: string[];
//   seniorOnly: boolean;
// }

// interface FiltersModalProps {
//   filters: FiltersState;
//   onApply: (newFilters: FiltersState) => void;
//   onClose: () => void;
// }

// const FiltersModal: React.FC<FiltersModalProps> = ({
//   filters,
//   onApply,
//   onClose,
// }) => {
//   // Local state for the filter inputs (initialized from props when modal opens)
//   const [tempFilters, setTempFilters] = useState<FiltersState>(filters);

//   useEffect(() => {
//     // Re-initialize local state when the modal is opened
//     setTempFilters(filters);
//   }, [filters]);

//   // Handlers for input changes, updating local tempFilters state
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setTempFilters((prev) => ({
//       ...prev,
//       // If checkbox (seniorOnly), use checked value, else use text input value
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Handler for toggling a property type in the list
//   const handleTypeToggle = (type: string, checked: boolean) => {
//     setTempFilters((prev) => {
//       let newTypes = [...prev.propertyTypes];
//       if (checked) {
//         // add type if not already in array
//         if (!newTypes.includes(type)) {
//           newTypes.push(type);
//         }
//       } else {
//         // remove type from array
//         newTypes = newTypes.filter((t) => t !== type);
//       }
//       return { ...prev, propertyTypes: newTypes };
//     });
//   };

//   // Click handler for Apply button
//   const applyAndClose = () => {
//     onApply(tempFilters);
//     // parent will handle closing modal via onApply or after setting state
//     // we can also explicitly call onClose here if desired: onClose();
//   };

//   return (
//     <div className="modal-backdrop">
//       <div className="modal-content">
//         <h3>Advanced Filters</h3>

//         {/* Price Range Inputs */}
//         <div className="filter-group">
//           <label>Price Range:</label>
//           <div>
//             <input
//               type="number"
//               name="priceMin"
//               value={tempFilters.priceMin}
//               onChange={handleInputChange}
//               placeholder="Min $"
//             />
//             &ndash;
//             <input
//               type="number"
//               name="priceMax"
//               value={tempFilters.priceMax}
//               onChange={handleInputChange}
//               placeholder="Max $"
//             />
//           </div>
//         </div>

//         {/* Beds (Min) */}
//         <div className="filter-group">
//           <label>Min Beds:</label>
//           <input
//             type="number"
//             name="bedsMin"
//             value={tempFilters.bedsMin}
//             onChange={handleInputChange}
//             min={0}
//           />
//         </div>

//         {/* Baths (Min) */}
//         <div className="filter-group">
//           <label>Min Baths:</label>
//           <input
//             type="number"
//             name="bathsMin"
//             value={tempFilters.bathsMin}
//             onChange={handleInputChange}
//             min={0}
//           />
//         </div>

//         {/* Home Type (PropertySubType) checkboxes */}
//         <div className="filter-group">
//           <label>Home Type:</label>
//           <div className="checkbox-list">
//             {["House", "Townhome", "Condo"].map((type) => (
//               <label key={type}>
//                 <input
//                   type="checkbox"
//                   checked={tempFilters.propertyTypes.includes(type)}
//                   onChange={(e) => handleTypeToggle(type, e.target.checked)}
//                 />
//                 {type}
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* 55+ Communities Toggle */}
//         <div className="filter-group">
//           <label>
//             <input
//               type="checkbox"
//               name="seniorOnly"
//               checked={tempFilters.seniorOnly}
//               onChange={handleInputChange}
//             />
//             55+ Communities Only
//           </label>
//         </div>

//         {/* Modal action buttons */}
//         <div className="filter-actions">
//           <button
//             type="button"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={applyAndClose}
//           >
//             Apply Filters
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FiltersModal;
