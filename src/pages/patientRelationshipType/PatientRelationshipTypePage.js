import CommonPage from '../../components/CommonPage';
import PatientRelationshipForm from './PatientRelationshipForm';
import PatientRelationshipTypes from './PatientRelationshipTypes';
import { useParams } from 'react-router-dom';

export default function PatientRelationshipTypePage() {
  const { id, action } = useParams();

  return (
    <CommonPage
      id={id}
      action={action}
      title="Patient Relationship Management"
      viewAll={<PatientRelationshipTypes />}
      addOrEdit={<PatientRelationshipForm id={id} />}
    />
  );
}
