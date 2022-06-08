import { Link, Redirect } from "react-router-dom";
import MaterialTable, { MTableToolbar } from "material-table";
import { useEffect, useState } from "react";

import Controls from "../../components/controls/Controls";
import EditIcon from "@material-ui/icons/Edit";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import LoadingData from "../../utils/LoadingData";
import { getAllPersonAttributeTypes } from "../../services/personAttributeTypeService";

const PersonAttributeTypes = () => {
  const [personAttributeTypes, setPersonAttributeTypes] = useState([]);
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
      title: "Format",
      field: "format",
    },
    {
      title: "Searchable",
      field: "searchable",
      lookup: { true: "Yes", false: "" },
    },
    {
      title: "Description",
      field: "description",
    },
    {
      title: "Edit Privilege",
      field: "editPrivilege",
    },
  ];

  const options = {
    pageSize: 3,
    pageSizeOptions: [3, 5, 10, 20],
    emptyRowsWhenPaging: false,
    actionsColumnIndex: -1,
  };

  useEffect(() => {
    const loadPersonAttributeTypes = async () => {
      try {
        setIsLoading(true);
        const response = await getAllPersonAttributeTypes();
        setPersonAttributeTypes(response.data);
      } catch (e) {
        console.warn(e);
        setHttpRequestError(
          "error: getAllPersonAttributeTypes api call failed : " + e.message
        );
        setHttpRequestHasError(true);
      }
      setIsLoading(false);
    };

    loadPersonAttributeTypes();
  }, []);

  const components = {
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <div className="text-end" style={{ padding: "0px 10px" }}>
          <Controls.AddButton
            onClick={() => setRedirect("/personAttributeType/edit/add")}
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
        setRedirect(`/personAttributeType/edit/${rowData.uuid}`),
    },
  ];

  if (redirect) return <Redirect to={redirect} />;

  if (isLoading) return <LoadingData />;

  return (
    <>
      {httpRequestHasError && <ErrorLoadingData message={httpRequestError} />}

      <div style={{ maxWidth: "96%", margin: "auto" }}>
        <MaterialTable
          title="Person Attribute Types"
          data={personAttributeTypes}
          columns={columns}
          options={options}
          components={components}
          actions={actions}
        />
      </div>
    </>
  );
};

export default PersonAttributeTypes;
