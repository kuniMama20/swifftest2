import { useEffect, useState } from 'react'
import './App.css'
import { Button, Checkbox, CheckboxProps, DatePicker, DatePickerProps, Divider, Dropdown, Flex, Form, Input, MenuProps, Radio, RadioChangeEvent, Select, Space, Table } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import type { FormProps, TableColumnsType } from 'antd';
import { Col, Row } from 'antd';
import {  useSelector,useDispatch } from 'react-redux'
import { DataState, setData } from './feature/slice';
import { setTable } from './feature/tableSlice';
import { CaretDownOutlined, CaretLeftOutlined, CaretRightOutlined, CaretUpOutlined, DownOutlined } from '@ant-design/icons';


interface DataType {
  key: React.Key;
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


const columns: TableColumnsType<DataType> = [
  {
    title: 'ชื่อ',
    dataIndex: 'name',
    showSorterTooltip: { target: 'full-header' },
    sortDirections: ['descend'],
  },
  {
    title: 'เพศ',
    dataIndex: 'sex',
  },
  {
    title: 'หมายเลขโทรศัพท์',
    dataIndex: 'phone',
    
  },
  {
    title: 'สัญชาติ',
    dataIndex: 'nationality',
  },
  {
    title: 'จัดการ',
  },
];

const data: DataType[] = [];
// for (let i = 0; i < 46; i++) {
//   data.push({
//     key: i,
//     name: `Edward King ${i}`,
//     age: 32,
//     address: `London, Park Lane no. ${i}`,
//   });
// }
function App() {
  const dispatch = useDispatch();
  const dataRedux = useSelector((state: DataType) => state)
  const dataTable = useSelector((state: DataType) => state)
  console.log("Table",dataTable)
  const [submit,setSubmit] = useState<DataType[]| undefined>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(1);
  const [i18nState, setI18n] =useState<string>('en');
  const [labelI18n, setLabelI18n] =useState<string>('EN');
  const {t, i18n } = useTranslation();
  
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  // data.push({
  //   name: dataTable.table.value[0].name,
  //   sex: dataTable.table.value[0].sex,
  //   phone: dataTable.table.value[0].phone,
  //   nationality: dataTable.table.value[0].nationality,
  //   key: '',
  //   preName: '',
  //   surName: '',
  //   date: '',
  //   personalId: 0,
  //   passport: '',
  //   salary: ''
  // });
  
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
  };

  useEffect(() => {
    const dataStore = localStorage.getItem('data')
    if(dataStore){
      dispatch((setTable(JSON.parse(dataStore))))
    }else{
      return undefined;
    }
    // console.log("dataStore",dataTable.table.value[0].name);
    console.log(data)
  },[submit] );

  const onFinish: FormProps<DataType>['onFinish'] = (values) => {
    dispatch((setData(values)))
    localStorage.setItem("data", JSON.stringify([values]))
    console.log('Success:', dataRedux);
    setSubmit(dataRedux);
    console.log("name", dataRedux?.user.value.name)
  };
  
  const onFinishFailed: FormProps<DataType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    >
     {/* <h1>{t('Welcome to React')}</h1> */}
    <div style={{ width: '100%' , height: '100%', backgroundColor: '#ffa200',justifyContent:'center'}}> 
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
          <text><text style={{color:'red'}}>* </text>นามสกุน :</text>
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
                <Select.Option value="+66">+66</Select.Option>
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
          
          <Button style={{marginLeft: '150px'}}>ล้างข้อมูล</Button>
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
      <Button style={{marginLeft: '10px'}}>ลบข้อมูล</Button>
    </Flex>
    <div style={{padding: '10px'}}>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} showSorterTooltip={{ target: 'sorter-icon' }}/>
    </div>
    </div>
    </Form>
  )
}

export default App

