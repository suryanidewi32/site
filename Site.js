import { Button, Card, Table, Space } from 'antd';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { deleteTree, deleteAllTree, retrieveSite } from '../../features/treeSlice';

import '../../styles/pages/SiteManagement.css'

const Site=() =>{

  const sitesTree = useSelector(state => state.sitesTree);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveSite());
  }, []);

  const dataTrees= sitesTree.map((tree) => tree)

  const [columns, setColumns] = useState([
    {
      title: 'Building Name',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 5,
      },
    },
    {
      title: 'Hierarchy',
      dataIndex: 'hierarchy',
      sorter: {
        compare: (a, b) => a.hierarchy - b.hierarchy,
        multiple: 4,
      },
    },
    {
      title: 'Latitude',
      dataIndex: 'latitude',
      sorter: {
        compare: (a, b) => a.latitude - b.latitude,
        multiple: 3,
      },
    },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
      sorter: {
        compare: (a, b) => a.longitude - b.longitude,
        multiple: 2,
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      sorter: {
        compare: (a, b) => a.type - b.type,
        multiple: 1,
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_,record) => {
        return (
          <>
            <Link
             to={"/edit-site/" + (record.id)}>Edit
            </Link>
         </> 
        );
      },
    },
  ]);

  const [selected, setSelected] = useState({
    selectedRowKeys: [],
  });

  const selectRow = (record) => {
    const selectedRowKeys = [...selected.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    setSelected({ selectedRowKeys });
  }
  const onSelectedRowKeysChange = (selectedRowKeys) => {
    setSelected(selectedRowKeys);
  }

  const { selectedRowKeys } = selected;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectedRowKeysChange,
  };

  const deleteSite=()=>{
    dispatch(deleteAllTree(selected))
    console.log(selected)
  }

    return (
      <div >
        <Card bordered={true} title="Registered Sites">
        <Table
          rowSelection={rowSelection}
          dataSource={dataTrees}
          columns={columns}
          onRow={(record) => ({
            onClick: () => {
              selectRow(record);
            },
          })}
        />

        <Space className='button'>
        <Button type="primary">
         <Link to="/add-site">Add</Link>
        </Button>
        <Button type="primary" danger  onClick={()=>{deleteSite()}}>
         Delete
        </Button>
        </Space>
        </Card>
      </div>
    );
}

export default Site;