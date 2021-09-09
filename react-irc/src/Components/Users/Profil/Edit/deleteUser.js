import React, {Component, Fragment} from 'react';
import {Redirect} from "react-router-dom";

class Delete extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            registered: null,
            sure: null,
            delete: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this)
        this.areYouSure = this.areYouSure.bind(this)

    }

    areYouSure() {
        if (this.state.sure === null) this.setState({sure: true})
        else if (this.state.sure === true) this.setState({sure: null})
    }

    handleSubmit(event) {
        event.preventDefault();

        let myHeader = new Headers();
        let test = localStorage.getItem("token")
        myHeader.set("Authorization", "Bearer " + test)
        const deleterUrl = "http://localhost:4242/auth/";
        const Option = {
            method: 'DELETE',
            headers: myHeader
        }
        fetch(deleterUrl, Option)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.handleRedirect()
                } else {
                    window.flash("", data.error, "danger")
                }
            })

    }

    handleRedirect() {
        this.setState({redirect: '/'})
    }

    render() {
        if (this.state.redirect) {
            localStorage.removeItem("token");
            localStorage.removeItem("login");
            localStorage.removeItem("nickName");
            window.flash("Votre compte a bien été supprimé", "", "success");
            return <Redirect to={this.state.redirect}/>
        } else if (this.state.sure !== null) {
            return (
                <Fragment>
                    <div className="row justify-content-center">
                        <div className="col-12 ps-4 pe-4">
                            <h5 className="text-center profil_title">Êtes-vous sur de vouloir supprimer votre compte
                                <span className="text-danger"> définitivement ?</span></h5>
                            <div className="row justify-content-evenly mt-3">
                                <button type="submit" className="btn btn-default profil_button_denied mt-4 col-3"
                                        onClick={this.areYouSure}>
                                    Non
                                </button>
                                <button type="submit" className="btn btn-default profil_button_delete mt-4 col-3"
                                        onClick={this.handleSubmit}>
                                    Oui
                                </button>
                            </div>
                            <hr/>
                        </div>
                    </div>
                </Fragment>
            )
        }
        return (
            <Fragment>
                <div className="row justify-content-center">
                    <div className="col-12 ps-4 pe-4">
                        <h5 className="text-center profil_title">Supprimer mon compte</h5>
                        <div className="row justify-content-center mt-3">
                            <button type="submit" className="btn btn-default profil_button_delete mt-4 col-5"
                                    onClick={this.areYouSure}>
                                Supprimer
                            </button>
                        </div>
                        <hr/>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Delete
