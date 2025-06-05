// interface Listing {
//   id: string;
//   address: string;
//   price: number;
//   beds: number;
//   baths: number;
//   propertyType: string;
//   seniorCommunity: boolean;
// }

// const ResultsList: React.FC<{ results: Listing[] }> = ({ results }) => {
//   if (results.length === 0) return <p>No results to display.</p>;
//   return (
//     <div className="results-list">
//       {results.map((listing) => (
//         <div
//           key={listing.id}
//           className="listing-item"
//         >
//           <h4>
//             ${listing.price.toLocaleString()} – {listing.beds} Beds,{" "}
//             {listing.baths} Baths
//             {listing.seniorCommunity && " (55+)"}
//           </h4>
//           <p>
//             {listing.address} – {listing.propertyType}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ResultsList;
