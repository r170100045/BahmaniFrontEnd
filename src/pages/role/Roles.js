import MaterialTable, { MTableToolbar } from "material-table";
import { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import Controls from "../../components/controls/Controls";
import { getRoles } from "../../services/roleService";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [redirect, setRedirect] = useState(null);

  const columns = [
    {
      title: "Role",
      field: "role"
    },
    {
      title: "Description",
      field: "description"
    },
    {
      title: "Inherited Roles",
      field: "parentRoles"
    },
    {
      title: "Privileges",
      field: "rolePrivileges"
    }
  ];

  const options = {
    pageSize: 3,
    pageSizeOptions: [3, 5, 10, 20],
    emptyRowsWhenPaging: false,
    actionsColumnIndex: -1
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
    )
  };

  const actions = [
    {
      icon: () => <EditIcon color="primary" />,
      tooltip: "Edit",
      onClick: (event, rowData) => setRedirect(`/role/edit/${rowData.uuid}`)
    }
  ];

  if (redirect) return <Redirect to={redirect} />;

  return (
    <>
      <div style={{ maxWidth: "90%", margin: "auto" }}>
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
