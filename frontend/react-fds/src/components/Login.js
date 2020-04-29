import React from 'react'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

class Login extends React.Component {
  render() {
    return (
      <div className='login'>
        <Form>
          <FormGroup>
            <Label for='username'>Username</Label>
            <Input type='username' id='username' placeholder='Username' />
          </FormGroup>
          <FormGroup>
            <Label for='password'>Password</Label>
            <Input type='password' id='password' placeholder='Password' />
          </FormGroup>
          <Button>Login</Button>
          {' '}
          <Button>Register</Button>
        </Form>
      </div>
    )
  }
}

export default Login