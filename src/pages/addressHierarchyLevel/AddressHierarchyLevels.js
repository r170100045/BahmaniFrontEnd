import { useEffect, useState } from 'react';

import { EXAMPLE_ENTRIES } from '../../constants/otherConstants';
import MaterialTable from 'material-table';
import { getAllAddressHierarchyLevels } from '../../services/addressHierarchyLevelService';

const AddressHierarchyLevels = () => {
  const [addressHierarchyLevels, setAddressHierarchyLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [columnData, setColumnData] = useState({});

  const columns = [
    {
      title: 'Level',
      field: 'level',
    },
    {
      title: 'Name',
      field: 'name',
    },
    {
      title: 'Example Entry',
      field: 'example',
    },
    {
      title: 'Mapped Address Field',
      field: 'addressField',
    },
    {
      title: 'Required',
      field: 'required',
      lookup: { true: 'Yes', false: 'No' },
    },
  ];

  const options = {
    pageSize: 10,
    pageSizeOptions: [10, 20],
    emptyRowsWhenPaging: false,
    actionsColumnIndex: -1,
  };

  useEffect(() => {
    const loadAddressHierarchyLevels = async () => {
      try {
        const response = await getAllAddressHierarchyLevels();
        setAddressHierarchyLevels(response.data);
      } catch (e) {
        console.warn(e);
      }
    };

    loadAddressHierarchyLevels();
  }, []);

  useEffect(() => {
    const fillDataInColumns = () => {
      const columnData = [];
      addressHierarchyLevels.map((level, index) =>
        columnData.push({
          level: index + 1,
          name: level.name,
          example: EXAMPLE_ENTRIES[index],
          addressField: level.addressField,
          required: level.required,
        })
      );
      setColumnData(columnData);
    };

    try {
      fillDataInColumns();
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoading(false);
    }
  }, [addressHierarchyLevels]);

  if (isLoading) return <p>loading...</p>;

  return (
    <>
      <div style={{ maxWidth: '90%', margin: 'auto' }}>
        <MaterialTable
          title="Address Hierarchy Levels"
          data={columnData}
          columns={columns}
          options={options}
        />
      </div>
    </>
  );
};

export default AddressHierarchyLevels;
