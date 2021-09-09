import React, {Component, Fragment} from 'react'
import "./register.css";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {login: '', nickName: '', password: '', confPassword: '', redirect: null};

        this.handleChangeLogin = this.handleChangeLogin.bind(this);
        this.handleChangeNickName = this.handleChangeNickName.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleChangeConf = this.handleChangeConf.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeLogin(event) {
        this.setState({login: event.target.value});
    }

    handleChangeNickName(event) {
        this.setState({nickName: event.target.value});
    }

    handleChangePass(event) {
        this.setState({password: event.target.value});
    }

    handleChangeConf(event) {
        this.setState({confPassword: event.target.value});
    }

    VerifyForm() {
        let valid = {login: false, nickName: false, password: false}
        let errorLogin = document.getElementById("loginValidate");
        let inputLogin = document.getElementById("login");
        let errorNickName = document.getElementById("nickNameValidate");
        let inputNickName = document.getElementById("nickName");
        let errorPassword = document.getElementById("passwordValidate");
        let inputConfPassword = document.getElementById("confPassword");
        let inputPassword = document.getElementById("password");

        if(this.state.login < 2 || this.state.login > 9) {
            errorLogin.innerText = "Doit contenir entre 2 et 9 caractère";
            inputLogin.classList.add('inputError')
        } else {
            errorLogin.innerText = "";
            inputLogin.classList.add('inputValid')
            valid.login = true
        }
        if(this.state.nickName < 2 || this.state.nickName > 9) {
            errorNickName.innerText = "Doit contenir entre 2 et 9 caractère";
            inputNickName.classList.add('inputError')
        } else {
            errorNickName.innerText = "";
            inputNickName.classList.add('inputValid')
            valid.nickName = true
        }
        if(this.state.password !== this.state.confPassword || this.state.password < 2) {
            errorPassword.innerText = "Les mot de passe ne sont pas identique et doivent contenir 2 caractères minimum";
            inputConfPassword.classList.add('inputError');
            inputPassword.classList.add('inputError');
        } else {
            errorPassword.innerText = "";
            inputConfPassword.classList.add('inputValid');
            inputPassword.classList.add('inputValid')
            valid.password = true
        }
        return !(valid.login === false || valid.nickName === false || valid.password === false);
    }

    handleSubmit(event) {
        event.preventDefault();
        let valid = this.VerifyForm()
        if(valid === true) {
            const url = "http://localhost:4242/auth/register";
            const option = {
                method: "POST",
                headers: {"Content-Type": 'application/json'},
                body: JSON.stringify({
                    login: this.state.login,
                    nickName: this.state.nickName,
                    password: this.state.password,
                    confPassword: this.state.confPassword
                })
            };
            fetch(url, option)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.setState({redirect: true})
                    } else {
                        window.flash("L'inscription n'a pas abouti :", data.error, "danger")
                    }
                })
        }
    }

    render() {
        if(this.state.redirect === true) {
            window.location.reload();
        }
        return (
            <Fragment>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-xl-8 col-lg-10 col-sm-10 col-12 pl-4 pr-4 rounded-3'>
                            <form onSubmit={this.handleSubmit} method="post">
                                <div className="mt-4">
                                    <label htmlFor="login" className="form-label">Nom d'utilisateur</label>
                                    <input className="form-control input_color" type="text" id="login" name="login"
                                           value={this.state.login}
                                           onChange={this.handleChangeLogin}/>
                                    <div id="loginValidate" className={"errorMessage"}></div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="nickName" className="form-label">Pseudonyme</label>
                                    <input className="form-control input_color" type="text" id="nickName" name="nickName"
                                           value={this.state.nickName}
                                           onChange={this.handleChangeNickName}/>
                                    <div id="nickNameValidate" className={"errorMessage"}></div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="password" className="form-label">Mot de passe</label>
                                    <input className="form-control input_color" type="password" id="password" name="password"
                                           onChange={this.handleChangePass}/>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="confPassword" className="form-label">Confirmation du mot de
                                        passe</label>
                                    <input className="form-control input_color" type="password" id="confPassword"
                                           name="confPassword" onChange={this.handleChangeConf}/>
                                    <div id="passwordValidate" className={"errorMessage"}></div>
                                </div>
                                <div className="row justify-content-center mt-3">
                                    <button type="submit" className="btn mt-4 col-6 input_submit">
                                        Valider mon inscription
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Register
