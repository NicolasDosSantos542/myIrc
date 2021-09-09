import React, {Component, Fragment} from 'react';

class EditPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {password: '', newPassword: '', confPassword: '', items: {}};

        this.handleUpdatePassword = this.handleUpdatePassword.bind(this)
        this.handleUpdateNewPassword = this.handleUpdateNewPassword.bind(this)
        this.handleUpdateConfirmPassword = this.handleUpdateConfirmPassword.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUpdatePassword(event) {
        this.setState({password: event.target.value})
    }

    handleUpdateNewPassword(event) {
        this.setState({newPassword: event.target.value})
    }

    handleUpdateConfirmPassword(event) {
        this.setState({confPassword: event.target.value})
    }

    validateForm() {
        let errorPassword = document.getElementById("passwordValidate");
        let inputConfPassword = document.getElementById("confPassword");
        let inputPassword = document.getElementById("newPassword");

        if (this.state.newPassword !== this.state.confPassword || this.state.newPassword < 2) {
            errorPassword.innerText = "Les mot de passe ne sont pas identique et doivent contenir 2 caractères minimum";
            inputConfPassword.classList.remove('inputValid');
            inputPassword.classList.remove('inputValid');
            inputConfPassword.classList.add('inputError');
            inputPassword.classList.add('inputError');
            return false
        } else {
            errorPassword.innerText = "";
            inputConfPassword.classList.remove('inputError');
            inputPassword.classList.remove('inputError');
            inputConfPassword.classList.add('inputValid');
            inputPassword.classList.add('inputValid')
            return true
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let valid = this.validateForm();
        if (valid) {
            let token = localStorage.getItem("token")
            const url = "http://localhost:4242/auth/password"
            const requestOption = {
                method: 'PUT',
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    password: this.state.password,
                    newPassword: this.state.newPassword,
                    confPassword: this.state.confPassword,
                })
            }
            fetch(url, requestOption)
                .then(response => response.json())
                .then(data => {
                    let inputPassword = document.getElementById("password");
                    let duplicatePassword = document.getElementById("passwordDuplicate");
                    if (data.error) {
                        duplicatePassword.innerText = data.error;
                        inputPassword.classList.add('inputError');
                    } else {
                        duplicatePassword.innerText = "";
                        inputPassword.classList.remove('inputError');
                        inputPassword.classList.add('inputValid');
                        window.flash('', 'Votre mot de passe a été modifiées')
                    }
                })
        }
    }

    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-12 ps-4 pe-4">
                        <form onSubmit={this.handleSubmit} method="post">
                            <div className="mb-2">
                                <label htmlFor="passwordC" className="form-label">Mot de passe</label>
                                <input className="form-control profil_input_color" type="password" id="password"
                                       name="passwordC"
                                       onChange={this.handleUpdatePassword} placeholder="● ● ● ● ● ● ● ●"/>
                                <div id="passwordDuplicate" className={"errorMessage"}></div>
                            </div>
                            <div className="mt-3">
                                <label htmlFor="newPassword" className="form-label">Nouveau mot de passe</label>
                                <input className="form-control profil_input_color" type="password" id="newPassword"
                                       name="newPassword"
                                       onChange={this.handleUpdateNewPassword} placeholder="● ● ● ● ● ● ● ●"/>
                            </div>
                            <div className="mt-3">
                                <label htmlFor="comfirmPass" className="form-label">Confirmer le nouveau mot de
                                    passe</label>
                                <input className="form-control profil_input_color" type="password" id="confPassword"
                                       name="comfirmPass"
                                       onChange={this.handleUpdateConfirmPassword} placeholder="● ● ● ● ● ● ● ●"/>
                            </div>
                            <div id="passwordValidate" className={"errorMessage"}></div>
                            <div className="row justify-content-center mt-1">
                                <button type="submit"
                                        className="btn btn-default profil_input_submit mt-4 col-xl-5 col-lg-6 col-md-8 col-10">
                                    Modifier mon mot de passe
                                </button>
                            </div>
                        </form>
                        <hr/>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default EditPassword
