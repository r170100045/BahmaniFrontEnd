import { Link, Redirect } from 'react-router-dom';
import MaterialTable, { MTableToolbar } from 'material-table';
import { useEffect, useState } from 'react';

import Controls from '../../components/controls/Controls';
import EditIcon from '@material-ui/icons/Edit';
import { getAllPersonAttributeTypes } from '../../services/personAttributeTypeService';
import { getUsers } from '../../services/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [redirect, setRedirect] = useState(null);

  const columns = [
    {
      title: 'System ID',
      field: 'systemId',
    },
    {
      title: 'User Name',
      field: 'username',
    },
    {
      title: 'Given Name',
      field: '',
    },
    {
      title: 'Family Name',
      field: 'description',
    },
    {
      title: 'Roles',
      field: '',
    },
  ];

  const options = {
    pageSize: 3,
    pageSizeOptions: [3, 5, 10, 20],
    emptyRowsWhenPaging: false,
    actionsColumnIndex: -1,
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (e) {
        console.warn(e);
      }
    };

    loadUsers();
  }, []);

  const components = {
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <div className="text-end" style={{ padding: '0px 10px' }}>
          <Link to="/user/edit/add">
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
      onClick: (event, rowData) => setRedirect(`/user/${rowData.uuid}`),
    },
  ];

  if (redirect) return <Redirect to={redirect} />;

  return (
    <>
      <div style={{ maxWidth: '90%', margin: 'auto' }}>
        <MaterialTable
          title="Users"
          data={users}
          columns={columns}
          options={options}
          components={components}
          actions={actions}
        />
      </div>
    </>
  );
};

export default Users;
