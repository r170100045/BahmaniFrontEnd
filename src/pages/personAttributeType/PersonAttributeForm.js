import { Form, useForm } from '../../components/useForm';
import { Redirect, useParams } from 'react-router-dom';
import {
  deletePersonAttributeTypeById,
  getPersonAttributeTypeById,
  insertPersonAttributeType,
  updatePersonAttributeTypeById,
} from '../../services/personAttributeTypeService';
import { useCallback, useEffect, useState } from 'react';

import Controls from '../../components/controls/Controls';
import { FORMAT_OPTIONS } from '../../constants/otherConstants';
import { Grid } from '@material-ui/core';

const initialFValues = {
  name: '',
  description: '',
  format: '',
  searchable: false,
  retired: false,
  retireReason: '',
};

const PersonAttributeForm = () => {
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

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const loadPersonAttributeTypeData = useCallback(async () => {
    if (id !== 'add') {
      const response = await getPersonAttributeTypeById(id);
      setValues(response.data);
    } else {
      setValues(initialFValues);
    }
  }, [id, setValues]);

  useEffect(() => {
    loadPersonAttributeTypeData();
  }, [loadPersonAttributeTypeData]);

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
        response = await insertPersonAttributeType(values);
      } else {
        response = await updatePersonAttributeTypeById(id, values);
      }
      if (response.status === 200 || response.status === 201) {
        setRedirect('/personAttributeType/view/all');
      }
    };

    saveItem();
  };

  const reset = () => {
    loadPersonAttributeTypeData();
  };

  const cancel = () => {
    setRedirect('/personAttributeType/view/all');
  };

  const deleteItem = () => {
    const deleteItemFunc = async () => {
      const response = await deletePersonAttributeTypeById(id);
      if (response.status === 204) {
        setRedirect('/personAttributeType/view/all');
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
            label="Name"
            name="name"
            value={values.name}
            onChange={handleInputChange}
          />

          <Controls.Select
            label="Format"
            name="format"
            value={values.format}
            onChange={handleInputChange}
            options={FORMAT_OPTIONS}
          />

          <Controls.Checkbox
            label="Searchable"
            name="searchable"
            value={values.searchable}
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

export default PersonAttributeForm;
