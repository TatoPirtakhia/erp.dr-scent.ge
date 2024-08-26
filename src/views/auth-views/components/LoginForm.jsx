import React, { useEffect, useState, useContext } from "react"
import { connect, useDispatch, useSelector } from "react-redux"
import { Button, Form, Input } from "antd"
import { MailOutlined, LockOutlined } from "@ant-design/icons"
import PropTypes from "prop-types"
import {
  signIn,
  showLoading,
  showAuthMessage,
  hideAuthMessage,
  signInWithGoogle,
  signInWithFacebook,
} from "../../../store/slices/authSlice"
import { useNavigate } from "react-router-dom"
import Flex from "../../../components/shared-components/Flex"
import debouncedValidateEmail from "../../../utils/emailCheck"
import CustomHelmet from "../../../utils/customHelmet"
import ReCAPTCHA from "react-google-recaptcha"
import { getTranslation } from "../../../lang/translationUtils"
import { setSettings } from "../../../store/slices/systemInfoSlice"

export const LoginForm = (props) => {
  const [recaptchaNormalToken, setReCaptchaToken] = useState(null);
  const [isActiveRecaptcha, setIsActiveRecaptcha] = useState(false);
  const [invisible, setInvisible] = useState(false);
  const recaptchaRef = React.useRef();
  const [siteKey, setSiteKey] = useState('');
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useSelector(state => state.theme.currentTheme)
  const {
    loading,
  } = props

//   useEffect(() => {
//     dispatch(getRecaptcha('login_recaptcha')).then((response) => {
//       if (!response.error) {
//         setSiteKey(response.payload.site_key)
//         setIsActiveRecaptcha(response.payload.isActive)
//         setInvisible(response.payload.invisible)
//       }
//     })
//   }, [])

  const onLogin = async (values) => {
    // let recaptchaToken = recaptchaNormalToken
    // if (invisible) {
    //   recaptchaToken = await recaptchaRef.current.executeAsync();
    // }

    dispatch(signIn({ ...values,  email: values.email.toLowerCase() })).then((response) => {
      if (!response.error) {
         dispatch(setSettings(response.payload.settings))
      }
    })
  }

  // const onGoogleLogin = () => {
  //   showLoading()
  //   signInWithGoogle()
  // }

 

  // const renderOtherSignIn = (
  //   <div>
  //     <Divider>
  //       <span className="text-muted font-size-base font-weight-normal">
  //         or connect with
  //       </span>
  //     </Divider>
  //     <div className="d-flex justify-content-center">
  //       <Button
  //         onClick={() => onGoogleLogin()}
  //         className="mr-2"
  //         disabled={loading}
  //         icon={<CustomIcon svg={GoogleSVG} />}
  //       >
  //         Google
  //       </Button>
  //     </div>
  //   </div>
  // )
  function onChange(value) {
    setReCaptchaToken(value);
  }
  return (
    <>
      <CustomHelmet title="auth.SignIn" />

      <Form layout="vertical" name="login-form" onFinish={onLogin}>
        <Form.Item
          name="email"
          label={getTranslation("auth.email")}
          rules={[
            {
              required: true,
              message:getTranslation("auth.email_error_empty"),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                if (isValidEmail) {
                  return Promise.resolve();
                } else {
                  return new Promise((resolve, reject) => {
                    debouncedValidateEmail(rule, value,getTranslation("auth.email_error_validation"), resolve, reject);
                  });
                }
              },
            }),
          ]}
        >
          <Input prefix={<MailOutlined className="text-primary " />} type="email" name="email" />
        </Form.Item>
        <Form.Item
          name="password"
          label={getTranslation("auth.password")}
          rules={[
            {
              required: true,
              message: getTranslation("auth.password_error"),
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined className="text-primary " />} />
        </Form.Item>
        <Flex justifyContent="end" className="-mt-5" >
          <Button type="link" onClick={() => navigate("/auth/forgot-password")}>{getTranslation( "auth.forgot_password")}</Button>
        </Flex>
        {siteKey && isActiveRecaptcha ?
          <div className={`flex justify-center`}>
            <ReCAPTCHA
              theme={theme}
              ref={recaptchaRef}
              size={invisible ? 'invisible' : 'normal'}
              hl="ka"
              sitekey={siteKey}
              onChange={onChange}
            />
          </div> : null}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ marginTop: "10px" }}
          >
            {getTranslation("auth.SignIn")}
          </Button>
        </Form.Item>
        {/* {otherSignIn ? renderOtherSignIn : null}
        {extra} */}
      </Form>
    </>
  )
}

LoginForm.propTypes = {
  otherSignIn: PropTypes.bool,
  showForgetPassword: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

LoginForm.defaultProps = {
  otherSignIn: true,
  showForgetPassword: false,
}

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage, token, redirect } = auth
  return { loading, message, showMessage, token, redirect }
}

const mapDispatchToProps = {
  signIn,
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  signInWithGoogle,
  signInWithFacebook,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
