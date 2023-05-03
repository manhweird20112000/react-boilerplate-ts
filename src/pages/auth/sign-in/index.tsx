import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Space, Typography } from 'antd'

import { TextField } from '@/components/common'
import { type FormRules } from '@/constants'
import { setStorage } from '@/utils'

function SignIn () {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const rules: FormRules = useMemo(() => {
    return {
      email: [
        { required: true },
        { type: 'email' }
      ],
      password: [
        { required: true },
        { min: 6 }
      ]
    }
  }, [])


  const handleSubmit = (event: any) => {
    setStorage('access_token', 'true')
    navigate('/')
  }


  const handleRedirect = () => {
    navigate('/forgot-password')
  }

  return (
      <div className={`mx-auto w-[300px]`}>
        <Form
          form={form}
          onFinish={handleSubmit}
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
              onClick={handleSubmit}
              className='w-full'
              size='large'
              type='primary'>Sign In</Button>
          </Form.Item>
        </Form>
        <div className='flex flex-col items-center justify-center'>
          <Space>
            <Typography.Link onClick={handleRedirect}>
              <span className='font-normal text-gray-400'>Forgot your password?</span>
            </Typography.Link>
          </Space>

          <p className='my-4 font-normal text-gray-500'>
            {"Don't have column account?"}
          </p>

          <Button
            size='large'
            className='w-full'>
            Create new account
          </Button>
        </div>

      </div>
  )
}


export default SignIn
