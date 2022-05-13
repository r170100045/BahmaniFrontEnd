import { Link, Redirect } from "react-router-dom";
import MaterialTable, { MTableToolbar } from "material-table";
import { useEffect, useState } from "react";

import Controls from "../../components/controls/Controls";
import EditIcon from "@material-ui/icons/Edit";
import { getAllVisitTypes } from "../../services/visitTypeService";

const VisitTypes = () => {
  const [visitTypes, setVisitTypes] = useState([]);
  const [redirect, setRedirect] = useState(null);

  const columns = [
    {
      title: "Name",
      field: "name",
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
        const response = await getAllVisitTypes();
        setVisitTypes(response.data);
      } catch (e) {
        console.warn(e);
      }
    };

    loadVisitTypes();
  }, []);

  const components = {
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <div className="text-end" style={{ padding: "0px 10px" }}>
          <Link to="/visitType/edit/add">
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
      onClick: (event, rowData) =>
        setRedirect(`/visitType/edit/${rowData.uuid}`),
    },
  ];

  if (redirect) return <Redirect to={redirect} />;

  return (
    <>
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
