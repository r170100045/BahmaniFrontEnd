import { useParams } from "react-router-dom";
import CommonPage from "../../components/CommonPage";
import PersonAttributeForm from "./PersonAttributeForm";
import PersonAttributeTypes from "./PersonAttributeTypes";

export default function PersonAttributeTypePage() {
  const { id, action } = useParams();

  return (
    <CommonPage
      id={id}
      action={action}
      title="Person Attribute Management"
      viewAll={<PersonAttributeTypes />}
      addOrEdit={<PersonAttributeForm id={id} />}
    />
  );
}
