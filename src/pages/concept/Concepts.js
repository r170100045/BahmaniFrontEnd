import { FormControlLabel, Switch } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import MaterialTable, { MTableToolbar } from "material-table";
import { useEffect, useState } from "react";

import Controls from "../../components/controls/Controls";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { getConceptNameDetails } from "../../services/conceptService";

const Concepts = () => {
  const [concepts, setConcepts] = useState([]);
  const [filteredConceptsOnRetired, setFilteredConceptsOnRetired] = useState(
    []
  );
  const [showRetired, setShowRetired] = useState(true);
  const [redirect, setRedirect] = useState(null);

  const columns = [
    {
      title: "Name",
      field: "conceptName",
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
  };

  useEffect(() => {
    const loadConcepts = async () => {
      const response = await getConceptNameDetails();
      setConcepts(response.data);
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
    {
      icon: () => <EditIcon color="primary" />,
      tooltip: "Edit",
      onClick: (event, rowData) => setRedirect(`/concept/edit/${rowData.uuid}`),
    },
    {
      icon: () => <VisibilityIcon color="primary" />,
      tooltip: "View",
      onClick: (event, rowData) => setRedirect(`/concept/view/${rowData.uuid}`),
    },
  ];

  if (redirect) return <Redirect to={redirect} />;

  return (
    <>
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
