import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, Card, Table, Space, Modal, Form } from 'antd'
import 'antd/dist/antd.css'
import { useQuery, gql, useMutation } from '@apollo/client'
import CountryForm from "./countryForm"

const Load_Countries = gql`
    query   {
      getAllUsers {
        c_id
        c_name
        c_code
  }
  }
`;

const Add_Country = gql`
  mutation Mutation($cName: String!, $cCode: String!) {
  createCountry(cName: $cName, cCode: $cCode) {
    cName
    cCode
    msg
    isCodeExist
    isNameExist
  }
}
`;

const Update_Country = gql`
  mutation Mutation($updateCountryDataId: Int!, $cName: String!, $cCode: String!) {
  updateCountryData(id: $updateCountryDataId, cName: $cName, cCode: $cCode) {
    id
    cName
    cCode
    msg
    isCodeExist
    isNameExist
  }
}
`

const Delete_Country = gql`
  mutation Mutation($cId: Int!) {
  deleteCountry(c_id: $cId) {
    status
    msg
  }
}
`

const Country=()=> {

  const [cData, setData] = useState([]);

  const [form]=Form.useForm()

  const { error, loading, data } = useQuery(Load_Countries)

  const GetData = () => {
    if (loading) return 'Submitting...'
    if (error) return alert('Unable to fetch data')
    if (data.getAllUsers && Array.isArray(data.getAllUsers) && data.getAllUsers.length > 0) {
      setData(data.getAllUsers)
    }
  }

  useEffect(() => {
    GetData()
    console.log(cData)
  })
  
  const [createCountry] = useMutation(Add_Country, {
    refetchQueries: [{ query: Load_Countries }], onError: "", onCompleted: (rslt) => {
      if(rslt.createCountry.isCodeExist || rslt.createCountry.isNameExist)
        alert(rslt.createCountry.msg)
    }
  })

  const [editDataId, setIsEditId]=useState(null)
  let [isEditing, setIsEditing] = useState(false)

  const handleUpdateButton = (record) => {
    setIsEditId(record.c_id)
    setIsEditing(true)
    form.setFieldsValue({
      cName:record.c_name,
      cCode:record.c_code
    })
  }

  const onSubmit = (values) => {
    if (editDataId===null) {
      createCountry(
        {
          variables: {
            cName: values.cName,
            cCode: values.cCode
          }
        }
      )
  }
  else{
    updateCountryData(
        {
          variables: {
            updateCountryDataId: editDataId,
            cName: values.cName,
            cCode: values.cCode
          }
        }
      )
      setIsEditing(false)
      setIsEditId(null)
  }
  }

  const [updateCountryData] = useMutation(Update_Country, {
    refetchQueries: [{ query: Load_Countries }], onError:"", onCompleted: (rslt) => {
      alert("Update Data message : "+rslt.updateCountryData.msg)
    }
  })

  const [deleteCountry] = useMutation(Delete_Country, { refetchQueries: [{ query: Load_Countries }], onError:(err)=>{alert("Unable to delete data"+err.tostring())}, onCompleted:(rslt)=>{
    alert(rslt.deleteCountry.msg)
  } })
  const HandleDeleteClick = (dataId) => {
      deleteCountry(
        {
          variables: {
            cId: dataId
          }
        }
      )
  }

  const layOut = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 8,
    }
  };

  const validDateMessage = {
    required: '${label} is required!',
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  }

  const column = [
    {
      title: "Country Name",
      dataIndex: "c_name",
      key: "country_name"
    },
    {
      title: "Country Code",
      dataIndex: "c_code",
      key: "country_code"
    },
    {
      title: "Update/Delete",
      dataIndex: "c_id",
      key: "update_delete",
      render: (_, record, key) => {
        return (
          <Space size="middle">
            <Button type="primary" ghost onClick={(e) => handleUpdateButton(record)}>Update</Button>
            <Button type="primary" danger ghost onClick={(e) => HandleDeleteClick(record.c_id)}>Delete</Button>
          </Space>
        )
      },
    },
  ]

  return (
    <div>
      <nav></nav>
      <div className="formCard">
        <Card title=" Enter Country And Its Code" style={{ width: 800, margin: 'auto' }}>
          <CountryForm onSubmit={onSubmit} layOut={layOut} validDateMessage={validDateMessage} />
        </Card>
      </div>
      <div className="tableCard">
        <Card title="Countries And Their Codes" style={{ width: 800, margin: 'auto' }}>
          <Table columns={column} dataSource={cData} />
        </Card>
        <Modal
          title="Update Country Name and Code"
          visible={isEditing}
          footer={null}
          onCancel={() => { setIsEditing(false) }}
        >
          <CountryForm onSubmit={onSubmit} layOut={layOut} validDateMessage={validDateMessage} form={form} />
        </Modal>
      </div>
    </div>
  );
}

export default Country;
