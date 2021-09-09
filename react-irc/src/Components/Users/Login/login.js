import React, {Component, Fragment} from 'react'
import Register from "../Register/register";
import Flash from '../../Flash/flash'
import "./login.css"

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            redirect: null,
            registered: null
        };

        this.handleChangeLogin = this.handleChangeLogin.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changeForRegister = this.changeForRegister.bind(this);
        this.changeForLogin = this.changeForLogin.bind(this);
    }

    changeForRegister() {
        this.setState({registered: true});
    }
    changeForLogin() {
        this.setState({registered: null});
    }

    handleChangeLogin(event) {
        this.setState({login: event.target.value});
    }

    handleChangePass(event) {
        this.setState({password: event.target.value});
    }

    handleRedirectTo() {
        window.location.href = '/message'
    }

    handleSubmit(event) {
        event.preventDefault();
        const url = "http://localhost:4242/auth/connect";
        const requestOptions = {
            method: 'POST',
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({
                login: this.state.login,
                password: this.state.password,
            })
        };
        fetch(url, requestOptions)
            .then(response => {
                console.log(response)
                return response.json()
            })
            .then(data => {
                console.log(data);
                if (!data.success) {
                    document.getElementById('login').classList.add('inputError');
                    document.getElementById('password').classList.add('inputError');
                    window.flash("", "Vos identifiant sont incorect !", "danger")
                } else {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('login', data.login);
                    localStorage.setItem('nickName', data.nickName)
                    this.handleRedirectTo()
                }
            });
    }

    render() {
        if (this.state.registered === true) {
            return (
                <Fragment>
                    <div className="row justify-content-center">
                        <div className="col-xl-8 col-lg-10 col-sm-10 col-12">
                            <Flash />
                        </div>
                    </div>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-8 col-lg-10 col-sm-10 col-12">
                                <button className="btn btn-default p-0" onClick={this.changeForLogin}>
                                    <img src={process.env.PUBLIC_URL + '/assets/arrow_return.png'} alt=""/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <Register/>
                </Fragment>
            );
        }
        return (
            <Fragment>
                <div className="col-xl-8 col-lg-10 col-sm-10 col-12 p-2 rounded-3">
                    <form onSubmit={this.handleSubmit} method="post">
                        <div className="mt-3">
                            <label htmlFor="login" className="form-label">Nom d'utilisateur</label>
                            <input className="form-control input_color" type="text" id="login" name="login"
                                   onChange={this.handleChangeLogin}/>
                        </div>
                        <div className="mt-3">
                            <label htmlFor="password" className="form-label">Mot de passe</label>
                            <input className="form-control input_color" type="password" id="password" name="password"
                                   onChange={this.handleChangePass}/>
                        </div>
                        <div className="row justify-content-evenly mt-5">
                            <button type="submit" className="btn col-5 input_submit">Connexion</button>
                            <button onClick={this.changeForRegister} className="btn col-5 input_register">M'inscrire
                            </button>
                        </div>
                    </form>
                </div>
            </Fragment>
        )
    }
}

export default Login
