import React from 'react';
import ReactDOM from 'react-dom';

class RegisterForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username_msg: '',
      usernameIsCorrect: false,
      mailIsCorrect: false,
      passwordIsCorrect: false,
      password2IsCorrect: false,
      role: 1,
      name: 'name'
    };
  }

  updateState = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({[name]: value});
  }

  handleNameChange = (e) => {
    let username = e.target.value;
    if (username===''){
      this.setState({username_msg: ''})
      this.setState({usernameIsCorrect: false})
    }else{
      //check if username is already taken
      let headers = new Headers();
      headers.append("Content-Type", "application/json");

      let data = {
        "username": username,
      };

      let requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
        redirect: 'follow'
      };

      fetch("http://localhost/ecal/rest/register/username-is-available.php", requestOptions)
      //.then(response => response.text())
      //.then(result => console.log(result))
      .then(result => result.json())
      .then(result => {
        if (result.usernameIsAvailable === "true"){
          this.setState({usernameIsCorrect: true});
          this.setState({username_msg: ""});
        }
        else{
          this.setState({username_msg: username + " is already taken"})
        }
      })
      .catch(error => console.log('error', error));
    }
    this.updateState(e);
  }

  handleMailChange = (e) => {
    let validMailPattern = /\S+@\S+\.\w{2}/;
    let mail = e.target.value;
    if (mail===''){
      this.setState({mail_msg: ''})
    }else{
      if (validMailPattern.test(mail)){
        this.setState({mail_msg: ''})
        this.setState({mailIsCorrect: true})
      }else{
        this.setState({mail_msg: 'No valid mail!'})
        this.setState({mailIsCorrect: false})
      }
    }
    this.updateState(e);
  }

  handlePasswordChange = (e) => {
    let password = e.target.value;
    if (password.length===0){
      this.setState({password_msg: ''});
    }else if (password.length<8) {
      this.setState({password_msg: 'Password is too short!'});
      this.setState({passwordIsCorrect: false});
    }else{
      this.setState({password_msg: ''});
      this.setState({passwordIsCorrect: true});
    }
    this.updateState(e);
  }

  handlePassword2Change = (e) => {
    let password2 = e.target.value;
    if (password2 === this.state.password){
      this.setState({password2_msg: ''});
      this.setState({password2IsCorrect: true});
    }else{
      this.setState({password2_msg: 'Passwords don\'t match!'});
      this.setState({password2IsCorrect: false});
    }
    this.updateState(e);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if ( !(this.state.usernameIsCorrect && this.state.mailIsCorrect &&this.state.passwordIsCorrect && this.state.password2IsCorrect)){
      this.setState({form_msg: 'Fill out all forms correctly!'})
    }
    else{
      let headers = new Headers();
      headers.append("Content-Type", "application/json");

      let data = {
        "username": this.state.username,
        "name": this.state.name,
        "mail": this.state.mail,
        "password": this.state.password,
        "role": this.state.role
      };

      let requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
        redirect: 'follow'
      };

      fetch("http://localhost/ecal/rest/register/register.php", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

      this.setState({form_msg: 'Succes!'})
    }


  }


  render() {
    return (
      <form id='registerForm' onSubmit={this.handleSubmit} style={{maxWidth: "20em"}}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" className="form-control" onChange={this.handleNameChange}/>
          <span className="help-block">{this.state.username_msg}</span>
        </div>
        <div className="form-group">
          <label>Mail</label>
          <input type="text" name="mail" className="form-control" onChange={this.handleMailChange}/>
          <span className="help-block">{this.state.mail_msg}</span>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" className="form-control" onChange={this.handlePasswordChange}/>
          <span className="help-block">{this.state.password_msg}</span>
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="password2" className="form-control" onChange={this.handlePassword2Change}/>
          <span className="help-block">{this.state.password2_msg}</span>
        </div>
        <div className="form-group">
            <input type="submit" className="btn btn-primary" value="Register"/>
            <input type="reset" className="btn btn-default" value="Cancel"/>
            <span className="help-block">{this.state.form_msg}</span>
        </div>
      </form>
    );
  }
}

export default RegisterForm
