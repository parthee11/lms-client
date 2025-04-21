import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import CreateUserForm from "../components/forms/UserForm";
import BatchForm from "../components/forms/BatchForm";
import TestsForm from "../components/forms/TestsForm";
import QuestionsForm from "../components/forms/QuestionsForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const CreateEntity = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const navigate = useNavigate();

  const renderTitle = (type: string) => {
    switch (type) {
      case "user":
        return t("student");
      case "batch":
        return t("batch");
      case "test":
        return t("test");
      case "question":
        return t("question");
      default:
        return t("entity");
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
            <CardTitle className="font-bold text-2xl">
              {t("create")} {renderTitle(type as string)}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderForm(type as string)}</CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateEntity;
