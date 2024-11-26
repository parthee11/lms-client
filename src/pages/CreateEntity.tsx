import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import CreateUserForm from "../components/forms/UserForm";
import BatchForm from "../components/forms/BatchForm";
import TestsForm from "../components/forms/TestsForm";
import QuestionsForm from "../components/forms/QuestionsForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateEntity = () => {
  const location = useLocation(); // Get the current location object
  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const type = queryParams.get("type"); // Get the value of the 'type' query parameter

  const navigate = useNavigate();

  const renderTitle = (type: string) => {
    switch (type) {
      case "user":
        return "Student";
      case "batch":
        return "Batch";
      case "test":
        return "Test";
      case "question":
        return "Question";
      default:
        return "Entity";
    }
  };

  const renderForm = (type: string) => {
    switch (type) {
      case "user":
        return <CreateUserForm create={true} />;
      case "batch":
        return <BatchForm create={true} />;
      case "test":
        return <TestsForm create={true} />;
      case "question":
        return <QuestionsForm create={true} />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <Header isAdmin={true} />

      <div className="px-4">
        <Button variant={"outline"} onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 mt-10">
        <Card className={`${type === "batch" ? "w-1/2" : "w-full"}`}>
          <CardHeader>
            <CardTitle className="font-bold text-2xl">Create {renderTitle(type as string)}</CardTitle>
          </CardHeader>
          <CardContent>{renderForm(type as string)}</CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateEntity;
