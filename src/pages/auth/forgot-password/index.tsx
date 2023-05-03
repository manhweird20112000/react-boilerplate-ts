import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Form, Typography } from "antd"

import iconArrowRight from '@/assets/icons/icon_arrow_right.svg'
import { TextField } from "@/components/common"
import { type FormRules } from "@/constants"

function ForgotPassword () {
  const [form] = Form.useForm()
  const email : string = Form.useWatch('email', form)
  const navigate = useNavigate()

  const [isSend, setIsSend] = useState<boolean>(false)


  const renderTextButton = useMemo(() => {
    return isSend ? 'Open email app' : 'Reset password'
  }, [isSend])

  const renderCheckHeading = useMemo(() => {
    return isSend ? 'Check your email' : 'Forgot password?'
  }, [isSend])

  const renderTitle = useMemo(() => {
    return isSend ? `We send a password reset link to\n ${email}` : `No worries, we'll send you reset instructions.`
  }, [isSend, email])

  const rules : FormRules = useMemo(() => {
    return {
      email: [
        { required: true },
        { type: 'email' }

      ]
    }
  }, [])

  const handleGoBack = () => {
    navigate('/login', { replace: true })
  }
  return (
    <div>
      <div className="my-4 flex flex-col items-center justify-center">
      <Typography.Title level={5}>
        <span className="text-xl font-semibold text-gray-700">{renderCheckHeading}</span>
      </Typography.Title>
      <Typography.Text>
        <span className="font-normal text-gray-500">{renderTitle}</span>
      </Typography.Text>
      </div>
      {
        !isSend
          ? (
          <Form
        form={form}>
          <TextField
          isShowLabel={true}
          isRequired={true}
          refForm={form}
          name="email"
          label="Email"
          placeholder="Enter your email"
          rules={rules.email}
          />
          <Button type="primary"
            size="large"
            className="w-full">
            {renderTextButton}
          </Button>
        </Form>
            )
          : (
            <div className="my-4 text-center text-sm">
              <span className="text-gray-400">{"Didn't receive the email? "}</span>
              <Typography.Link>
                <span className="font-medium text-[#00b96b] ">Click to resend</span>
              </Typography.Link>
          </div>
            )
      }

      <Button
        onClick={handleGoBack}
        className="mt-2 w-full"
        type="text"
        size="large">
          <div className="flex items-center justify-center">
          <img
            width={20}
            height={20}
            src={iconArrowRight}
            alt="" />
            <span className="ml-2 font-medium text-gray-500">Back to log in</span>
          </div>
      </Button>
    </div>
  )
}

export default ForgotPassword

