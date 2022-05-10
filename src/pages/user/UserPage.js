import { useParams } from "react-router-dom";
import CommonPage from "../../components/CommonPage";
import Users from "./Users";
import UserForm from "./UserForm";
import UserAddPrompt from "./UserAddPrompt";

export default function ConceptPage() {
  const { id } = useParams();

  const displayData = id === "add" ? <UserAddPrompt /> : <UserForm id={id} />;

  return (
    <CommonPage
      id={id}
      title="Users"
      displayAll={<Users />}
      // displayForm={<UserForm id={id} />}
      displayForm={displayData}
    />
  );
}
