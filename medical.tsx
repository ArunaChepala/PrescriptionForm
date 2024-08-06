

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './medical.css';
import { Row, Col, Card, Form, Input, Button, Table, message } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';

// Interface for the form data
interface FormData {
  id?: number;
  Firstname: string;
  Lastname: string;
  Contactnumber: string;
  Issue1: string;
  Issue2: string;
  n2: string;
  Date: string;
  Physiciansignature: string;
}

const Medical = () => {             //statevariable
  const [form] = Form.useForm(); // Ant Design form instance
  const [data, setData] = useState<FormData[]>([]); // State for storing fetched data
  const [view, setView] = useState<'create' | 'view'>('create'); // State for toggling between 'create' and 'view' modes
  const [editingRecord, setEditingRecord] = useState<FormData | null>(null); // State for storing the record being edited

  // Fetch data when the view is 'view'


  useEffect(() => {
    if (view === 'view') {
      fetchData();
    }
  }, [view]);     //dependency array

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await axios.get<FormData[]>('http://localhost:3000/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (values: FormData) => {
    try {
      // Frontend form validation using Ant Design rules
      await form.validateFields();

      if (editingRecord) {
        // If editing a record, send a PUT request to update it
        await axios.put(`http://localhost:3000/update/${editingRecord.id}`, values);
        setEditingRecord(null);
      } else {
        // If creating a new record, send a POST request to create it
        await axios.post('http://localhost:3000/submit', values);
      }
      form.resetFields(); // Reset the form fields
      setView('view'); // Switch to view mode after form submission
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Please fill in all required fields.');
    }
  };

  // Function to handle editing a record
  const handleEdit = (record: FormData) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setView('create'); // Switch to create mode to edit the record
  };

  // Function to handle deleting a record
  const handleDelete = async (id: number) => {
    try {
      console.log('Deleting record with id:', id);
      const response = await axios.delete(`http://localhost:3000/delete/${id}`);
      if (response.status === 200) {
        console.log('Entry deleted successfully');
        fetchData(); // Refresh data after deletion
      } else {
        console.error('Error deleting record. Status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  // Table columns definition for Ant Design table
  const columns = [
    { title: 'First Name', dataIndex: 'Firstname', key: 'Firstname' },
    { title: 'Last Name', dataIndex: 'Lastname', key: 'Lastname' },
    { title: 'Contact Number', dataIndex: 'Contactnumber', key: 'Contactnumber' },
    { title: 'Health Issue 1', dataIndex: 'Issue1', key: 'Issue1' },
    { title: 'Health Issue 2', dataIndex: 'Issue2', key: 'Issue2' },
    { title: 'Medicine Process', dataIndex: 'n2', key: 'n2' },
    { title: 'Date', dataIndex: 'Date', key: 'Date' },
    { title: 'Physician Signature', dataIndex: 'Physiciansignature', key: 'Physiciansignature' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: FormData) => (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" onClick={() => handleDelete(record.id!)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div>
        <header className='heading'>
          <h1><center><b>Medical Hospital</b></center></h1>
        </header>
        <h2><center>Prescription Form</center></h2>
      </div>

      <div className="button-container">
        <Button type="primary" onClick={() => setView('create')}>Create</Button>
        <Button type="default" onClick={() => setView('view')} style={{ marginLeft: '10px' }}>View</Button>
      </div>

      {view === 'create' ? (
        <div className="input-container">
          <Card>
            <Form
              layout='vertical'
              form={form}
              onFinish={handleSubmit}
            >
              <Card className='heading1'>
                <Row gutter={[50, 9]}>
                  <Col span={8}>
                    <Form.Item label="First Name" name="Firstname" rules={[{ required: true, message: 'Please enter your first name' }]}>
                      <Input
                        prefix={<UserOutlined />}
                        placeholder='First Name'
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="Last Name" name="Lastname" rules={[{ required: true, message: 'Please enter your last name' }]}>
                      <Input
                        prefix={<UserOutlined />}
                        placeholder='Last Name'
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="Contact Number" name="Contactnumber" rules={[{ required: true, message: 'Please enter your contact number' }]}>
                      <Input
                        prefix={<PhoneOutlined />}
                        placeholder='Contact Number'
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card className='problem1'>
                <Row justify="center">
                  <Col>
                    <h4>Health Issue 1</h4>
                  </Col>
                </Row>

                <Row justify="center">
                  <Col span={24}>
                    <Form.Item label="Issue 1" name="Issue1" rules={[{ required: true, message: 'Please enter health issue 1' }]}>
                      <Input placeholder='Type Something..' />
                    </Form.Item>
                  </Col>
                </Row>

                <Row justify="center">
                  <Col>
                    <Button type="primary">+ Add Item</Button>
                  </Col>
                </Row>
              </Card>

              <Card className='problem1'>
                <Row justify="center">
                  <Col>
                    <h4>Health Issue 2</h4>
                  </Col>
                </Row>

                <Row justify="center">
                  <Col span={24}>
                    <Form.Item label="Issue 2" name="Issue2" rules={[{ required: true, message: 'Please enter health issue 2' }]}>
                      <Input placeholder='Type Something..' />
                    </Form.Item>
                  </Col>
                </Row>

                <Row justify="center">
                  <Col>
                    <Button type="primary">+ Add Item</Button>
                  </Col>
                </Row>
              </Card>

              <Card className='problem2'>
                <Row justify="center">
                  <Col>
                    <h4>Process Of Taking Medicine:</h4>
                  </Col>
                </Row>

                <Row justify="center">
                  <Col span={24}>
                    <Form.Item name="n2" rules={[{ required: true, message: 'Please enter process of taking medicine' }]}>
                      <textarea rows={7} placeholder="Type Something..." />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card className="problem3">
                <Row justify="center">
                  <Col>
                    <h4>Date:</h4>
                  </Col>
                </Row>

                <Row justify="center">
                  <Col span={24}>
                    <Form.Item name="Date" rules={[{ required: true, message: 'Please select a date' }]}>
                      <Input type='date' />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card className="problem4">
                <Row justify="center">
                  <Col>
                    <h4>Physician Signature</h4>
                  </Col>
                </Row>

                <Row justify="center">
                  <Col span={24}>
                    <Form.Item name="Physiciansignature" rules={[{ required: true, message: 'Please enter physician signature' }]}>
                      <textarea rows={2} placeholder="Physician Signature" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card>
                <Row className='submit-btn' justify="center">
                  <Col>
                    <Button type="primary" htmlType="submit">Submit</Button>
                  </Col>
                </Row>
              </Card>
            </Form>
          </Card>
        </div>
      ) : (
        <div className="data-table">
          <h2><center>Submitted Data</center></h2>
          <Table columns={columns} dataSource={data} rowKey="id" />
        </div>
      )}

      <footer><center>Made in India</center></footer>
    </>
  );
};

export default Medical;

