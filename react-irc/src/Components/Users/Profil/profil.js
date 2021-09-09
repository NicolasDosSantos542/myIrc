import React, {Component, Fragment} from 'react';
import Flash from "../../Flash/flash";
import "./profil.css"
import EditLogin from "./Edit/editLogin";
import EditNickName from "./Edit/editNickName";
import EditPassword from "./Edit/editPassword";
import DeleteUser from './Edit/deleteUser';

class Profil extends Component {

    render() {
        return (
            <Fragment>
                <div>
                    <div className="row justify-content-center">
                        <div className="col-8">
                            <Flash/>
                        </div>
                    </div>
                </div>
                <EditLogin/>
                <EditNickName/>
                <EditPassword/>
                <DeleteUser/>
            </Fragment>
        )
    }
}

export default Profil
