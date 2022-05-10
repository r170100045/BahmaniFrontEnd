import { Form, useForm } from '../../components/useForm';
import { Redirect, useParams } from 'react-router-dom';
import {
  deletePatientRelationshipTypeById,
  getPatientRelationshipTypeById,
  insertPatientRelationshipType,
  updatePatientRelationshipTypeById,
} from '../../services/patientRelationshipTypeService';
import { useCallback, useEffect, useState } from 'react';

import Controls from '../../components/controls/Controls';
import { Grid } from '@material-ui/core';

const initialFValues = {
  aisToB: '',
  bisToA: '',
  description: '',
  retireReason: '',
  retired: '',
};

const PatientRelationshipForm = () => {
  const { id } = useParams();
  const [redirect, setRedirect] = useState(null);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('fullName' in fieldValues)
      temp.fullName = fieldValues.fullName ? '' : 'This field is required.';
    if ('email' in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email)
        ? ''
        : 'Email is not valid.';
    if ('mobile' in fieldValues)
      temp.mobile =
        fieldValues.mobile.length > 9 ? '' : 'Minimum 10 numbers required.';
    if ('departmentId' in fieldValues)
      temp.departmentId =
        fieldValues.departmentId.length !== 0 ? '' : 'This field is required.';
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === '');
  };

  const { values, setValues, errors, setErrors, handleInputChange, clearForm } =
    useForm(initialFValues, true, validate);

  const loadRelationshipTypeData = useCallback(async () => {
    if (id !== 'add') {
      const response = await getPatientRelationshipTypeById(id);
      setValues(response.data);
    } else {
      setValues(initialFValues);
    }
  }, [id, setValues]);

  useEffect(() => {
    loadRelationshipTypeData();
  }, [loadRelationshipTypeData]);

  const toggleRetired = () => {
    setValues((prevValues) => {
      return {
        ...prevValues,
        retired: !prevValues.retired,
      };
    });
  };

  const save = () => {
    const saveItem = async () => {
      var response;
      if (id === 'add') {
        response = await insertPatientRelationshipType(values);
      } else {
        response = await updatePatientRelationshipTypeById(id, values);
      }
      if (response.status === 200 || response.status === 201) {
        setRedirect('/patientRelationshipType/view/all');
      }
    };

    saveItem();

    //   if (validate()){
    //     employeeService.insertEmployee(values)
    //     resetForm()
    // }
  };

  const reset = () => {
    loadRelationshipTypeData();
  };

  const cancel = () => {
    setRedirect('/patientRelationshipType/view/all');
  };

  const deleteItem = () => {
    const deleteItemFunc = async () => {
      const response = await deletePatientRelationshipTypeById(id);
      if (response.status === 204) {
        setRedirect('/patientRelationshipType/view/all');
      }
    };
    deleteItemFunc();
  };

  if (redirect) return <Redirect to={redirect} />;

  return (
    <Form>
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            label="A is to B"
            name="aisToB"
            value={values.aisToB}
            onChange={handleInputChange}
          />

          <Controls.Input
            label="B is to A"
            name="bisToA"
            value={values.bisToA}
            onChange={handleInputChange}
          />

          <Controls.Input
            label="Description"
            name="description"
            value={values.description}
            onChange={handleInputChange}
            multiline
            rows={4}
          />

          <div>
            <Controls.SaveButton onClick={save} />
            <Controls.ResetButton onClick={reset} />
            <Controls.CancelButton onClick={cancel} />
          </div>
        </Grid>

        {id !== 'add' && (
          <Grid item xs={6}>
            <Controls.Input
              label="Reason To Retire"
              name="retireReason"
              value={values.retireReason}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
            <Controls.DeleteButton onClick={deleteItem} />
            <Controls.RetireButton
              retired={values.retired}
              onClick={toggleRetired}
            />
          </Grid>
        )}
      </Grid>
    </Form>
  );
};

export default PatientRelationshipForm;
