import { useParams } from "react-router-dom";
import CommonPage from "../../components/CommonPage";
import PrivilegeForm from "./PrivilegeForm";
import Privileges from "./Privileges";

export default function PrivilegePage() {
  const { id, action } = useParams();

  return (
    <CommonPage
      id={id}
      action={action}
      title="Privilege Management"
      viewAll={<Privileges />}
      addOrEdit={<PrivilegeForm id={id} />}
    />
  );
}
