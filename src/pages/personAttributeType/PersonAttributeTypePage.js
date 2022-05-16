import CommonPage from "../../components/CommonPage";
import PersonAttributeTypeForm from "./PersonAttributeTypeForm";
import PersonAttributeTypes from "./PersonAttributeTypes";
import { useParams } from "react-router-dom";

export default function PersonAttributeTypePage() {
  const { id, action } = useParams();

  return (
    <CommonPage
      id={id}
      action={action}
      title="Person Attribute Management"
      viewAll={<PersonAttributeTypes />}
      addOrEdit={<PersonAttributeTypeForm />}
    />
  );
}
