import { Link, Redirect } from "react-router-dom";
import MaterialTable, { MTableToolbar } from "material-table";
import { useEffect, useState } from "react";

import Controls from "../../components/controls/Controls";
import EditIcon from "@material-ui/icons/Edit";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import LoadingData from "../../utils/LoadingData";
import { getAllVisitTypes } from "../../services/visitTypeService";

const VisitTypes = () => {
  const [visitTypes, setVisitTypes] = useState([]);
  const [redirect, setRedirect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [httpRequestError, setHttpRequestError] = useState(null);
  const [httpRequestHasError, setHttpRequestHasError] = useState(false);

  const columns = [
    {
      title: "Name",
      field: "name",
      render: (rowData) => (
        <p
          style={{ textDecoration: rowData.retired ? "line-through" : "none" }}
        >
          {rowData.name}
        </p>
      ),
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
  };

  useEffect(() => {
    const loadVisitTypes = async () => {
      try {
        setIsLoading(true);
        const response = await getAllVisitTypes();
        setVisitTypes(response.data);
      } catch (e) {
        console.log(e);
        setHttpRequestError(
          "error: getAllVisitTypes api call failed : " + e.message
        );
        setHttpRequestHasError(true);
      }
      setIsLoading(false);
    };

    loadVisitTypes();
  }, []);

  const components = {
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <div className="text-end" style={{ padding: "0px 10px" }}>
          <Controls.AddButton
            onClick={() => setRedirect("/visitType/edit/add")}
          />
        </div>
      </div>
    ),
  };

  const actions = [
    {
      icon: () => <EditIcon color="primary" style={{ marginRight: 20 }} />,
      tooltip: "Edit",
      onClick: (event, rowData) =>
        setRedirect(`/visitType/edit/${rowData.uuid}`),
    },
  ];

  if (redirect) return <Redirect to={redirect} />;

  if (isLoading) return <LoadingData />;

  return (
    <>
      {httpRequestHasError && <ErrorLoadingData message={httpRequestError} />}

      <div style={{ maxWidth: "96%", margin: "auto" }}>
        <MaterialTable
          title="Visit Types"
          data={visitTypes}
          columns={columns}
          options={options}
          components={components}
          actions={actions}
        />
      </div>
    </>
  );
};

export default VisitTypes;
