import CommonPage from '../../components/CommonPage';
import VisitTypeForm from './VisitTypeForm';
import VisitTypes from './VisitTypes';
import { useParams } from 'react-router-dom';

export default function VisitTypePage() {
  const { id, action } = useParams();

  return (
    <CommonPage
      id={id}
      action={action}
      title="Visit Type Management"
      viewAll={<VisitTypes />}
      addOrEdit={<VisitTypeForm id={id} />}
    />
  );
}
