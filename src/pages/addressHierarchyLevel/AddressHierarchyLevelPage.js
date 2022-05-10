import AddressHierarchyLevels from './AddressHierarchyLevels';
import CommonPage from '../../components/CommonPage';
import { useParams } from 'react-router-dom';

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
