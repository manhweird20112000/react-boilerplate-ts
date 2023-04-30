import { useMemo } from 'react'
import { Button, Form, Space, Typography } from 'antd'

import { TextField } from '@/components/common'
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
    <div className='flex h-screen w-screen items-center justify-center bg-gray-100'>
      <div className={`mx-auto w-[300px]`}>
        <Form
          form={form}
          autoComplete='off'
        >
          <TextField
            label={'Email'}
            name={'email'}
            rules={rules.email}
            placeholder='Email address'
            refForm={form}/>
          <TextField
            label={'Password'}
            name={'password'}
            refForm={form}
            type='password'
            placeholder='Password'
            rules={rules.password}
          />
          <Form.Item>
            <Button
              className='w-full'
              size='large'
              type='primary'>Sign In</Button>
          </Form.Item>
        </Form>
        <div className='flex flex-col items-center justify-center'>
          <Space>
            <Typography.Link>
              Forgot your password?
            </Typography.Link>
          </Space>

          <p className='my-4'>
            {"Don't have column account?"}
          </p>

          <Button
            size='large'
            className='w-full'>
            Create new account
          </Button>
        </div>

      </div>
    </div>
  )
}


export default SignIn
