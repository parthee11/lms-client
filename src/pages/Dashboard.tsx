import { useEffect } from "react";
import Header from "../components/common/Header";
import { getMe } from "../app/controllers/auth/authController";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../app/features/auth/authSlice";
import { selectUser } from "../app/features/auth/authSelectors";
import { useNavigate } from "react-router-dom";
import { getBatches } from "../app/controllers/batch/batchController";
import { setBatches } from "../app/features/batches/batchSlice";
import { selectBatches } from "../app/features/batches/batchSelectors";
import { getUsers } from "../app/controllers/user/userController";
import { setUsers } from "../app/features/user/userSlice";
import { selectUsers } from "../app/features/user/userSelector";
import { getTests } from "../app/controllers/tests/testController";

export interface UserProfile {
  gender: string;
  _id: string;
  username: string;
  email: string;
  rank: number;
  role: string;
  lms_score: number;
  batches: any[]; // Adjust type as necessary
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector(selectUser);

  useEffect(() => {
    if (!userProfile) {
      fetchMe();
    }
  }, [userProfile]);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchMe = async () => {
    try {
      const response = await getMe();
      dispatch(setUser(response?.data?.data));
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await getTests();
      console.log("tests >>>", response);
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  const handleCreateBatch = () => navigate("/create?type=batch");
  const handleCreateQuestion = () => navigate("/create?type=question");
  const handleCreateUser = () => navigate("/create?type=user");
  const handleCreateTest = () => navigate("/create?type=test");

  return (
    <>
      <Header isAdmin={Boolean(userProfile?.role)} />
      <div className="flex items-center justify-center py-8 bg-gray-100 gap-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center">User Dashboard</h2>
          <div className="space-y-4">
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              {userProfile ? (
                <>
                  <p>
                    <strong>Username:</strong> {userProfile.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {userProfile.email}
                  </p>
                  <p>
                    <strong>Gender:</strong> {userProfile.gender || "-"}
                  </p>
                  <p>
                    <strong>Rank:</strong> {userProfile.rank || "-"}
                  </p>
                  <p>
                    <strong>Role:</strong> {userProfile.role}
                  </p>
                  <p>
                    <strong>LMS Score:</strong> {userProfile.lms_score || "-"}
                  </p>
                  <p>
                    <strong>Batches:</strong>{" "}
                    {userProfile.batches.length > 0
                      ? userProfile.batches.join(", ")
                      : "No batches assigned"}
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {userProfile?.role === "admin" && (
          <div className="w-full max-w-56 p-8 space-y-6 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold text-center">Actions</h3>
            <div className="flex flex-col justify-around gap-4">
              <button
                onClick={handleCreateBatch}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Create Batch
              </button>
              <button
                onClick={handleCreateQuestion}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Create Question
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Create User
              </button>
              <button
                onClick={handleCreateTest}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Create Test
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
