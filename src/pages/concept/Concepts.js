import { FormControlLabel, Switch } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import MaterialTable, { MTableToolbar } from "material-table";
import { useEffect, useState } from "react";

import Controls from "../../components/controls/Controls";
import EditIcon from "@material-ui/icons/Edit";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import LoadingData from "../../utils/LoadingData";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { getConceptNameDetails } from "../../services/conceptService";

const Concepts = () => {
  const [concepts, setConcepts] = useState([]);
  const [filteredConceptsOnRetired, setFilteredConceptsOnRetired] = useState(
    []
  );
  const [showRetired, setShowRetired] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [redirect, setRedirect] = useState(null);
  const [httpRequestError, setHttpRequestError] = useState(null);
  const [httpRequestHasError, setHttpRequestHasError] = useState(false);

  const columns = [
    {
      title: "Name",
      field: "conceptName",
      render: (rowData) => (
        <p
          style={{ textDecoration: rowData.retired ? "line-through" : "none" }}
        >
          {rowData.conceptName}
        </p>
      ),
    },
    {
      title: "ID",
      field: "conceptId",
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
    const loadConcepts = async () => {
      try {
        setIsLoading(true);
        const response = await getConceptNameDetails();
        setConcepts(response.data);
      } catch (e) {
        console.log(e);
        setHttpRequestError(
          "error: getConceptNameDetails api call failed : " + e.message
        );
        setHttpRequestHasError(true);
      }
      setIsLoading(false);
    };

    loadConcepts();
  }, []);

  useEffect(() => {
    if (showRetired) {
      setFilteredConceptsOnRetired(concepts);
    } else {
      setFilteredConceptsOnRetired(
        concepts.filter((concept) => concept.retired === false)
      );
    }
  }, [concepts, showRetired]);

  const toggleRetired = () => {
    setShowRetired((prevShowRetired) => !prevShowRetired);
  };

  const components = {
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <div class="text-end" style={{ padding: "0px 10px" }}>
          <FormControlLabel
            style={{ marginRight: "10px" }}
            value="start"
            control={
              <Switch
                color="primary"
                onClick={() => toggleRetired()}
                checked={showRetired}
              />
            }
            label={showRetired ? "Hide Retired" : "Show Retired"}
            labelPlacement="start"
          />
          <Controls.AddButton
            onClick={() => setRedirect("/concept/edit/add")}
          />
        </div>
      </div>
    ),
  };

  const actions = [
    // {
    //   icon: () => <EditIcon color="primary" />,
    //   tooltip: "Edit",
    //   onClick: (event, rowData) => setRedirect(`/concept/edit/${rowData.uuid}`),
    // },
    {
      icon: () => <VisibilityIcon color="primary" />,
      tooltip: "View",
      onClick: (event, rowData) => setRedirect(`/concept/view/${rowData.uuid}`),
    },
  ];

  if (redirect) return <Redirect to={redirect} />;

  if (isLoading) return <LoadingData />;

  return (
    <>
      {httpRequestHasError && <ErrorLoadingData message={httpRequestError} />}

      <div style={{ maxWidth: "96%", margin: "auto" }}>
        <MaterialTable
          title="Concepts"
          data={filteredConceptsOnRetired}
          columns={columns}
          components={components}
          options={options}
          actions={actions}
        />
      </div>
    </>
  );
};

export default Concepts;
