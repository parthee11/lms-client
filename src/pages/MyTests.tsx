import { useEffect } from "react";
import { getMyTests } from "../app/controllers/tests/testController"; // API call to fetch user's tests
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { setMyTests } from "../app/features/my-tests/myTestsSlice"; // Redux action to set tests
import { selectMyTests } from "../app/features/my-tests/myTestsSelector"; // Selector to get tests from state

const MyTests = () => {
  const dispatch = useDispatch();
  const myTests = useSelector(selectMyTests);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyTests();
  }, []);

  const fetchMyTests = async () => {
    try {
      const response = await getMyTests();
      console.log("myTests >>>", response?.data?.data);
      dispatch(setMyTests(response?.data?.data));
    } catch (error) {
      console.log("Error fetching my tests >>>", error);
    }
  };

  const handleTakeTest = (test) => {
    const testUrl = `/my-tests/take/${test._id}`;
    const fullUrl = `${window.location.origin}${testUrl}`;
    const windowFeatures =
      "fullscreen=yes, width=" + screen.width + ", height=" + screen.height;

    const newWindow = window.open(fullUrl, "_blank", windowFeatures);
    if (newWindow) {
      // Pass state data to the new window using localStorage
      localStorage.setItem("testState", JSON.stringify(test));
      newWindow.focus();
    } else {
      alert("Please allow popups for this website");
    }
  };

  return (
    <>
      <Header isAdmin={false} />
      <div>
        {myTests && myTests?.length > 0 ? (
          <div className="mt-8 px-8">
            <h3 className="text-xl font-semibold mb-4">My Tests</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Test Name</th>
                  <th className="border border-gray-300 p-2">
                    Positive Scoring
                  </th>
                  <th className="border border-gray-300 p-2">
                    Negative Scoring
                  </th>
                  <th className="border border-gray-300 p-2">
                    Number of Questions
                  </th>
                  <th className="border border-gray-300 p-2">Timing</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myTests.map((test) => (
                  <tr key={test._id}>
                    <td className="border border-gray-300 p-2">
                      <Link to={`/my-tests/${test._id}`} state={{ test }}>
                        {test?.test_name}
                      </Link>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {test?.positive_scoring} points
                    </td>
                    <td className="border border-gray-300 p-2">
                      {test?.negative_scoring} points
                    </td>
                    <td className="border border-gray-300 p-2">
                      {test?.questions?.length}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {test.timing} minutes
                    </td>
                    <td className="border border-gray-300 p-2 flex gap-2">
                      {/* <button
                        onClick={() => handleEdit(test)}
                        className="bg-blue-500 text-white p-2 rounded flex items-center gap-1"
                      >
                        <FaEdit />
                      </button> */}
                      <button
                        onClick={() => handleTakeTest(test)}
                        className="bg-green-500 text-white p-2 rounded"
                      >
                        Take Test
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-8 px-8 text-gray-500">No tests available.</p>
        )}
      </div>
    </>
  );
};

export default MyTests;
