import { useMemo } from 'react'
import { Button, Form, Input } from 'antd'

import { type FormRules } from '@/constants'

function SignIn () {
  const [form] = Form.useForm()

  const rules: FormRules = useMemo(() => {
    return {
      email: [
        { required: true, message: 'ok' },
        { type: 'email', message: 'ok' }
      ],
      password: [

      ]
    }
  }, [])


  return (
    <Form
      form={form}
      className='bg-red-500 text-red-500'
    >
      <Form.Item name='email'
        label='Email'
        colon={false}
        rules={rules.email}
      >
        <Input />
      </Form.Item>
      <Form.Item name='password'
        label='Password'
        colon={false}>
        <Input type='password' />
      </Form.Item>
      <Form.Item>
        <Button type='primary'>Sign In</Button>
      </Form.Item>
    </Form>
  )
}


export default SignIn
