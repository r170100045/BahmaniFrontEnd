import { Link, Redirect } from "react-router-dom";
import MaterialTable, { MTableToolbar } from "material-table";
import { useEffect, useState } from "react";

import Controls from "../../components/controls/Controls";
import EditIcon from "@material-ui/icons/Edit";
import { getAllPatientRelationshipTypes } from "../../services/patientRelationshipTypeService";

const PatientRelationshipTypes = () => {
  const [patientRelationshipTypes, setPatientRelationshipTypes] = useState([]);
  const [redirect, setRedirect] = useState(null);

  const columns = [
    {
      title: "Names",
      field: "aisToB",
      render: (rowData) => (
        <p>
          {rowData.aisToB}/{rowData.bisToA}
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
    const loadPatientRelationshipTypes = async () => {
      try {
        const response = await getAllPatientRelationshipTypes();
        setPatientRelationshipTypes(response.data);
      } catch (e) {
        console.warn(e);
      }
    };

    loadPatientRelationshipTypes();
  }, []);

  const components = {
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <div className="text-end" style={{ padding: "0px 10px" }}>
          <Controls.AddButton
            onClick={() => setRedirect("/patientRelationshipType/edit/add")}
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
        setRedirect(`/patientRelationshipType/edit/${rowData.uuid}`),
    },
  ];

  if (redirect) return <Redirect to={redirect} />;

  return (
    <>
      <div style={{ maxWidth: "96%", margin: "auto" }}>
        <MaterialTable
          title="Patient Relationship Types"
          data={patientRelationshipTypes}
          columns={columns}
          options={options}
          components={components}
          actions={actions}
        />
      </div>
    </>
  );
};

export default PatientRelationshipTypes;
