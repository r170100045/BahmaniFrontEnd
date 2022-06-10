import { Link, Redirect } from "react-router-dom";
import MaterialTable, { MTableToolbar } from "material-table";
import { useEffect, useState } from "react";

import Controls from "../../components/controls/Controls";
import EditIcon from "@material-ui/icons/Edit";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import LoadingData from "../../utils/LoadingData";
import { getUsers } from "../../services/userService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [redirect, setRedirect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [httpRequestError, setHttpRequestError] = useState(null);
  const [httpRequestHasError, setHttpRequestHasError] = useState(false);

  const columns = [
    {
      title: "System ID",
      field: "systemId",
    },
    {
      title: "User Name",
      field: "username",
    },
    {
      title: "Given Name",
      field: "givenName",
    },
    {
      title: "Family Name",
      field: "familyName",
    },
    {
      title: "Roles",
      field: "userRoles",
      render: (rowData) => (
        <p>
          {rowData.userRoles.map((role, index) =>
            index === rowData.userRoles.length - 1 ? (
              <span key={index}>{role}</span>
            ) : (
              <span key={index}>{role + " | "}</span>
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
    actionsCellStyle: {
      paddingRight: "16px",
    },
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getUsers();
        setUsers(response.data);
      } catch (e) {
        console.log(e);
        setHttpRequestError("error: getUsers api call failed : " + e.message);
        setHttpRequestHasError(true);
      }
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  const components = {
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <div className="text-end" style={{ padding: "0px 10px" }}>
          <Controls.AddButton
            onClick={() => setRedirect("/user/edit/add/add")}
          />
        </div>
      </div>
    ),
  };

  const actions = [
    {
      icon: () => <EditIcon color="primary" />,
      tooltip: "Edit",
      onClick: (event, rowData) =>
        setRedirect(`/user/edit/${rowData.uuid}/dummy`),
    },
  ];

  if (redirect) return <Redirect to={redirect} />;

  if (isLoading) return <LoadingData />;

  return (
    <>
      {httpRequestHasError && <ErrorLoadingData message={httpRequestError} />}

      <div style={{ maxWidth: "96%", margin: "auto" }}>
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
