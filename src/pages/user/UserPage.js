import CommonPage from "../../components/CommonPage";
import UserAddPrompt from "./UserAddPrompt";
import UserForm from "./UserForm";
import Users from "./Users";
import { useParams } from "react-router-dom";

export default function ConceptPage() {
  const { id, action } = useParams();

  // const displayData = id === "add" ? <UserAddPrompt /> : <UserForm id={id} />;

  return (
    <CommonPage
      id={id}
      action={action}
      title="Users"
      viewAll={<Users />}
      addOrEdit={<UserForm id={id} />}
      // displayForm={displayData}
    />
  );
}
