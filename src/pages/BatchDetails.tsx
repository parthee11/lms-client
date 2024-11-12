import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import _ from "lodash"; // Import lodash for debounce
import CustomModal from "../components/common/CustomModal";

const BatchDetails = () => {
  const { state } = useLocation();
  const batch = state?.batch;

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  if (!batch) return <div>No batch details found.</div>;

  // Fetch users or tests when search query changes (debounced)
  const handleSearch = useCallback(
    _.debounce(async (query) => {
      if (query) {
        const response = await fetch(`/api/search?query=${query}`);
        const data = await response.json();
        setUsers(data); // For tests, adjust this accordingly
      }
    }, 300),
    []
  );

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleEnrollUser = async () => {
    await fetch(`/api/batch/${batch._id}/enroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ students: selectedUsers }),
    });
    window.location.reload(); // Refresh the page to fetch updated data
  };

  const handleAddTest = async () => {
    await fetch(`/api/batch/${batch._id}/add-tests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tests: selectedTests }),
    });
    window.location.reload(); // Refresh the page to fetch updated data
  };

  return (
    <>
      <Header isAdmin={true} />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{batch.batch_name}</h1>
        <p>
          <strong>Start Date:</strong> {new Date(batch.start_date).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong> {new Date(batch.end_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Number of Students:</strong> {batch.students.length}
        </p>
        <p>
          <strong>Number of Tests:</strong> {batch.tests.length}
        </p>
        <p>
          <strong>Admin ID:</strong> {batch.admin_id}
        </p>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Enroll Users
          </button>

          <button
            onClick={() => setIsTestModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Tests
          </button>
        </div>

        <div className="mt-4">
          <h2 className="font-semibold">Enrolled Students:</h2>
          <ul className="list-disc pl-6">
            {batch.students.map((student) => (
              <li key={student}>{student}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h2 className="font-semibold">Assigned Tests:</h2>
          <ul className="list-disc pl-6">
            {batch.tests.map((test) => (
              <li key={test}>{test}</li>
            ))}
          </ul>
        </div>
      </div>

      {isEnrollModalOpen && (
        <CustomModal onClose={() => setIsEnrollModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Enroll Users</h2>
          <input
            type="text"
            placeholder="Search users..."
            className="border p-2 w-full mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ul className="list-disc pl-6 mb-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="cursor-pointer"
                onClick={() =>
                  setSelectedUsers((prev) =>
                    prev.includes(user.id) ? prev : [...prev, user.id]
                  )
                }
              >
                {user.name}
              </li>
            ))}
          </ul>
          <button
            onClick={handleEnrollUser}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </CustomModal>
      )}

      {isTestModalOpen && (
        <CustomModal onClose={() => setIsTestModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Add Tests</h2>
          <input
            type="text"
            placeholder="Search tests..."
            className="border p-2 w-full mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ul className="list-disc pl-6 mb-4">
            {tests.map((test) => (
              <li
                key={test.id}
                className="cursor-pointer"
                onClick={() =>
                  setSelectedTests((prev) =>
                    prev.includes(test.id) ? prev : [...prev, test.id]
                  )
                }
              >
                {test.name}
              </li>
            ))}
          </ul>
          <button
            onClick={handleAddTest}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add
          </button>
        </CustomModal>
      )}
    </>
  );
};

export default BatchDetails;
