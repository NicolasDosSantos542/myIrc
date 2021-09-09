import React, {Component, Fragment} from 'react';

class EditnickName extends Component {
    constructor(props) {
        super(props);
        this.state = {nickName: ''}

        this.handleUpdateNickName = this.handleUpdateNickName.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({
            nickName: localStorage.getItem('nickName')
        })
    }

    handleUpdateNickName(event) {
        this.setState({nickName: event.target.value})
    }

    validateForm() {
        if (this.state.nickName.length < 2 || this.state.nickName.length > 9) {
            document.getElementById('nickName').classList.remove('inputValid');
            document.getElementById('nickName').classList.add('inputError');
            document.getElementById("nickNameValidate").innerText = "Doit contenir entre 2 et 9 caractère";
            return false;
        } else {
            document.getElementById('nickName').classList.remove('inputError');
            document.getElementById('nickName').classList.add('inputValid');
            document.getElementById("nickNameValidate").innerText = "";
            return true;
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let valid = this.validateForm()
        console.log(valid)
        if (valid) {
            const token = localStorage.getItem('token')
            const url = "http://localhost:4242/auth/nickName";
            const option = {
                method: 'PUT',
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    nickName: this.state.nickName
                })
            };
            fetch(url, option)
                .then(res => res.json())
                .then(data => {
                    if (!data.success) {
                        window.flash("Echec de la modification", data.error, "danger");
                    } else {
                        localStorage.setItem('nickName', data.nickName);
                        window.flash("", "Votre pseudonyme a été modifié", "success");
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
                            <label htmlFor="nickName" className="form-label">Pseudonyme</label>
                            <div className="row">
                                <div className="col-9">
                                    <input className="form-control profil_input_color" type="text" id="nickName" name="nickName"
                                           onChange={this.handleUpdateNickName} value={this.state.nickName}/>
                                </div>
                                <button type="submit" className="btn btn-default profil_input_submit col-3">Modifier</button>
                            </div>
                            <div className="row">
                                <div id="nickNameValidate" className={"errorMessage"}></div>
                            </div>
                        </form>
                        <hr/>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default EditnickName;
