import CommonPage from "../../components/CommonPage";
import UserAddPrompt from "./UserAddPrompt";
import UserForm from "./UserForm";
import Users from "./Users";
import { useParams } from "react-router-dom";

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
