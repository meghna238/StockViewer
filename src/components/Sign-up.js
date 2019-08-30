import React, { Component } from 'react';
import firebase from '../Firebase';
import './login.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Container } from '@material-ui/core';
import { Row, Col, Image } from 'react-bootstrap';
import logo from './logo.png';
import sign_up_image from './sign_up.jpg';

class SignUp extends Component {

  constructor() {
    super();
    this.ref = firebase.firestore().collection('users');
    this.state = {
      email: '',
      password: '',
      username: '',
      createdAt: '',
      hidden: true,
    };
    // this.toggleShow = this.toggleShow.bind(this);
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
    console.log("state=============?", this.state.username);
  }

  /**show or hide password field value */
  // toggleShow() {
  //   this.setState({ hidden: !this.state.hidden });
  // }

  /**signUp and add data to databse */
  signUp = (e) => {
    e.preventDefault();
    const { email, password, username } = this.state;
    console.log('users: ', email, password, username);
    if (!username) {
      swal("Username is required", "", "error");
      return;
    }
    this.ref.add({
      email,
      password,
      username,
      createdAt: Date.now(),
      isDeleted: false,
      updatedAt: Date.now(),
      company: []
    }).then((docRef) => {
      this.setState({
        email: '',
        password: '',
        username: ''
      });
      console.log("name-=============>", this.state.username);
    })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password).then((u) => {
        console.log("u:", u)
        if (!this.state.username) {
          swal("Please, Enter Username", "", "error");
        }
        console.log("props:::::::::::", this.props)
        swal("Signup sucessfully", "", "success");
        this.props.history.push("/login");
      }).catch((error) => {
        console.log("error===========>", error);
        if (error.code === "auth/weak-password") {
          swal("Enter Strong Password", "Password should be at least 6 characters", "error");
        } else if (error.code === "auth/email-already-in-use") {
          swal("Email already registerd", "", "error");
        } else if (error.code === "auth/invalid-email") {
          swal("Enter valid Email", "", "error");
        } else if (error.code === "Cannot read property 'users' of undefined") {
          swal("Please, Enter Username", "", "error");
        } else {
          swal("Internal Server Error", "", "error");
        }
      });
  };

  /**username and password validation */
  isDisabled() {
    if (!this.state.username || !this.state.email || !this.state.password || !(this.state.password.length >= '6')) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { email, password, username } = this.state;
    return (
      <div className="signup_form">
        <Row>
          <Col lg={5} md={12} className="p-0">
            <div className="main_class ">
              <Image src={logo} alt="logo" />
              <h1>Stock Signup</h1>
              <p>Welcome Back, Please sign up to continue</p>
              <form className="form_signup" onSubmit={(e) => this.signUp(e)}>
                <Grid container spacing={1} xs={12}>
                  <Grid item sm={12} xs={12}>
                    <div className="username_field">
                      <TextField
                        id="outlined-user-input"
                        label="Username"
                        type="text"
                        name="username"
                        margin="normal"
                        variant="outlined"
                        value={username}
                        required
                        onChange={this.onChange} />
                    </div>
                  </Grid>
                  <Grid item sm={12} xs={12}>
                    <div className="email_field">
                      <TextField
                        id="outlined-email-input"
                        label="Email Address"
                        type="email"
                        name="email"
                        autoComplete="email"
                        margin="normal"
                        variant="outlined"
                        value={email}
                        onChange={this.onChange}
                        required />
                    </div>
                  </Grid>
                  <Grid item sm={12} xs={12}>
                    <div className="password_field">
                      <TextField
                        id="outlined-password-input"
                        label="Password"
                        type={this.state.hidden ? "password" : "text"}
                        name="password"
                        autoComplete="current-password"
                        margin="normal"
                        variant="outlined"
                        value={password}
                        onChange={this.onChange}
                      />
                    </div>
                  </Grid>
                </Grid>
              </form>
              <Row>
                <Button type="submit" className="signup_btn" disabled={this.isDisabled()} variant="contained" size="large" onClick={(e) => this.signUp(e)}>
                  SignUp
                </Button>
                <Link to="/login" className="login_btn">Login</Link>
              </Row>
            </div>
          </Col>

          <Col lg={7} md={12} className="p-0">
            <div className="signup_img">
              <Image src={sign_up_image} alt="signup page image" />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default SignUp;
