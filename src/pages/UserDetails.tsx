import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import _ from "lodash"; // For debounce
import CustomModal from "../components/common/CustomModal";
import { useSelector } from "react-redux";
import { selectBatches } from "../app/features/batches/batchSelectors";
import { enrollToBatch } from "../app/controllers/batch/batchController";

const UserDetails = () => {
  const { state } = useLocation();
  const user = state?.user;
  const batches = useSelector(selectBatches);

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(""); // Selected batch for enrollment
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredBatches, setFilteredBatches] = useState(batches || []); // State for filtered batches

  if (!user) return <div>No user details found.</div>; // Fallback if user data is not available

  // Update filteredBatches based on the search query
  const handleBatchSearch = useCallback((query) => {
    if (!query) {
      setFilteredBatches(batches);
    } else {
      const filtered = batches.filter((batch) =>
        batch.batch_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBatches(filtered);
    }
  }, [batches]);

  useEffect(() => {
    handleBatchSearch(searchQuery);
  }, [searchQuery, handleBatchSearch]);

  const handleEnrollToBatch = async () => {
    if (!selectedBatch) {
      alert("Please select a batch.");
      return;
    }
  
    try {
      const response = await enrollToBatch(selectedBatch, [user._id]);
      console.log("Response >>>", response);
      alert("User enrolled successfully!");
      setIsEnrollModalOpen(false); // Close modal after enrollment
  
      // Update data without reloading the page (consider a state update here if needed)
      // Optionally refetch user or batch data if necessary
    } catch (error) {
      console.error("Enrollment Error >>>", error);
      alert("An error occurred while enrolling the user. Please try again.");
    }
  };

  return (
    <>
      <Header isAdmin={true} />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Details</h1>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Name:</strong> {user.profile.name}
        </p>
        <p>
          <strong>Phone:</strong> {user.profile.phone}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>

        <div className="mt-6">
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Enroll to Batch
          </button>
        </div>
      </div>

      {/* Enroll to Batch Modal */}
      {isEnrollModalOpen && (
        <CustomModal onClose={() => setIsEnrollModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Enroll to Batch</h2>
          <input
            type="text"
            placeholder="Search batches..."
            className="border p-2 w-full mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ul className="list-disc pl-6 mb-4">
            {filteredBatches && filteredBatches.map((batch) => (
              <li
                key={batch._id}
                className={`cursor-pointer ${
                  selectedBatch === batch._id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedBatch(batch._id)}
              >
                {batch.batch_name}
              </li>
            ))}
          </ul>
          <button
            onClick={handleEnrollToBatch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Enroll
          </button>
        </CustomModal>
      )}
    </>
  );
};

export default UserDetails;
