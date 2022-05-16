import CommonPage from "../../components/CommonPage";
import RoleForm from "./RoleForm";
import Roles from "./Roles";
import { useParams } from "react-router-dom";

export default function RolePage() {
  const { id, action } = useParams();

  return (
    <CommonPage
      id={id}
      action={action}
      title="Role Management"
      viewAll={<Roles />}
      addOrEdit={<RoleForm />}
    />
  );
}
