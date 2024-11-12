import { useEffect } from "react";
import {
  getBatches,
  deleteBatch,
} from "../app/controllers/batch/batchController"; // Add deleteBatch import
import { useDispatch, useSelector } from "react-redux";
import { setBatches } from "../app/features/batches/batchSlice";
import { selectBatches } from "../app/features/batches/batchSelectors";
import Header from "../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const Batches = () => {
  const dispatch = useDispatch();
  const batches = useSelector(selectBatches);
  const navigate = useNavigate(); // For navigation on edit

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await getBatches();
      dispatch(setBatches(response?.data));
    } catch (error) {
      console.log("Error fetching batches >>>", error);
    }
  };

  const handleEdit = (batch) => {
    // Navigate to an edit page or pass batch data to a form
    navigate(`/update?type=batch`, { state: { batch } });
  };

  const handleDelete = async (batchId: string) => {
    try {
      await deleteBatch(batchId); // Assuming deleteBatch is an API call
      fetchBatches(); // Refresh the list after deletion
    } catch (error) {
      console.log("Error deleting batch >>>", error);
    }
  };

  return (
    <>
      <Header isAdmin={true} />
      <div>
        {batches && batches.length > 0 && (
          <div className="mt-8 px-8">
            <h3 className="text-xl font-semibold mb-4">Batches</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Batch Name</th>
                  <th className="border border-gray-300 p-2">Start Date</th>
                  <th className="border border-gray-300 p-2">End Date</th>
                  <th className="border border-gray-300 p-2">Students</th>
                  <th className="border border-gray-300 p-2">Tests</th>
                  <th className="border border-gray-300 p-2">Actions</th>{" "}
                  {/* New Actions Column */}
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch._id}>
                    <td className="border border-gray-300 p-2">
                      <Link to={`/batches/${batch._id}`} state={{ batch }}>
                        {batch.batch_name}
                      </Link>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(batch.start_date).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(batch.end_date).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {batch.students.length}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {batch.tests.length}
                    </td>
                    <td className="border border-gray-300 p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(batch)}
                        className="bg-blue-500 text-white p-2 rounded flex items-center gap-1"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(batch._id)}
                        className="bg-red-500 text-white p-2 rounded flex items-center gap-1"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Batches;
