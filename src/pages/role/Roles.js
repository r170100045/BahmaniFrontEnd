import { Link, Redirect } from "react-router-dom";
import MaterialTable, { MTableToolbar } from "material-table";
import { useEffect, useState } from "react";

import Controls from "../../components/controls/Controls";
import EditIcon from "@material-ui/icons/Edit";
import { getRoles } from "../../services/roleService";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [redirect, setRedirect] = useState(null);

  const columns = [
    {
      title: "Role",
      field: "role",
    },
    {
      title: "Description",
      field: "description",
    },
    {
      title: "Inherited Roles",
      field: "parentRoles",
      render: (rowData) => (
        <p>
          {rowData.parentRoles.map((parentRole, index) =>
            index === rowData.parentRoles.length - 1 ? (
              <span>{parentRole}</span>
            ) : (
              <span>{parentRole + " | "}</span>
            )
          )}
        </p>
      ),
    },
    {
      title: "Privileges",
      field: "rolePrivileges",
      render: (rowData) => (
        <p>
          {rowData.rolePrivileges.map((rolePrivilege, index) =>
            index === rowData.rolePrivileges.length - 1 ? (
              <span>{rolePrivilege}</span>
            ) : (
              <span>{rolePrivilege + " | "}</span>
            )
          )}
        </p>
      ),
    },
  ];

  const options = {
    pageSize: 3,
    pageSizeOptions: [3, 5, 10, 20],
    emptyRowsWhenPaging: false,
    actionsColumnIndex: -1,
  };

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await getRoles();
        setRoles(response.data);
      } catch (e) {
        console.warn(e);
      }
    };

    loadRoles();
  }, []);

  const components = {
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <div className="text-end" style={{ padding: "0px 10px" }}>
          <Link to="/role/edit/add">
            <Controls.AddButton />
          </Link>
        </div>
      </div>
    ),
  };

  const actions = [
    {
      icon: () => <EditIcon color="primary" />,
      tooltip: "Edit",
      onClick: (event, rowData) => setRedirect(`/role/edit/${rowData.uuid}`),
    },
  ];

  if (redirect) return <Redirect to={redirect} />;

  return (
    <>
      <div style={{ maxWidth: "96%", margin: "auto" }}>
        <MaterialTable
          title="Current Roles"
          data={roles}
          columns={columns}
          options={options}
          components={components}
          actions={actions}
        />
      </div>
    </>
  );
};

export default Roles;
