import { useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import CreateUserForm from "../components/forms/UserForm";
import BatchForm from "../components/forms/BatchForm";
import TestsForm from "../components/forms/TestsForm";

const UpdateEntity = () => {
  const location = useLocation(); // Get the current location object
  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const type = queryParams.get("type"); // Get the value of the 'type' query parameter

  return (
    <>
      <Header isAdmin={true} />
      <div className="flex items-center justify-center h-auto py-6 bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center capitalize">
            Create {type}
          </h2>
          {type === "user" ? (
            <CreateUserForm create={false} />
          ) : type === "batch" ? (
            <BatchForm create={false} />
          ) : type === "test" ? (
            <TestsForm create={false} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateEntity;
