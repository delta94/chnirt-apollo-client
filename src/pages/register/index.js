import React, { Component } from 'react'
import { Form, Input, Icon, Button, Row, Col, Typography, Divider } from 'antd'
import './style.scss'
import { Link } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

const { Title } = Typography
export class Register extends Component {
	state = {
		email: 'chin@gmail.com',
		password: 'd3f4ultP4ssword!',
		username: 'trinhchin',
		loading: false,
		errors: []
	}
	handleSubmit = e => {
		e.preventDefault()
		this.setState({ loading: true, spin: true })
		this.props.form.validateFields((err, values) => {
			if (!err) {
				// console.log('Received values of form: ', values)
			}
			const { email, password, username } = values
			this.props.client
				.mutate({
					mutation: USER_REGISTER,
					variables: {
						userInput: {
							email,
							password,
							username
						}
					}
				})
				.then(res => {
					// console.log(res.data.register)
					if (res.data.register) {
						this.setState({
							email: '',
							password: '',
							username: '',
							loading: false,
							spin: false
						})
						openNotificationWithIcon(
							'success',
							'register',
							'Registration Successful.',
							'We welcome a new MEMBER.',
							'bottomRight'
						)
					}
				})
				.catch(err => {
					// console.log(err)
					const errors = err.graphQLErrors.map(error => error.message)
					this.setState({
						loading: false,
						spin: false
					})
					openNotificationWithIcon(
						'error',
						'register',
						'Registration Failed.',
						errors[0]
					)
				})
		})
	}

	render() {
		const { getFieldDecorator } = this.props.form
		return (
			<>
				<Row id="layout-login">
					<Col
						xs={{ span: 24, offset: 0 }}
						sm={{ span: 16, offset: 8 }}
						md={{ span: 14, offset: 10 }}
						lg={{ span: 12, offset: 12 }}
						xl={{ span: 7, offset: 17 }}
					>
						<div id="components-form-demo-normal-login">
							<Form onSubmit={this.handleSubmit} className="login-form">
								<div className="login-form-header">
									<Title level={1}>Chnirt</Title>
									<Title level={4}>Sign up to watch Ant Design template.</Title>
								</div>
								<Form.Item>
									{getFieldDecorator('username', {
										valuePropName: 'defaultValue',
										initialValue: this.state.username,
										rules: [
											{
												required: true,
												message: 'Please input your username!'
											}
										]
									})(
										<Input
											prefix={
												<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
											}
											placeholder="Username"
										/>
									)}
								</Form.Item>
								<Form.Item>
									{getFieldDecorator('email', {
										valuePropName: 'defaultValue',
										initialValue: this.state.email,
										rules: [
											{
												type: 'email',
												message: 'The input is not valid E-mail!'
											},
											{
												required: true,
												message: 'Please input your E-mail!'
											}
										]
									})(
										<Input
											prefix={
												<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
											}
											placeholder="Your@email.com"
										/>
									)}
								</Form.Item>
								<Form.Item>
									{getFieldDecorator('password', {
										valuePropName: 'defaultValue',
										initialValue: this.state.password,
										rules: [
											{
												required: true,
												message: 'Please input your Password!'
											}
										]
									})(
										<Input
											prefix={
												<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
											}
											type="password"
											placeholder="Password"
										/>
									)}
								</Form.Item>
								<Form.Item>
									<Button
										type="primary"
										htmlType="submit"
										className="login-form-button"
										loading={this.state.loading}
										disabled={this.state.loading}
									>
										{!this.state.loading ? <Icon type="user-add" /> : null}
										Register
									</Button>
									<Divider>OR</Divider>
									Already have an account?
									<Link to="/login"> Login.</Link>
								</Form.Item>
							</Form>
						</div>
					</Col>
				</Row>
			</>
		)
	}
}
const USER_REGISTER = gql`
	mutation($userInput: UserInput!) {
		register(userInput: $userInput)
	}
`

export default withApollo(Form.create({ name: 'register' })(Register))
