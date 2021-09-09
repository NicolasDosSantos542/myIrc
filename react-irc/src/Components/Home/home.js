import React, {Component, Fragment} from 'react';
import Login from "../Users/Login/login"
import Flash from "../Flash/flash"
import './acceuil.css'
class Acceuil extends Component {

    render() {
        return (
            <Fragment>
                <div className="container-fluid">
                    <div className="row justify-content-end">
                        <div className="col-1 p-0 m-0 vh-100 home_gradient d-sm-block d-none"></div>
                        <div className="col-lg-5 col-md-6 col-sm-8 col-12 acceuil_container">
                            <div className="row text-center mt-5 mb-5">
                                <h1 className={"dircord"}>DIRCORD</h1>
                                <p className={"slogan"}>On a pas d'idées, mais on sait copier</p>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-7">
                                    <Flash />
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <Login />
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Acceuil
