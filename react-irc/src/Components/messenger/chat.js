// eslint-disable-next-line no-unused-vars
import './chat.css';
import io from 'socket.io-client';
import React, {Component, Fragment} from "react";
import Profil from "../Users/Profil/profil"
import Flash from "../Flash/flash"

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            conversation: [],
            user: {},
            users: [],
            partLeft: false,
            partRight: false,
            profil: null,
            channel: null,
            list: null,
            inputJoin: null,
            inputCreate: null,
            inputDelete: null
        }
        this.state.user = {
            nickName: localStorage.getItem('nickName'),
            login: localStorage.getItem('login'),
            token: localStorage.getItem('token')
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.displayPartLeft = this.displayPartLeft.bind(this);
        this.displayPartRight = this.displayPartRight.bind(this);
        this.displayProfil = this.displayProfil.bind(this);
        this.changeForMessage = this.changeForMessage.bind(this);
        this.joinCommand = this.joinCommand.bind(this);
        this.changeJoinInput = this.changeJoinInput.bind(this);
        this.changeCreateInput = this.changeCreateInput.bind(this);
        this.changeDeleteInput = this.changeDeleteInput.bind(this);
        this.listCommand = this.listCommand.bind(this);
        this.createCommand = this.createCommand.bind(this);
        this.deleteCommand = this.deleteCommand.bind(this);
        this.BBcode = this.BBcode.bind(this);
    }

    componentDidMount() {
        this.socket = io('http://localhost:4242/');
        this.socket.on("res-join", async (res) => {
            if (res.success && this.state.channel === null) {
                let allUser = res.channel.users
                let tableau = [];
                allUser.forEach(user => {
                    tableau.push(user.nickName)
                })
                this.setState({users: tableau});
                this.setState({conversation: res.channel.message})
                this.setState({channel: res.channel})
                this.scrollToMyRef();
            } else if (res.success && this.state.channel !== null) {
                window.flash('', 'Vous devez quitter le channel avant d\'en rejoindre un autre', 'danger')
            } else {
                //todo redirect to login
            }
        })
        this.socket.on("user-join-your-channel", (nickName) => {
            let pushUser = this.state.users.concat(nickName)
            this.setState({users: pushUser});
            //todo copier discord avec leur message de merde
            window.flash("", nickName + " a rejoint le salon ! :)", "success")
        })
        this.socket.on('list', (list) => {
            this.setState({list: list})
        })
        this.socket.on("success", (data) => {
            window.flash("", data, "success")
        })
        this.socket.on("error", (data) => {
            window.flash("", data.error, "danger")
        })
        this.socket.on("channel-remove", (data) => {
            window.flash("", data, "secondary")
        })
        this.socket.on("leave", (data) => {
            let position = this.state.users.indexOf(data.nickName)
            let spliceUser = this.state.users.splice(position, 1)
            this.setState({users: spliceUser})
            window.flash("", data.error, "danger")
        })
        this.socket.on("new-message", (data) => {
            this.setState(prevState => ({
                conversation: [...prevState.conversation, data]
            }))
            this.scrollToMyRef();
        })
    }

    handleSubmit(e) {

        e.preventDefault();
        const input = document.getElementById("input")
        input.value = ''; // On vide le champ texte
        let message = this.state.message

        switch (true) {
            case message.startsWith('/join'):
                let channelName = message.substr(5).trim()
                this.socket.emit("join-channel", {channel: channelName, token: this.state.user.token})
                this.setState({message: ""})
                break;
            case message.startsWith('/list'): //todo recherche filtré
                this.socket.emit('list');
                this.setState({message: ""})
                break;
            case message.startsWith('/create'):
                let channel = message.substr(7).trim()
                this.socket.emit('create-channel', {name: channel, token: this.state.user.token});
                this.setState({message: ""})
                break;
            case message.startsWith('/leave'):
                if (this.state.channel) {
                    this.socket.emit("leave", {name: this.state.channel.name, nickName: this.state.user.nickName})
                    this.setState({users: []})
                    this.setState({channel: null})
                    this.setState({conversation: []})
                }
                this.setState({message: ""})
                break;
            case message.startsWith('/delete'):
                let deleteChannel = message.substr(7).trim()
                this.socket.emit('delete-channel', {name: deleteChannel, token: this.state.user.token})
                this.setState({message: ""})
                break;
            default:
                if (this.state.channel === null) {
                    window.flash("", "Connecte toi a un channel", "danger")
                } else {
                    this.socket.emit('new-message', {
                        name: this.state.channel.name,
                        message: message,
                        token: this.state.user.token
                    })
                    let myMessage = {
                        idUser: this.state.user.id,
                        login: this.state.user.login,
                        nickName: this.state.user.nickName,
                        message: message
                    }
                    this.setState(prevState => ({
                        conversation: [...prevState.conversation, myMessage]
                    }))
                    this.scrollToMyRef();
                }
        }
        input.focus(); // Focus sur le champ du message
    }

    changeJoinInput(event) {
        this.setState({inputJoin: event.target.value})
    }

    changeCreateInput(event) {
        this.setState({inputCreate: event.target.value})
    }

    changeDeleteInput(event) {
        this.setState({inputDelete: event.target.value})
    }

    joinCommand(event) {
        event.preventDefault();
        document.getElementById('joinInput').value = ""
        if (this.state.channel === null) {
            let channelName = this.state.inputJoin.trim()
            this.socket.emit("join-channel", {channel: channelName, token: this.state.user.token})
            this.setState({inputJoin: ""})
        } else {
            window.flash("", "Vous devez quitter le channel si vous voulez en rejoindre un autre", "danger")
        }
    }

    listCommand() {
        this.socket.emit('list');
    }

    createCommand(event) {
        event.preventDefault();
        document.getElementById('createInput').value = ""
        if (this.state.channel === null) {
            let channelName = this.state.inputCreate.trim()
            this.socket.emit('create-channel', {name: channelName, token: this.state.user.token});
            this.setState({inputCreate: ""})
        } else {
            window.flash("", "Vous devez quitter le channel si vous voulez en créer un autre", "danger")
        }
    }

    deleteCommand(event) {
        event.preventDefault();
        document.getElementById('deleteInput').value = "";
        let channelName = this.state.inputDelete.trim();
        this.socket.emit('delete-channel', {name: channelName, token: this.state.user.token});
        this.setState({inputDelete: ""});
    }

    BBcode(str) {

        if (str.includes('[B]')) {
            str = str.split('[B]').join('<b>');
        }
        if (str.includes('[/B]')) {
            str = str.split('[/B]').join('</b>');
        }
        if (str.includes('[U]')) {
            str = str.split('[U]').join('<u>');
        }
        if (str.includes('[/U]')) {
            str = str.split('[/U]').join('</u>');
        }
        if (str.includes('[S]')) {
            str = str.split('[S]').join('<s>');
        }
        if (str.includes('[/S]')) {
            str = str.split('[/S]').join('</s>');
        }
        if (str.includes('[I]')) {
            str = str.split('[I]').join('<i>');
        }
        if (str.includes('[/I]')) {
            str = str.split('[/I]').join('</i>');
        }
        if (str.includes('[LINK=<')) {
            str = str.split('[LINK=<').join('<a href="');
        }
        if (str.includes('[/LINK]')) {
            str = str.split('[/LINK]').join('</a>');
        }
        if (str.includes('[COLOR=<')) {
            str = str.split('[COLOR=<').join('<span style="color: ')
        }
        if (str.includes('[/COLOR]')) {
            str = str.split('[/COLOR]').join('</span>');
        }
        if (str.includes('>]')) {
            str = str.split('>]').join('">')
        }
        this.someHtml = str;
        return (
            <div dangerouslySetInnerHTML={{__html: this.someHtml}}></div>
        )
    }

    changeForMessage() {
        this.setState({profil: null})
    }

    displayProfil() {
        this.setState({profil: true})
    }

    sendMessage(event) {
        this.setState({message: event.target.value});
    }

    displayPartLeft() {
        if (this.state.partLeft === false) {
            document.getElementById('part_left_up').classList.add("classTest")
            this.setState({partLeft: true})
        }
        if (this.state.partLeft === true) {
            document.getElementById('part_left_up').classList.remove("classTest")
            this.setState({partLeft: false})
        }
    }

    displayPartRight() {
        if (this.state.partRight === false) {
            document.getElementById('part_right_up').classList.add("classTest")
            this.setState({partRight: true})
        }
        if (this.state.partRight === true) {
            document.getElementById('part_right_up').classList.remove("classTest")
            this.setState({partRight: false})
        }
    }

    scrollToMyRef() {
        let divMessage = document.getElementById('messages')
        let divMessagerie = document.getElementById('messagerieMain')
        let heightDiv = divMessage.clientHeight + 200
        let option = {
            left: 0,
            top: heightDiv,
            behavior: 'smooth'
        }
        divMessagerie.scrollTo(option)
    };

    render() {
        const login = localStorage.getItem('login')
        const nickname = localStorage.getItem('nickName')
        const conversation = this.state.conversation;
        var list;
        if (this.state.list === null) {
            list = []
        } else {
            list = this.state.list;
        }
        let actualChannel = ""
        if (this.state.channel) {
            actualChannel = "#" + this.state.channel.name
        }
        if (this.state.profil !== null) {
            return (
                <Fragment>
                    <div className="col-7"></div>
                    <div className="container-fluid">
                        <div className="row justify-content-end">
                            <div className="col-1 p-0 m-0 vh-100 profil_gradient d-sm-block d-none"></div>
                            <div className="profil_main text-white vh-100 col-lg-5 col-md-6 col-sm-8 col-12">
                                <h1 className="profil_title text-center">Modification de profil</h1>
                                <div className="row justify-content-center">
                                    <div className="col-12">
                                        <button className="btn btn-default p-0" onClick={this.changeForMessage}>
                                            <img src={process.env.PUBLIC_URL + '/assets/arrow_return.png'} alt=""/>
                                        </button>
                                    </div>
                                </div>
                                <Profil/>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        }
        return (
            <Fragment>
                <div className="container-fluid container_main">
                    {/* Modal */}
                    <div className="modal fade" id="joinModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content modal_style">
                                <div className="modal-header">
                                    <h5 className="modal-title title" id="staticBackdropLabel">
                                        Rejoindre un channel
                                        <img className={"img_join ms-5"} src={process.env.PUBLIC_URL + '/assets/join.png'} alt=""/>
                                    </h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <input className="form-control" type="text" placeholder="Nom du channel à rejoindre" onChange={this.changeJoinInput} id="joinInput"/>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default profil_button_denied" data-bs-dismiss="modal">Fermer</button>
                                    <button type="submit" className="btn btn-default profil_button_delete" data-bs-dismiss="modal" onClick={this.joinCommand}>Rejoindre</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="createModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content modal_style">
                                <div className="modal-header">
                                    <h5 className="modal-title title" id="staticBackdropLabel">
                                        Créer un channel
                                        <img className={"img_join ms-5"} src={process.env.PUBLIC_URL + '/assets/create.png'} alt=""/>
                                    </h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <input className="form-control" type="text" placeholder="Nom du channel à créer" onChange={this.changeCreateInput} id="createInput"/>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default profil_button_denied" data-bs-dismiss="modal">Fermer</button>
                                    <button type="submit" className="btn btn-default profil_button_delete" data-bs-dismiss="modal" onClick={this.createCommand}>Créer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="deleteModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content modal_style">
                                <div className="modal-header">
                                    <h5 className="modal-title title" id="staticBackdropLabel">
                                        Supprimer un channel
                                        <img className={"img_join ms-5"} src={process.env.PUBLIC_URL + '/assets/delete.png'} alt=""/>
                                    </h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <input className="form-control" type="text" placeholder="Nom du channel à supprimer" onChange={this.changeDeleteInput} id="deleteInput"/>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default profil_button_denied" data-bs-dismiss="modal">Fermer</button>
                                    <button type="submit" className="btn btn-default profil_button_delete" data-bs-dismiss="modal" onClick={this.deleteCommand}>Supprimer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="BBcode" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content modal_style">
                                <div className="modal-header">
                                    <h5 className="modal-title title" id="staticBackdropLabel">
                                        BBcode disponibles
                                        <img className={"img_join ms-5"} src={process.env.PUBLIC_URL + '/assets/code.png'} alt=""/>
                                    </h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="row text-end"><span className="title">Gras : </span></div>
                                            <div className="row text-end"><span className="title">Souligné : </span></div>
                                            <div className="row text-end"><span className="title">Barrer : </span></div>
                                            <div className="row text-end"><span className="title">Italique : </span></div>
                                            <div className="row text-end"><span className="title">Lien : </span></div>
                                            <div className="row text-end"><span className="title">Couleurs : </span></div>
                                        </div>
                                        <div className="col-8">
                                            <div className="row">[B] mon message [/B]</div>
                                            <div className="row">[U] mon message [/U]</div>
                                            <div className="row">[S] mon message [/S]</div>
                                            <div className="row">[I] mon message [/I]</div>
                                            <div className="row">[LINK=&lt;url.com&gt;]Renomage[/LINK]</div>
                                            <div className="row">[/COLOR=&lt;red&gt;] mon message [/COLOR]</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default profil_button_denied" data-bs-dismiss="modal">Fermer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Navbar low ViewPort */}
                    <div className="row navbar_responsive">
                        <div className="col-xl-8 col-lg-9 col-md-12">
                            <div className="row justify-content-end">
                                <div className="col-4 d-xl-none d-lg-block d-sm-block d-md-block">
                                    <div className="col-10 pt-2 title">
                                        {nickname}
                                    </div>
                                </div>
                                <div className="col-2 d-xl-none d-lg-block d-sm-block d-md-block">
                                    <button className={"btn btn-default p-0"} onClick={this.displayPartLeft}>
                                        <img className={"img_liste"} src={process.env.PUBLIC_URL + '/assets/liste.png'} alt=""/>
                                    </button>
                                </div>
                                <div className="col-2 text-light d-xl-none d-lg-block d-sm-block d-md-block">
                                    <button className={"btn btn-default p-0"} onClick={this.displayProfil}>
                                        <img className={"img_liste"} src={process.env.PUBLIC_URL + '/assets/user_modify.png'} alt=""/>
                                    </button>
                                </div>
                                <div className="col-2 d-xl-none d-lg-none d-sm-block d-md-block">
                                    <button className={"btn btn-default p-0"} onClick={this.displayPartRight}>
                                        <img className={"img_liste"} src={process.env.PUBLIC_URL + '/assets/user_connect.png'} alt=""/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Part Left */}
                    <div className="row">
                        <div className="col-2 text-center messagerieLeft d-xl-block d-none" id={"part_left_up"}>
                            <div className="row mb-4">
                                <h1 className={"dircord_main pb-0 mt-2"}>DIRCORD</h1>
                            </div>
                            <div className="row chat_list_channel ps-3 pe-2 mt-1 mb-1">
                                <hr/>
                                <div className={"title mb-3"}>Channels</div>
                                <div className="row justify-content-center mb-3">
                                    {list.map((channel, key) => {
                                        return (
                                            <div key={key} className="row">
                                                # {channel.name}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className=" row text-light fixed-bottom p-4 mb-4" id={"buttonParameter"}>
                                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 ps-0">
                                    <div className="col-11">
                                        <hr/>
                                    </div>
                                    <div className="row mb-3 justify-content-center">
                                        <button className={"btn btn-default col-3 ps-0"} data-bs-toggle="modal" data-bs-target="#joinModal">
                                            <img className={"img_join"} src={process.env.PUBLIC_URL + '/assets/join.png'} alt=""/>
                                        </button>
                                        <button className={"btn btn-default col-3 ps-0"} onClick={this.listCommand}>
                                            <img className={"img_join"} src={process.env.PUBLIC_URL + '/assets/list.png'} alt=""/>
                                        </button>
                                        <button className={"btn btn-default col-3 ps-0"} data-bs-toggle="modal" data-bs-target="#createModal">
                                            <img className={"img_join"} src={process.env.PUBLIC_URL + '/assets/create.png'} alt=""/>
                                        </button>
                                    </div>
                                    <div className="row justify-content-center">
                                        <button className={"btn btn-default col-3 ps-0"} data-bs-toggle="modal" data-bs-target="#deleteModal">
                                            <img className={"img_join"} src={process.env.PUBLIC_URL + '/assets/delete.png'} alt=""/>
                                        </button>
                                        <button className={"btn btn-default col-3 ps-0"} data-bs-toggle="modal" data-bs-target="#BBcode">
                                            <img className={"img_join"} src={process.env.PUBLIC_URL + '/assets/code.png'} alt=""/>
                                        </button>
                                    </div>
                                    <div className="col-11">
                                        <hr/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Middle Part */}
                        <div className="col-xl-8 col-lg-9 text-white messagerieMain" id="messagerieMain">
                            <div id="messages">
                                {conversation.map((message, key) => {
                                    let testBB = this.BBcode(message.message)
                                    if (message.login === login) {
                                        return (
                                            <div key={key} className="message_border p-1 row">
                                                <div className="col-1">
                                                    <span className="messagerieAuteur chat_user">{message.nickName}</span>
                                                </div>
                                                <div className="col-11">
                                                    {testBB}
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className="message_border" key={key}>
                                                <span style={{color: message.color}} className="chat_user">{message.nickName}</span>
                                                {testBB}
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                        {/* Right Part */}
                        <div className="col-xl-2 col-lg-3  text-light d-lg-block d-none" id={"part_right_up"}>
                            <div className="row justify-content-center mt-4">
                                <div className="col-10">
                                    <Flash/>
                                </div>
                            </div>
                            <div className={"title mt-1 text-center mt-2"}>Online</div>
                            <div id="users" className={"p-xl-4 p-lg-1 p-1"}>
                                <hr/>
                                {this.state.users.map((user, key) => {
                                    return <div key={key}>@ {user}</div>;
                                })}
                                <hr/>
                            </div>
                        </div>
                    </div>
                    {/* Footer part Left */}
                    <div className="row footer fixed-bottom">
                        <div className="col-2 d-xl-block d-none">
                            <div className="title row justify-content-end pe-4 mt-3">
                                <div className="col-9 pt-2 title">
                                    {nickname}
                                </div>
                                <div className="col-2 text-light d-xl-block d-lg-none ">
                                    <button className={"btn btn-default p-0"} onClick={this.displayProfil}>
                                        <img className={"img_liste"} src={process.env.PUBLIC_URL + '/assets/user_modify.png'} alt=""/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Footer Middle Part */}
                        <form onSubmit={this.handleSubmit} className="col-xl-8 col-lg-9 col-md-12">
                            <div className="row justify-content-center">
                                <div className="col-md-11 col-sm-12 col-12 mt-xl-1 mt-lg-3 mt-md-4 mt-4 pe-sm-0">
                                    <input className="form-control input_color" id="input" type="text" onChange={this.sendMessage}/>
                                </div>
                            </div>
                        </form>
                        {/* Footer Part Right */}
                        <div className="col-2 d-xl-block d-none">
                            <div className="title row justify-content-end">
                                <div className="col-10">
                                    <div className="row title">
                                        Connectée à
                                    </div>
                                    <div className="row title">
                                        {actualChannel}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Chat;
