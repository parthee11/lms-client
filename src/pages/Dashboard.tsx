import { useEffect } from "react";
import Header from "../components/common/Header";
import { useSelector } from "react-redux";
import { selectUser } from "../app/features/auth/authSelectors";
import { getTests } from "../app/controllers/tests/testController";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const userProfile = useSelector(selectUser);
  const { t } = useTranslation();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      await getTests();
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

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
                {userProfile?.username ? (
                  <p>
                    <strong>{t("username")}:</strong> {userProfile.username}
                  </p>
                ): null}
                {userProfile?.email ? (
                  <p>
                    <strong>{t("email")}:</strong> {userProfile.email}
                  </p>
                ) : null}
                {userProfile?.gender ? (
                  <p>
                    <strong>{t("gender")}:</strong> {userProfile.gender || "-"}
                  </p>
                ) : null}
                {userProfile?.rank ? (
                  <p>
                    <strong>{t("rank")}:</strong> {userProfile.rank || "-"}
                  </p>
                ) : null}
                {userProfile?.role ? (
                  <p>
                    <strong>{t("role")}:</strong> {userProfile.role}
                  </p>
                ) : null}
                {userProfile?.lms_score ? (
                  <p>
                    <strong>{t("lms_score")}:</strong> {userProfile.lms_score || "-"}
                  </p>
                ) : null}
                {userProfile?.batches.length ? (
                  <p>
                    <strong>{t("batches")}:</strong>{" "}
                    {userProfile.batches.length > 0
                      ? userProfile.batches.join(", ")
                      : t("no_batches")}
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
