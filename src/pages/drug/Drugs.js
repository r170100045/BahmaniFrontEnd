import { FormControlLabel, Switch } from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import MaterialTable, { MTableToolbar } from 'material-table';
import { useEffect, useState } from 'react';

import Controls from '../../components/controls/Controls';
import EditIcon from '@material-ui/icons/Edit';
import { getDrugs } from '../../api/services';

const Drugs = () => {
  const [drugs, setDrugs] = useState([]);
  const [filteredDrugsOnRetired, setFilteredDrugsOnRetired] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRetired, setShowRetired] = useState(true);
  const [redirect, setRedirect] = useState(null);

  const columns = [
    {
      title: 'Name',
      field: 'name',
    },
    {
      title: 'Strength',
      field: 'strength',
    },
  ];

  const options = {
    pageSize: 3,
    pageSizeOptions: [3, 5, 10, 20],
    emptyRowsWhenPaging: false,
    actionsColumnIndex: -1,
  };

  useEffect(() => {
    const loadDrugs = async () => {
      const response = await getDrugs();
      setDrugs(response.data);
    };

    loadDrugs();
  }, []);

  useEffect(() => {
    if (showRetired) {
      setFilteredDrugsOnRetired(drugs);
    } else {
      setFilteredDrugsOnRetired(drugs.filter((drug) => drug.retired === false));
    }
    setIsLoading(false);
  }, [drugs, showRetired]);

  const toggleRetired = () => {
    setShowRetired((prevShowRetired) => !prevShowRetired);
  };

  const components = {
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <div class="text-end" style={{ padding: '0px 10px' }}>
          <FormControlLabel
            value="start"
            control={
              <Switch
                color="primary"
                onClick={() => toggleRetired()}
                checked={showRetired}
              />
            }
            label={showRetired ? 'Hide Retired' : 'Show Retired'}
            labelPlacement="start"
          />
          <Link to="/drug/edit/add">
            <Controls.AddButton />
          </Link>
        </div>
      </div>
    ),
  };

  const actions = [
    {
      icon: () => <EditIcon color="primary" />,
      tooltip: 'Edit',
      onClick: (event, rowData) => setRedirect(`/drug/edit/${rowData.uuid}`),
    },
  ];

  if (redirect) return <Redirect to={redirect} />;

  if (isLoading) return <p>loading...</p>;

  return (
    <>
      <div style={{ maxWidth: '96%', margin: 'auto' }}>
        <MaterialTable
          title="Drugs"
          data={filteredDrugsOnRetired}
          columns={columns}
          components={components}
          options={options}
          actions={actions}
        />
      </div>
    </>
  );
};

export default Drugs;
