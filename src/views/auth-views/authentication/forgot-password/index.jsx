import React, { useState } from "react"
import { Card, Row, Col, Form, Input, Button } from "antd"
import { MailOutlined } from "@ant-design/icons"
import { requestPasswordRecovery } from "../../../../store/slices/authSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import debouncedValidateEmail from "../../../../utils/emailCheck"
import CustomHelmet from "../../../../utils/customHelmet"
import ConfettiExplosion from "react-confetti-explosion"
import { useWindowSize } from "react-use"
import { getTranslation } from "../../../../lang/translationUtils"

const backgroundStyle = {
	backgroundImage: "url(/img/others/img-17.jpg)",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
}



const ForgotPassword = (props) => {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [explosion, setExplosion] = useState(false)
	const [emailSent, setEmailSent] = useState(false)
	const dispatch = useDispatch()
	const navigate = useNavigate()



	const onSend = (values) => {
		setLoading(true) // Set loading to true while the request is in progress

		dispatch(requestPasswordRecovery(values))
			.then((response) => {
				if (response.payload === undefined) {
					setExplosion(true)
					setEmailSent(true)
				}
			})
			.catch((error) => {
				console.error(error)
				setEmailSent(false)
			})
			.finally(() => {
				setLoading(false)
			})
	}
	const { width, height } = useWindowSize()
	return (
		<div className="h-100" style={backgroundStyle}>
			<CustomHelmet title="auth.password_recovery" />
			<div className="fixed inset-0 grid place-content-center pointer-events-none">
				{explosion ? <ConfettiExplosion
					force={0.6}
					duration={3500}
					particleCount={350}
					width={width * 2}
				/> : null}

			</div>
			<div className="container d-flex flex-column justify-content-center h-100">
				<Row justify="center">
					<Col xs={20} sm={20} md={20} lg={9}>
						<Card>
							<div className="my-2">
								<div className="text-center">
									{emailSent ? (
										<h3 className="mt-3 font-weight-bold">
											{getTranslation( "auth.passwordResetLinkSendSuccessTitle")}
										</h3>
									) : (
										<h3 className="mt-3 font-weight-bold">{getTranslation( "auth.passwordRecoveryTitle")}</h3>
									)}
									<p className="mb-4">
										{emailSent
											? getTranslation( "auth.passwordResetLinkSendSuccessText")
											: getTranslation( "auth.passwordRecoveryText")}
									</p>
								</div>
								<Row justify="center">
									<Col xs={24} sm={24} md={20} lg={20}>
										{emailSent ? null : (
											<Form
												form={form}
												layout="vertical"
												name="forget-password"
												onFinish={onSend}
											>
												<Form.Item
													name="email"
													rules={[
														{
															required: true,
															message: getTranslation( "auth.email_error_empty"),
														},
														({ getFieldValue }) => ({
															validator(rule, value) {
																const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
																if (isValidEmail) {
																	return Promise.resolve();
																} else {
																	return new Promise((resolve, reject) => {
																		debouncedValidateEmail(rule, value, getTranslation( "auth.email_error_validation"), resolve, reject);
																	});
																}
															},
														}),
													]}
												>
													<Input prefix={<MailOutlined className="text-primary text-[18px]" />} className="text-[18px]" />
												</Form.Item>
												<Form.Item>
													<Button
														loading={loading}
														type="primary"
														htmlType="submit"
														block
													>
														{loading ? getTranslation( "auth.Sending") : getTranslation( "auth.Send")}
													</Button>
												</Form.Item>
											</Form>
										)}
										{
											<div className="text-center ">
												{loading ? (
													<span>Loading...</span>
												) : (
													<Button style={{ padding: 0 }} type="link" onClick={() => navigate('/')} >
														{getTranslation( "auth.returnToLogin")}
													</Button>
												)}
											</div>
										}
									</Col>
								</Row>
							</div>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	)
}

export default ForgotPassword
