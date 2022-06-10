import MaterialTable, { MTableToolbar } from "material-table";
import { useEffect, useState } from "react";

import Controls from "../../components/controls/Controls";
import EditIcon from "@material-ui/icons/Edit";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import LoadingData from "../../utils/LoadingData";
import { Redirect } from "react-router-dom";
import { getRoles } from "../../services/roleService";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [redirect, setRedirect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [httpRequestError, setHttpRequestError] = useState(null);
  const [httpRequestHasError, setHttpRequestHasError] = useState(false);

  const generateRowData = (rowData, columnObj) => {
    let charCount = 0;
    let resData = "";
    let flag = 0;
    rowData[columnObj].forEach((el, index) => {
      if (charCount < 20) {
        if (index === rowData[columnObj].length - 1) {
          flag = 1;
          resData += el;
          charCount += el.length;
        } else {
          resData += el;
          charCount += el.length;
          if (charCount < 18) resData += ", ";
        }
      }
    });
    if (flag === 0 && resData !== "") resData += "...";
    return <p>{resData}</p>;
  };

  const getRoleData = (rowData) => {
    return generateRowData(rowData, "parentRoles");
  };

  const getPrivilegeData = (rowData) => {
    return generateRowData(rowData, "rolePrivileges");
  };

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
      render: (rowData) => getRoleData(rowData),
    },
    {
      title: "Privileges",
      field: "rolePrivileges",
      render: (rowData) => getPrivilegeData(rowData),
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
    const loadRoles = async () => {
      try {
        setIsLoading(true);
        const response = await getRoles();
        setRoles(response.data);
      } catch (e) {
        console.log(e);
        setHttpRequestError("error: getRoles api call failed : " + e.message);
        setHttpRequestHasError(true);
      }
      setIsLoading(false);
    };

    loadRoles();
  }, []);

  const components = {
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <div className="text-end" style={{ padding: "0px 10px" }}>
          <Controls.AddButton onClick={() => setRedirect("/role/edit/add")} />
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

  if (isLoading) return <LoadingData />;

  return (
    <>
      {httpRequestHasError && <ErrorLoadingData message={httpRequestError} />}

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
