import { useEffect } from "react";
import { getTests } from "../app/controllers/tests/testController"; // Add your API call for fetching tests
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { setTests } from "../app/features/tests/testsSlice";
import { selectTests } from "../app/features/tests/testsSelector";

const Tests = () => {
  const dispatch = useDispatch();
  const tests = useSelector(selectTests);
  const navigate = useNavigate(); // For navigation on edit

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await getTests();
      console.log("tests >>>", response?.data?.data);
      dispatch(setTests(response?.data?.data));
    } catch (error) {
      console.log("Error fetching tests >>>", error);
    }
  };

  const handleEdit = (test) => {
    // Navigate to an edit page or pass test data to a form
    navigate(`/update?type=test`, { state: { test } });
  };

  return (
    <>
      <Header isAdmin={true} />
      <div>
        {tests && tests?.length > 0 && (
          <div className="mt-8 px-8">
            <h3 className="text-xl font-semibold mb-4">Tests</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Test Name</th>
                  <th className="border border-gray-300 p-2">
                    Number of Questions
                  </th>
                  <th className="border border-gray-300 p-2">Timing</th>
                  {/* <th className="border border-gray-300 p-2">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test._id}>
                    <td className="border border-gray-300 p-2">
                      <Link to={`/tests/${test._id}`} state={{ test }}>
                        {test?.test_name}
                      </Link>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {test?.questions?.length}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {test.timing} minutes
                    </td>
                    {/* <td className="border border-gray-300 p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(test)}
                        className="bg-blue-500 text-white p-2 rounded flex items-center gap-1"
                      >
                        <FaEdit />
                      </button>
                    </td> */}
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

export default Tests;
