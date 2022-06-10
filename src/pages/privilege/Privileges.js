import { Link, Redirect } from "react-router-dom";
import MaterialTable, { MTableToolbar } from "material-table";
import { useEffect, useState } from "react";

import Controls from "../../components/controls/Controls";
import EditIcon from "@material-ui/icons/Edit";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import LoadingData from "../../utils/LoadingData";
import { getPrivileges } from "../../services/privilegeService";

const Privileges = () => {
  const [privileges, setPrivileges] = useState([]);
  const [redirect, setRedirect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [httpRequestError, setHttpRequestError] = useState(null);
  const [httpRequestHasError, setHttpRequestHasError] = useState(false);

  const columns = [
    {
      title: "Privilege Name",
      field: "privilege",
    },
    {
      title: "Description",
      field: "description",
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
    const loadPrivileges = async () => {
      try {
        setIsLoading(true);
        const response = await getPrivileges();
        setPrivileges(response.data);
      } catch (e) {
        console.warn(e);
        setHttpRequestError(
          "error: getPrivileges api call failed : " + e.message
        );
        setHttpRequestHasError(true);
      }
      setIsLoading(false);
    };

    loadPrivileges();
  }, []);

  const components = {
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <div className="text-end" style={{ padding: "0px 10px" }}>
          <Controls.AddButton
            onClick={() => setRedirect("/privilege/edit/add")}
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
        setRedirect(`/privilege/edit/${rowData.uuid}`),
    },
  ];

  if (redirect) return <Redirect to={redirect} />;

  if (isLoading) return <LoadingData />;

  return (
    <>
      {httpRequestHasError && <ErrorLoadingData message={httpRequestError} />}

      <div style={{ maxWidth: "96%", margin: "auto" }}>
        <MaterialTable
          title="Privileges"
          data={privileges}
          columns={columns}
          options={options}
          components={components}
          actions={actions}
        />
      </div>
    </>
  );
};

export default Privileges;
