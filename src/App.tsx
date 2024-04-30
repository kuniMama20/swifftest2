import { useEffect, useState } from 'react'
import './App.css'
import { Button, Checkbox, CheckboxProps, DatePicker, DatePickerProps, Divider, Dropdown, Flex, Form, Input, MenuProps, Radio, RadioChangeEvent, Select, Space, Table } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import type { FormProps, GetProp, TableColumnsType, TablePaginationConfig, TableProps } from 'antd';
import { Col, Row } from 'antd';
import {  useSelector,useDispatch } from 'react-redux'
import { DataState, setData } from './feature/slice';
import { setTable } from './feature/tableSlice';
import { CaretDownOutlined, CaretLeftOutlined, CaretRightOutlined, CaretUpOutlined, DownOutlined } from '@ant-design/icons';
import form from 'antd/es/form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

interface DataType {
  key: number;
  preName: string;
  name: string;
  surName: string
  date: string;
  nationality: string;
  personalId: number;
  sex: string;
  phone: string;
  passport: string;
  salary: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}





function App() {
  dayjs.extend(customParseFormat);
  const dispatch = useDispatch();
  const dataRedux = useSelector((state: DataType) => state)
  const dataTable = useSelector((state: DataType) => state)
  const [form] = Form.useForm();
  const table:DataType[] = dataTable.table.value;
  console.log("table",table)
  const [submit,setSubmit] = useState<DataType[]| undefined>()
  const [editState,setEditState] =useState<boolean>(false)
  const [selectAll,setSelectAll] =useState<boolean>(false)
  const [indexEdit,setIndexEdit] = useState<number>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(1);
  const [i18nState, setI18n] =useState<string>('en');
  const [labelI18n, setLabelI18n] =useState<string>('EN');
  const {t, i18n } = useTranslation();
  
  const columns: TableColumnsType<DataType> = [
    {
      title: 'ชื่อ',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'เพศ',
      dataIndex: 'sex',
      key: 'sex',
      sorter: (a, b) => a.sex.localeCompare(b.sex),
    },
    {
      title: 'หมายเลขโทรศัพท์',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: 'สัญชาติ',
      dataIndex: 'nationality',
      key: 'nationality',
      sorter: (a, b) => a.nationality.localeCompare(b.nationality),
    },
    {
      title: 'จัดการ',
      dataIndex: '',
      key: 'x',
      render: (record,index) => <div style={{display: 'flex'}}>
        <Button onClick={()=>editData(record,index)} type="primary" >Edit</Button>
        <Button style={{marginLeft: '5px'}} onClick={()=>deleteData(record)} type="primary" danger>Delete</Button>
      </div>,
    },
  ];

  function deleteData(record:DataType){
    console.log('delete',record.personalId)
    const storedJsonString = localStorage.getItem('data');
    const store = JSON.parse(storedJsonString)
    console.log("delete get ", store)
    const deleted = store.filter(item => item.personalId !== record.personalId)
    console.log("store",deleted)
    dispatch((setData(deleted)))
    localStorage.setItem("data", JSON.stringify(deleted))
    setSubmit(deleted)

  }
  function editData(record,index){
    console.log("index",index)
    const storedJsonString = localStorage.getItem('data');
    const store = JSON.parse(storedJsonString)
    console.log("record",record)
    const edit = store.find(item =>item.key === record.key);
    console.log("edit",edit)
    const formatDate = dayjs(edit.date)
    console.log("format",formatDate)
    const editFormat = {
      ...edit, date: formatDate
    } 
    console.log("New format",editFormat)
    setIndexEdit(editFormat.key)
    // form.setFieldsValue(edit);
    form.setFieldsValue(editFormat);
    setEditState(true)
  }


  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const data = table;
  
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e.key);
    if(e.key==='th'){
      setLabelI18n('TH')
    }else{
      setLabelI18n('EN')
    }
    setI18n(e.key)
  };

  function resetData(){
    if(selectAll===true){
      localStorage.setItem("data", JSON.stringify([]))
      setSubmit([])
    }
  }
  
  const items: MenuProps['items'] = [
    {
      label: 'EN',
      key: 'en',
      
    },
    {
      label: 'TH',
      key: 'th',
    },
  ];
  
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  const onChangeRadio = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
  };

  const onChangeCheckbox: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setSelectAll(e.target.checked)
  };

  useEffect(() => {
    const dataStore = localStorage.getItem('data')
    if(dataStore){
      dispatch((setTable(JSON.parse(dataStore))))
    }else{
      return undefined;
    }
    // console.log("dataStore",dataTable.table.value[0].name);
    
  },[submit,editState] );

  const onFinish: FormProps<DataType>['onFinish'] = (values) => {
    const storedJsonString = localStorage.getItem('data');
    console.log('edit state',editState)
    if(editState===true){
      console.log("editting")
      if(storedJsonString){
        const storedObject = JSON.parse(storedJsonString);
        const edited = storedObject.filter(item => item.key !== indexEdit)
        console.log('edited',edited);
        values.key = indexEdit;
        const updatedObject = [...edited, values];
        console.log("updatedObject",updatedObject)
    // เปลี่ยน updatedObject เป็น JSON string
      const updatedJsonString = JSON.stringify(updatedObject);
      
    // บันทึก updatedJsonString เข้า Local Storage
      localStorage.setItem('data', updatedJsonString);
      dispatch((setData(values)))
      console.log('Success:', dataRedux);
      console.log("name", dataRedux?.user.value.name)
      setSubmit(values)
      setEditState(false)
    }
  }else{
      console.log("gggggg")
        if(storedJsonString){
          const storedObject = JSON.parse(storedJsonString);
          values.key = storedObject.length;
          const updatedObject = [...storedObject, values];
        // เปลี่ยน updatedObject เป็น JSON string
          const updatedJsonString = JSON.stringify(updatedObject);
        
        // บันทึก updatedJsonString เข้า Local Storage
          localStorage.setItem('data', updatedJsonString);
          dispatch((setData(values)))
          console.log('Success:', dataRedux);
          console.log("name", dataRedux?.user.value.name)
          setSubmit(values)
        }else{
          values.key = 0;
          dispatch((setData(values)))
          localStorage.setItem("data", JSON.stringify([values]))
          console.log('Success:', dataRedux);
          console.log("name", dataRedux?.user.value.name)
          setSubmit(values)
        }
    }
  
   
  };

  
  const onFinishFailed: FormProps<DataType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      console.log('gg')
    }
  };

  return (
    <Form
    form={form}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    >
     {/* <h1>{t('Welcome to React')}</h1> */}
    <div style={{ width: '100%' , height: '100%', justifyContent:'center'}}> 
    <Flex justify='end'>
    <Dropdown menu={menuProps}>
      <Button>
        <Space> 
          {labelI18n}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
    </Flex>
    <Row justify='center'>
      <Col span={4}></Col>
      <Col span={16}>
        <div style={{borderWidth:'5px', borderColor: 'gray',padding: '5px'}}>
        <Flex justify='flex-start' align='center'>
        <div style={{marginLeft:'3px'}}>
          <text><text style={{color:'red'}}>* </text>คำนำหน้า :</text>
        </div>
        <Form.Item<DataType>
          name="preName"
          rules={[{ required: true, message: 'Please input your pre name!' }]}
        >
          <Select style={{marginLeft: '3px', width:'80px',marginTop:'25px'}} placeholder='คำนำหน้า'>
            <Select.Option value="นาย">นาย</Select.Option>
            <Select.Option value="นาง">นาง</Select.Option>
            <Select.Option value="นางสาว">นางสาว</Select.Option>
        </Select>
        </Form.Item>
        
        <div style={{marginLeft:'15px'}}>
          <text><text style={{color:'red'}}>* </text>ชื่อจริง :</text>
        </div>
        <Form.Item<DataType>
          name="name"
          rules={[{ required: true, message: 'Please input your pre name!' }]}
        >
          <Input style={{marginLeft: '3px', width:'300px',marginTop:'25px'}}/>
        </Form.Item>
        
        <div style={{marginLeft:'15px'}}>
          <text><text style={{color:'red'}}>* </text>นามสกุล :</text>
        </div>
        <Form.Item<DataType>
          name="surName"
          rules={[{ required: true, message: 'Please input your pre name!' }]}
        >
          <Input style={{marginLeft: '3px', width:'300px',marginTop:'25px'}}/>
        </Form.Item>
        </Flex>
        </div>
      </Col>
      <Col span={4}></Col>
    </Row>
    <Row justify='center' style={{marginTop:'-25px'}}>
      <Col span={4}></Col>
      <Col span={16}>
        <div style={{borderWidth:'5px', borderColor: 'gray',padding: '5px'}}>
          <Flex justify='flex-start' align='center'>
          <div style={{marginLeft:'3px'}}>
            <text><text style={{color:'red'}}>* </text>วันเกิด :</text>
          </div>
          <Form.Item<DataType>
          name="date"
          rules={[{ required: true, message: 'Please input your pre name!' }]}
          >
            <DatePicker style={{marginLeft: '3px', width:'150px',marginTop:'25px'}} onChange={onChange} />
          </Form.Item>
          <div style={{marginLeft:'15px'}}>
            <text><text style={{color:'red'}}>* </text>สัญชาติ :</text>
          </div>
          <Form.Item<DataType>
          name="nationality"
          rules={[{ required: true, message: 'Please input your pre name!' }]}
          >
            <Select style={{marginLeft: '3px', width:'300px',marginTop:'25px'}} placeholder='--- กรุณาเลือก ---'>
            <Select.Option value="ไทย">ไทย</Select.Option>
            </Select>
          </Form.Item>
          </Flex>
        </div>
      </Col>
      <Col span={4}></Col>
    </Row>
    <Row justify='center' style={{marginTop:'-25px'}}>
      <Col span={4}></Col>
      <Col span={16}>
        <div style={{borderWidth:'5px', borderColor: 'gray',padding: '5px'}}>
          <Flex justify='flex-start' align='center'>
          <div style={{marginLeft:'3px'}}>
            <text>เลขบัตรประชาชน :</text>
          </div>
          <Form.Item<DataType>
            name="personalId"
            rules={[{ required: true, message: 'Please input your pre name!' }]}
          >
            <Input style={{marginLeft: '3px', width:'300px',marginTop:'25px'}}/>
          </Form.Item>
          </Flex>
        </div>
      </Col>
      <Col span={4}></Col>
    </Row>
    <Row justify='center' style={{marginTop:'-25px'}}>
      <Col span={4}></Col>
      <Col span={16}>
        <div style={{borderWidth:'5px', borderColor: 'gray',padding: '5px'}}>
          <Flex justify='flex-start' align='center'>
          <div style={{marginLeft:'3px'}}>
            <text><text style={{color:'red'}}>* </text>เพศ :</text>
          </div>
          <Form.Item<DataType>
            name="sex"
            rules={[{ required: true, message: 'Please input your pre name!' }]}
          >
            <Radio.Group onChange={onChangeRadio} value={value} style={{marginLeft: '6px',marginTop:'20px'}}>
              <Radio value={'ผู้ชาย'}>ผู้ชาย</Radio>
              <Radio value={'ผู้หญิง'}>ผู้หญิง</Radio>
              <Radio value={'ไม่ระบุ'}>ไม่ระบุ</Radio>
            </Radio.Group>
          </Form.Item>
          </Flex>
        </div>
      </Col>
      <Col span={4}></Col>
    </Row>
    <Row justify='center' style={{marginTop:'-25px'}}>
      <Col span={4}></Col>
      <Col span={16}>
        <div style={{borderWidth:'5px', borderColor: 'gray',padding: '5px'}}>
          <Flex justify='flex-start' align='center'>
          <div style={{marginLeft:'3px'}}>
            <text><text style={{color:'red'}}>* </text>หมายเลขโทรศัพท์มือถือ :</text>
          </div>
            <Select style={{marginLeft: '3px', width:'100px'}}>
                <Select.Option value="+66" >+66</Select.Option>
            </Select>
          <text style={{marginLeft: '5px'}}>-</text>
          <Form.Item<DataType>
            name="phone"
            rules={[{ required: true, message: 'Please input your pre name!' }]}
          >
            <Input style={{marginLeft: '5px', width:'300px',marginTop:'24px'}}></Input>
            </Form.Item>
            
          </Flex>
        </div>
      </Col>
      <Col span={4}></Col>
    </Row>
    <Row justify='center' style={{marginTop:'-25px'}}>
      <Col span={4}></Col>
      <Col span={16}>
        <div style={{borderWidth:'5px', borderColor: 'gray',padding: '5px'}}>
          <Flex justify='flex-start' align='center'>
          <div style={{marginLeft:'3px'}}>
            <text>หนังสือเดินทาง :</text>
          </div>
          <Form.Item<DataType>
            name="passport"
            rules={[{ required: true, message: 'Please input your pre name!' }]}
          >
            <Input style={{marginLeft: '5px', width:'330px',marginTop:'20px'}}></Input>
          </Form.Item>
          </Flex>
        </div>
      </Col>
      <Col span={4}></Col>
    </Row>
    <Row justify='center' style={{marginTop:'-25px'}}>
      <Col span={4}></Col>
      <Col span={16}>
        <div style={{borderWidth:'5px', borderColor: 'gray',padding: '5px'}}>
          <Flex justify='flex-start' align='center'>
          <div style={{marginLeft:'3px'}}>
            <text><text style={{color:'red'}}>* </text>เงินเดือนที่คาดหวัง :</text>
          </div>
          <Form.Item<DataType>
            name="salary"
            rules={[{ required: true, message: 'Please input your pre name!' }]}
          >
            <Input style={{marginLeft: '5px', width:'300px',marginTop:'20px'}}></Input>
          </Form.Item>
          
          <Button htmlType="reset" style={{marginLeft: '150px'}}>ล้างข้อมูล</Button>
          <Form.Item>
            <Button htmlType="submit" style={{marginLeft: '40px',marginTop: '24px'}}>ส่งข้อมูล</Button>
          </Form.Item>
          
          </Flex>
        </div>
      </Col>
      <Col span={4}></Col>
    </Row>
    <Flex justify='start' style={{padding: '10px'}}>
      <div ><Checkbox onChange={onChangeCheckbox}>เลือกทั้งหมด</Checkbox></div>
      <Button onClick={resetData} style={{marginLeft: '10px'}}>ลบข้อมูล</Button>
    </Flex>
    <div style={{padding: '10px'}}>
      <Table 
        rowSelection={rowSelection} 
        columns={columns} 
        dataSource={data} 
        showSorterTooltip={{ target: 'sorter-icon' }} 
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
      
    </div>
    </div>
    </Form>
  )
}

export default App

