import { Button , Form, Input, Col, Select, Card, Space, Row  } from 'antd';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { updateSite, retrieveSite } from '../../features/treeSlice';
import UpdateService from '../../features/treeSlice';

import '../../styles/pages/SiteManagement.css'

const { Option } = Select;

const EditSite = () => {
  
    const initialEditSite = {
      name: "",
      hierarchy: "",
      type:"",
      latitude:"",
      longitude:"",
      geolocation:""
    };

    const [editSite, setEditSite] = useState(initialEditSite);
    const [form] = Form.useForm();
    const [checked, setChecked] = useState(false);
    const [text, setText] = useState("");
    const [search, setSearch] = useState('');
    const [suggestion, setSuggestion] = useState([]);
    
    const { id } = useParams()
    console.log('a',{id})
    const sitesTree = useSelector(state => state.sitesTree);
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(retrieveSite());
    }, []);

    const filter = sitesTree.filter((data) => data.hierarchy.includes(search));
    const dataTree = filter.map((data, i) => data.hierarchy);

    const handleChange = (event) => {
      const { name, value } = event.target;
      let matches =[]
      if (event.target.value.length>0){
        matches=dataTree.filter(user=>{
          const regex = new RegExp(/^\/global(\/[a-zA-Z0-9]+)*$/);
          // console.log(regex)
          return user.match(value)
        })
      }
      setSuggestion(matches)
      setEditSite({ ...editSite, [name]: value });
    };
  
    const onSuggestHandler = (value)=>{
      setEditSite({...editSite, hierarchy: value});
      setSuggestion([]);
    }

    const handleInputChange = event => {
      const { name, value } = event.target;
      // console.log({ ...editSite, [name]: value })
      setEditSite({ ...editSite, [name]: value });
    };

    function handleInput(e) { 
      setEditSite({...editSite, type: e});
    }

    const getSite = id => {
      UpdateService.get(id)
        .then(response  => {
          setEditSite(response.data);

        })
        .catch(e => {
        });
    };

    useEffect(() => {
      getSite(id);
    }, [id]);

    const updateContent = () => {
      dispatch(updateSite({ id: editSite.id, data: editSite }))
        .then(response => {
          // console.log(response);
        })
        .catch(e => {
        });
    };

  return (
    <>

    <Card bordered={true}>
        <Form 
          id='category-editor-form'
          form={form}
          onFinish={updateContent}
          onSubmit={updateContent}
          name="editSite"
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >

            <div className='content'>
            <Form.Item
              label="Geolocation"
              name="geolocation"
            >
              <input
              name="checkbox"
              type="checkbox"
              checked={checked}
              onChange={() => {
                    if(checked){
                      setText('')
                    }
                setChecked(!checked)
                  }
              }
            />
            </Form.Item>

            <div className='padding1'>
            <Form.Item
              label="Lat"
              name="latitude"
            >
            <div className='padding'>
              <Col span={10}>
            <Input value={editSite.latitude} disabled={checked} defaultValue={editSite.latitude} key={`${editSite.latitude}` } onChange={handleInputChange} name="latitude" placeholder="0.0"/>
              </Col>
            </div>
            </Form.Item>
            </div>

            <Form.Item
              label="Long"
              name="longitude"
            >   
            <div className='padding'>
              <Col span={10}>
              <Input value={editSite.longitude} disabled={checked} defaultValue={editSite.longitude} key={`${editSite.longitude}` } onChange={handleInputChange} name="longitude" placeholder="0.0"/>
              {/* <SearchOutlined /> */}
              </Col>
            </div> 
            </Form.Item>

            <Form.Item
              name="type"
              >
              <Select
                value={editSite.type} 
                defaultValue={editSite.type}
                key={`${editSite.type}` }
                onChange={handleInput}
              >
                <Option value="draf">Draf</Option>
                <Option value="remote">Remote</Option>
                <Option value="direct">Direct</Option>
              </Select>
            </Form.Item>
            </div>

            <div className='content'>
            <Form.Item
              label="Hirarcy"
              name="hierarchy"
              rules={[
                {
                  // required: true,
                  pattern: new RegExp(
                    /^\/global(\/[a-zA-Z0-9]+)*$/
                  ),
                  message: "Must contain /global/location"
                }
              ]}
            >
            <div className='padding1'>
              <Input value={editSite.hierarchy} defaultValue={editSite} key={`${editSite}` } onChange={handleChange}  name="hierarchy"/>
              {suggestion && suggestion.map((suggestion, i) =>
          <div key={i} className='suggestion' onClick={()=>onSuggestHandler(suggestion)}>{suggestion}</div>
          )}
            </div>
            </Form.Item>
        
            <div className='padding'>
              <Form.Item
                label="Site Name"
                name="name"
              >
                <Input value={editSite.name} defaultValue={editSite.name} key={`${editSite.name}` } onChange={handleInputChange}  name="name"/>
              </Form.Item>
              </div>

            <div className='padding2'>
            <Space>
              <Button type="primary" htmlType="submit"   onClick={updateContent}>
                Edit
              </Button>
              <Button htmlType="submit">
              <Link to="/">Back</Link>
              </Button>
              </Space>
            </div>
            
            </div>
            </Form>
            </Card>
    </>
  
  );
};

export default EditSite;