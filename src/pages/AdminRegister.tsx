import RegisterForm from "../components/auth/RegisterForm";
import Header from "../components/common/Header";

const AdminRegister = () => {
  return (
    <div>
      <Header isAdmin={true} />
      <RegisterForm />
    </div>
  );
};

export default AdminRegister;
