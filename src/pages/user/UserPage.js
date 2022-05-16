import CommonPage from "../../components/CommonPage";
import UserAddPrompt from "./UserAddPrompt";
import UserForm from "./UserForm";
import Users from "./Users";
import { useParams } from "react-router-dom";

export default function ConceptPage() {
  const { action, id, personId } = useParams();

  return (
    <CommonPage
      action={action}
      id={id}
      personId={personId}
      title="Users"
      viewAll={<Users />}
      addPrompt={<UserAddPrompt />}
      addOrEdit={<UserForm id={id} />}
    />
  );
}
