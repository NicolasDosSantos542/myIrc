import React, {Component, Fragment} from 'react';

class EditLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {login: ''}

        this.handleUpdateLogin = this.handleUpdateLogin.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({
            login: localStorage.getItem('login')
        })
    }

    handleUpdateLogin(event) {
        this.setState({login: event.target.value})
    }

    validateForm() {
        if (this.state.login.length < 2 || this.state.login.length > 9) {
            document.getElementById('login').classList.remove('inputValid');
            document.getElementById('login').classList.add('inputError');
            document.getElementById("loginValidate").innerText = "Doit contenir entre 2 et 9 caractère";
            return false;
        } else {
            document.getElementById('login').classList.remove('inputError');
            document.getElementById('login').classList.add('inputValid');
            document.getElementById("loginValidate").innerText = "";
            return true;
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let valid = this.validateForm()
        console.log(valid)
        if (valid) {
            const token = localStorage.getItem('token')
            const url = "http://localhost:4242/auth/login";
            const option = {
                method: 'PUT',
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    login: this.state.login
                })
            };
            fetch(url, option)
                .then(res => res.json())
                .then(data => {
                    if (!data.success) {
                        window.flash("Echec de la modification", data.error, "danger");
                    } else {
                        localStorage.setItem('login', data.login);
                        window.flash("", "Votre login a été modifié", "success");
                        this.componentDidMount();
                    }
                })
        }
    }

    render() {
        return (
            <Fragment>
                <div className="row justify-content-end">
                    <div className="col-12 ps-4 pe-4">
                        <form className="pb-4" onSubmit={this.handleSubmit} method="post">
                            <label htmlFor="login" className="form-label">Nom d'utilisateur</label>
                            <div className="row">
                                <div className="col-9">
                                    <input className="form-control profil_input_color" type="text" id="login" name="login"
                                           onChange={this.handleUpdateLogin} value={this.state.login}/>
                                </div>
                                <button type="submit" className="btn btn-default profil_input_submit col-3">Modifier</button>
                            </div>
                            <div className="row">
                                <div id="loginValidate" className={"errorMessage"}></div>
                            </div>
                        </form>
                    <hr/>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default EditLogin;
