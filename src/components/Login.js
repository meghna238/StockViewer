import React, { Component } from 'react';
import firebase from '../Firebase';
import '../components/login.css';
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
import history from '../History';
import { Row, Col, Image } from 'react-bootstrap';
import logo from './logo.png';
import login_image from './bgimage.jpg';

class Login extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('users');
    this.state = {
      email: '',
      password: '',
      user: [],
      array: [],
      hidden: true,
      loginUser: ''
    };
    this.toggleShow = this.toggleShow.bind(this);
  }

  onCollectionUpdate = (querySnapshot) => {
    const user = [];
    querySnapshot.forEach((doc) => {
      const { email, password } = doc.data();
      user.push({
        key: doc.id,
        doc,
        email,
        password,
      });
    });
    this.setState({
      user
    });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  /**hide or show password field value */
  toggleShow() {
    this.setState({ hidden: !this.state.hidden });
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /**sign in with email and password */
  signInWithEmailAndPassword = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    console.log(email);
    console.log(password);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password).then(() => {
        this.setState({ loginUser: email })
        localStorage.setItem('email1', email);
        console.log("login sucessfully");
        history.push('/Company-list')
        // window.location.hash = '/Company-list'
      }).catch((error) => {
        console.log('hey error: ', error);
        if (error.code === "auth/user-not-found") {
          swal("Email not found", "Please, Signup", "error");
        } else if (error.code === " auth/wrong-password") {
          swal("Please Enter correct password", "", "error");
        } else {
          swal("Internal Server Error");
        }
      })
  };

  render() {
    const { email, password } = this.state;
    return (
      // <div>
      //   <div className="backgroung_class">
      //     <div className="main_class">
      //       <h1 className="text-center">Stock Login</h1>
      //       <form onSubmit={(event) => this.signInWithEmailAndPassword(event)}>
      //       <Grid container spacing={1} xs={12}>
      //         <Grid item sm={12} xs={12}>
      //           <TextField
      //             id="outlined-email-input"
      //             label="Email"
      //             type="email"
      //             name="email"
      //             autoComplete="email"
      //             margin="normal"
      //             variant="outlined"
      //             value={email}
      //             onChange={this.handleInputChange}
      //           />
      //         </Grid>
      //         <Grid item sm={12} xs={12}>
      //           <TextField
      //             id="outlined-password-input"
      //             label="Password"
      //             type={this.state.hidden ? "password" : "text"}
      //             name="password"
      //             autoComplete="current-password"
      //             margin="normal"
      //             variant="outlined"
      //             value={password}
      //             onChange={this.handleInputChange}
      //             InputProps={{
      //               endAdornment: (
      //                 <InputAdornment position="end">
      //                   <IconButton
      //                     edge="end"
      //                     aria-label="Toggle password visibility"
      //                     onClick={this.toggleShow}
      //                   >
      //                     {password ? <VisibilityOff /> : <Visibility />}
      //                   </IconButton>
      //                 </InputAdornment>
      //               ),
      //             }}
      //           />
      //         </Grid>
      //         <Grid item sm={12} xs={12}>
      //           <Button type="submit" color="primary" disabled={!this.state.email || !this.state.password} variant="contained" size="large" onClick={(event) => this.signInWithEmailAndPassword(event)}>
      //             Login
      //          </Button>
      //         </Grid>
      //         <Grid item sm={12}>
      //           <Divider />
      //           <div className="text-center">
      //             New User? <Button color="primary"><Link to="/sign-up">Sign Up</Link></Button>
      //           </div>
      //         </Grid>
      //       </Grid>
      //       </form>
      //     </div>
      //   </div>
      // </div>

      <div className="login_form">
        <Row>
          <Col lg={5} md={12} className="p-0">
            <div className="main_class">
              <Image src={logo} alt="logo" />
              <h1>Stock Login</h1>
              <p>Welcome Back, Please login to your account</p>
              <form className="form_login" onSubmit={(event) => this.signInWithEmailAndPassword(event)}>
                <Grid item sm={12} xs={12}>
                  <div className="login_email_field">
                    <TextField
                      id="outlined-email-input"
                      label="Email Address"
                      type="email"
                      name="email"
                      autoComplete="email"
                      margin="normal"
                      variant="outlined"
                      value={email}
                      onChange={this.handleInputChange}
                      required />
                  </div>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <div className="login_password_field">
                    <TextField
                      id="outlined-password-input"
                      label="Password"
                      type={this.state.hidden ? "password" : "text"}
                      name="password"
                      autoComplete="current-password"
                      margin="normal"
                      variant="outlined"
                      value={password}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </Grid>
              </form>
              <Row>
                <Button type="submit" className="login_btn" variant="contained" size="large" disabled={!this.state.email || !this.state.password} variant="contained" size="large" onClick={(event) => this.signInWithEmailAndPassword(event)}>
                  Login
                      </Button>
                <Link to="/sign-up" className="signup_btn">Sign up</Link>
              </Row>
            </div>
          </Col>

          <Col lg={7} md={12} className="p-0">
            <div className="login_img">
              <Image src={login_image} alt="signup page image" />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;

