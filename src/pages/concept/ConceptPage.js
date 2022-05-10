import { useParams } from "react-router-dom";
import CommonPage from "../../components/CommonPage";
import Concepts from "./Concepts";
import ConceptForm from "./ConceptForm";
import ConceptView from "./ConceptView";

export default function ConceptPage() {
  const { id, action } = useParams();

  return (
    <CommonPage
      id={id}
      action={action}
      title="Concept Management"
      viewAll={<Concepts />}
      viewEach={<ConceptView id={id} />}
      addOrEdit={<ConceptForm id={id} />}
    />
  );
}
