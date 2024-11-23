import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import _ from "lodash"; // Import lodash for debounce
import CustomModal from "../components/common/CustomModal";
import {
  getTestsInBatch,
  searchTests,
} from "../app/controllers/tests/testController";
import {
  getStudentsInBatch,
  searchStudents,
} from "../app/controllers/user/userController";
import {
  addTestsToBatch,
  enrollToBatch,
} from "../app/controllers/batch/batchController";

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
  const [searchTestQuery, setSearchTestQuery] = useState("");

  if (!batch) return <div>No batch details found.</div>;

  // Fetch users or tests when search query changes (debounced)
  const handleSearch = useCallback(
    _.debounce(async (query) => {
      if (query) {
        const response = await searchStudents(query);
        setUsers(response?.data?.data?.users || []);
      }
    }, 300),
    []
  );

  const handleTestsSearch = useCallback(
    _.debounce(async (query) => {
      if (query) {
        const response = await searchTests(query);
        setTests(response?.data?.data || []);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      handleSearch(searchQuery);
    } else {
      setUsers([]);
    }
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    if (searchTestQuery.trim() !== "") {
      handleTestsSearch(searchTestQuery);
    } else {
      setTests([]);
    }
  }, [searchTestQuery, handleTestsSearch]);

  const handleEnrollUser = async () => {
    try {
      const response = await enrollToBatch(batch._id, selectedUsers);
      console.log("response >>>", response);
      window.location.reload();
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  const handleAddTest = async () => {
    try {
      const response = await addTestsToBatch(batch._id, selectedTests);
      console.log("response >>>", response);
      window.location.reload();
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  return (
    <>
      <Header isAdmin={true} />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{batch.batch_name}</h1>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(batch.start_date).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(batch.end_date).toLocaleDateString()}
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
          <RenderStudentsList batchId={batch?._id} />
        </div>

        <div className="mt-4">
          <h2 className="font-semibold">Assigned Tests:</h2>
          <RenderTestsList batchId={batch?._id} />
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
                key={user._id}
                className={`cursor-pointer ${
                  selectedUsers.includes(user._id) ? "font-bold" : ""
                }`}
                onClick={() =>
                  setSelectedUsers((prev) =>
                    prev.includes(user._id)
                      ? prev.filter((id) => id !== user._id)
                      : [...prev, user._id]
                  )
                }
              >
                {user.profile.name}
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
            value={searchTestQuery}
            onChange={(e) => setSearchTestQuery(e.target.value)}
          />
          <ul className="list-disc pl-6 mb-4">
            {tests.map((test) => (
              <li
                key={test._id}
                className={`cursor-pointer ${
                  selectedTests.includes(test._id) ? "font-bold" : ""
                }`}
                onClick={() =>
                  setSelectedTests(
                    (prev) =>
                      prev.includes(test._id)
                        ? prev.filter((id) => id !== test._id) // Remove if included
                        : [...prev, test._id] // Add if not included
                  )
                }
              >
                {test.test_name}
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

const RenderStudentsList = ({ batchId }) => {
  const [students, setStudents] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [batchId]);

  const fetchStudents = async () => {
    try {
      const response = await getStudentsInBatch(batchId);
      if (response?.data?.data?.students) {
        setStudents(response?.data?.data?.students);
      }
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  return (
    <>
      {students && (
        <ul className="list-disc pl-6">
          {students.map((student) => (
            <li key={student._id}>{student?.profile?.name}</li>
          ))}
        </ul>
      )}
    </>
  );
};

const RenderTestsList = ({ batchId }) => {
  const [tests, setTests] = useState(null);

  useEffect(() => {
    fetchTests();
  }, [batchId]);

  const fetchTests = async () => {
    try {
      const response = await getTestsInBatch(batchId);
      if (response?.data?.data?.tests) {
        setTests(response?.data?.data?.tests);
      }
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  return (
    <>
      {tests && (
        <ul className="list-disc pl-6">
          {tests.map((test) => (
            <li key={test._id}>{test?.test_name}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default BatchDetails;
