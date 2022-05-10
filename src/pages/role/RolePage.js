import { useParams } from "react-router-dom";
import CommonPage from "../../components/CommonPage";
import Roles from "./Roles";
import RoleForm from "./RoleForm";

export default function RolePage() {
  const { id, action } = useParams();

  return (
    <CommonPage
      id={id}
      action={action}
      title="Role Management"
      viewAll={<Roles />}
      addOrEdit={<RoleForm id={id} />}
    />
  );
}
