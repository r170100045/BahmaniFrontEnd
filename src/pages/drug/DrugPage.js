import { useParams } from "react-router-dom";
import CommonPage from "../../components/CommonPage";
import DrugForm from "./DrugForm";
import Drugs from "./Drugs";

export default function PatientRelationshipTypePage() {
  const { id, action } = useParams();

  return (
    <CommonPage
      id={id}
      action={action}
      title="Medication Data: Drugs Management"
      viewAll={<Drugs />}
      addOrEdit={<DrugForm id={id} />}
    />
  );
}
