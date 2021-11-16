import React from "react"
import {Form, Input, Button} from "antd"
const CountryForm=(props)=>{
let {onSubmit, form ,layOut, validDateMessage}=props
  return(

<Form {...layOut} form={form} name='Country' onFinish={(e) => {onSubmit(e)}} validateMessages={validDateMessage}>
            <Form.Item
              name='cName'
              label="Country Name"
              rules={[
                {
                  required: true,
                }
              ]}
            >
              <Input name="c_name" />
            </Form.Item>
            <Form.Item
              name='cCode'
              label="Country Code"
              rules={[
                {
                  required: true,
                  max: 3,
                  min: 2,

                }
              ]}
              
            >
              <Input name="c_code"  />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
  )
}

export default CountryForm;