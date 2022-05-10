import { useParams } from "react-router-dom";
import CommonPage from "../../components/CommonPage";
import AddressHierarchyLevels from "./AddressHierarchyLevels";

export default function AddressHierarchyLevelPage() {
  const { action, id } = useParams();

  return (
    <CommonPage
      id={id}
      action={action}
      title="Address Hierarchy Management"
      viewAll={<AddressHierarchyLevels />}
    />
  );
}
