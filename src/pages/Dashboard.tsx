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
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

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

      <div className="w-full">
        <div className="mt-10 flex items-center justify-center h-full">
          {userProfile ? (
            <div className="flex flex-col space-y-3">
              <Card className="rounded-xl overflow-hidden w-[125px] h-[125px]">
                <img
                  src={
                    userProfile?.role === "admin"
                      ? "https://api.dicebear.com/9.x/fun-emoji/svg?seed=George"
                      : "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jocelyn"
                  }
                  alt="user-avatar"
                  className="h-[125px] w-[125px] object-cover"
                />
              </Card>
              <div className="space-y-2">
                {userProfile?.username && (
                  <p>
                    <strong>Username:</strong> {userProfile?.username}
                  </p>
                )}
                {userProfile?.email ? (
                  <p>
                    <strong>Email:</strong> {userProfile.email}
                  </p>
                ) : null}
                {userProfile?.gender ? (
                  <p>
                    <strong>Gender:</strong> {userProfile.gender || "-"}
                  </p>
                ) : null}
                {userProfile?.rank ? (
                  <p>
                    <strong>Rank:</strong> {userProfile.rank || "-"}
                  </p>
                ) : null}
                {userProfile?.role ? (
                  <p>
                    <strong>Role:</strong> {userProfile.role}
                  </p>
                ) : null}
                {userProfile?.lms_score ? (
                  <p>
                    <strong>LMS Score:</strong> {userProfile.lms_score || "-"}
                  </p>
                ) : null}
                {userProfile?.batches.length ? (
                  <p>
                    <strong>Batches:</strong>{" "}
                    {userProfile.batches.length > 0
                      ? userProfile.batches.join(", ")
                      : "No batches assigned"}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[125px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
