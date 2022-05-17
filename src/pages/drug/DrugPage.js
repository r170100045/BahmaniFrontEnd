import CommonPage from "../../components/CommonPage";
import DrugForm from "./DrugForm";
import Drugs from "./Drugs";
import { useParams } from "react-router-dom";

export default function PatientRelationshipTypePage() {
  const { id, action } = useParams();

  return (
    <CommonPage
      id={id}
      action={action}
      title="Medication Data: Concept Drugs Management"
      viewAll={<Drugs />}
      addOrEdit={<DrugForm />}
    />
  );
}
