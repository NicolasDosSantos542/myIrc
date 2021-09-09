// // eslint-disable-next-line no-unused-vars
// import './chat.css';
// import io from 'socket.io-client';
// import React, {Component, Fragment} from "react";
// import Profil from "../Users/Profil/profil"
// import Flash from "../Flash/flash"
//
// class Chat extends Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             message: "",
//             conversation: [],
//             user: "",
//             users: [],
//             partLeft: false,
//             partRight: false,
//             profil: null,
//             changeNickname: null
//         }
//         this.state.nickName = localStorage.getItem('nickName');
//         this.handleSubmit = this.handleSubmit.bind(this);
//         this.sendMessage = this.sendMessage.bind(this);
//         this.displayPartLeft = this.displayPartLeft.bind(this);
//         this.displayPartRight = this.displayPartRight.bind(this);
//         this.displayProfil = this.displayProfil.bind(this);
//         this.changeForMessage = this.changeForMessage.bind(this);
//     }
//
//     componentDidMount() {
//         this.socket.on("chat-message", (message) => {
//             this.setState(prevState => ({
//                 conversation: [...prevState.conversation, message]
//             }))
//         });
//         this.socket.on("users-list", (data) => {
//             if (JSON.stringify(this.state.users) === JSON.stringify(data)) {
//                 return null
//             } else {
//                 let joined = this.state.users.concat(data);
//                 this.setState({
//                     users: joined
//                 })
//                 console.log(this.state.users)
//             }
//         })
//         this.socket.on('user-disconnect', (user) => {
//             this.state.users.filter(element => element !== user)
//             console.log(user, "leave the channel")
//             // console.log(this.state.users)
//         })
//     }
//
//     componentWillMount() {
//         this.socket = io('localhost:4242/');
//         this.socket.emit("user-login", this.state.nickName)
//         this.socket.emit('users-list', this.state.users)
//     }
//
//     handleSubmit(e) {
//         e.preventDefault();
//         const input = document.getElementById("input")
//         input.value = ''; // On vide le champ texte
//
//         if (this.state.message.trim().length !== 0) { // Gestion message vide
//             if (this.state.message.startsWith('/nick')) {
//                 this.changeNickname(this.state.message.substr(5))
//             } else {
//                 this.socket.emit('chat-message', {
//                         message: this.state.message,
//                         nickName: this.state.nickName,
//                         token: localStorage.getItem('token'),
//                         login: localStorage.getItem('login')
//                     }
//                 );
//                 this.setState(prevState => ({
//                     conversation: [...prevState.conversation, {
//                         message: this.state.message,
//                         nickName: this.state.nickName,
//                         token: localStorage.getItem('token'),
//                         login: localStorage.getItem('login')
//                     }]
//
//                 }))
//                 console.log("own message", this.state.message)
//             }
//         }
//         input.focus(); // Focus sur le champ du message
//     }
//
//     changeNickname(nickName) {
//         const newNickName = nickName.trim()
//         if (newNickName.length > 2 && newNickName.length < 9) {
//             const token = localStorage.getItem('token')
//             const url = "http://localhost:4242/auth/nickName";
//             const option = {
//                 method: 'PUT',
//                 headers: {
//                     "content-type": "application/json",
//                     "Authorization": "Bearer " + token
//                 },
//                 body: JSON.stringify({
//                     nickName: newNickName
//                 })
//             };
//             fetch(url, option)
//                 .then(res => res.json())
//                 .then(data => {
//                     if (!data.success) {
//                         window.flash('', "Votre pseudo n'a pas été modifié", "danger");
//                     } else {
//                         this.socket.emit('change-nickname', [localStorage.getItem('nickName'), data.nickName]);
//                         let pos = this.state.users.indexOf(localStorage.getItem('nickName'));
//                         let replaceNickName = this.state.users.splice(pos, 1, data.nickName);
//                         this.setState({nickName: replaceNickName});
//                         localStorage.setItem('nickName', data.nickName);
//                         window.flash('', "Votre pseudo a bien été modifié", "success");
//                     }
//                 })
//         } else document.getElementById('messages').innerHTML = "<div class='chat_error'>Votre pseudo doit contenir entre 2 et 9 caractères</div>"
//
//     }
//
//     changeForMessage() {
//         this.setState({profil: null})
//     }
//
//     displayProfil() {
//         this.setState({profil: true})
//     }
//
//     sendMessage(event) {
//         this.setState({message: event.target.value});
//     }
//
//     displayPartLeft() {
//         if (this.state.partLeft === false) {
//             document.getElementById('part_left_up').classList.add("classTest")
//             this.setState({partLeft: true})
//         }
//         if (this.state.partLeft === true) {
//             document.getElementById('part_left_up').classList.remove("classTest")
//             this.setState({partLeft: false})
//         }
//     }
//
//     displayPartRight() {
//         if (this.state.partRight === false) {
//             document.getElementById('part_right_up').classList.add("classTest")
//             this.setState({partRight: true})
//         }
//         if (this.state.partRight === true) {
//             document.getElementById('part_right_up').classList.remove("classTest")
//             this.setState({partRight: false})
//         }
//     }
//
//     render() {
//         const login = localStorage.getItem('login')
//         const nickname = localStorage.getItem('nickName')
//         const conversation = this.state.conversation;
//         if (this.state.profil !== null) {
//             return (
//                 <Fragment>
//                     <div className="col-7"></div>
//                     <div className="container-fluid">
//                         <div className="row justify-content-end">
//                             <div className="col-1 p-0 m-0 vh-100 profil_gradient d-sm-block d-none"></div>
//                             <div className="profil_main text-white vh-100 col-lg-5 col-md-6 col-sm-8 col-12">
//                                 <h1 className="profil_title text-center">Modification de profil</h1>
//                                 <div className="row justify-content-center">
//                                     <div className="col-12">
//                                         <button className="btn btn-default p-0" onClick={this.changeForMessage}>
//                                             <img src={process.env.PUBLIC_URL + '/assets/arrow_return.png'} alt=""/>
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <Profil/>
//                             </div>
//                         </div>
//                     </div>
//                 </Fragment>
//             )
//         }
//         return (
//             <div className="container-fluid container_main">
//                 <div className="row navbar_responsive">
//                     <div className="col-xl-8 col-lg-9 col-md-12">
//                         <div className="row justify-content-end">
//                             <div className="col-4 d-xl-none d-lg-block d-sm-block d-md-block">
//                                 <div className="col-10 pt-2 title">
//                                     {nickname}
//                                 </div>
//                             </div>
//                             <div className="col-2 d-xl-none d-lg-block d-sm-block d-md-block">
//                                 <button className={"btn btn-default p-0"} onClick={this.displayPartLeft}>
//                                     <img className={"img_liste"} src={process.env.PUBLIC_URL + '/assets/liste.png'}
//                                          alt=""/>
//                                 </button>
//                             </div>
//                             <div className="col-2 text-light d-xl-none d-lg-block d-sm-block d-md-block">
//                                 <button className={"btn btn-default p-0"} onClick={this.displayProfil}>
//                                     <img className={"img_liste"}
//                                          src={process.env.PUBLIC_URL + '/assets/user_modify.png'}
//                                          alt=""/>
//                                 </button>
//                             </div>
//                             <div className="col-2 d-xl-none d-lg-none d-sm-block d-md-block">
//                                 <button className={"btn btn-default p-0"} onClick={this.displayPartRight}>
//                                     <img className={"img_liste"}
//                                          src={process.env.PUBLIC_URL + '/assets/user_connect.png'} alt=""/>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-2 text-center messagerieLeft d-xl-block d-none" id={"part_left_up"}>
//                         <div className="row">
//                             <h1 className={"dircord_main pb-0"}>DIRCORD</h1>
//                             <div className={"title mt-3"}>Mes channels</div>
//                         </div>
//                     </div>
//                     <div className="col-xl-8 col-lg-9 text-white messagerieMain">
//                         <div id="messages">
//                             <Flash/>
//                             {conversation.map((message, key) => {
//                                 if (message.login === login) {
//                                     return (
//                                         <div key={key}>
//                                             <span className="messagerieAuteur">{message.nickName}</span> : {message.message}
//                                         </div>);
//                                 } else {
//                                     return (
//                                         <div key={key}>
//                                             <span className="messagerieAutre">{message.nickName}</span> : {message.message}
//                                         </div>
//                                     )
//                                 }
//
//                             })}
//                         </div>
//                     </div>
//                     <div className="col-xl-2 col-lg-2  text-light d-lg-block d-none" id={"part_right_up"}>
//                         <div className={"title mt-3 text-center mb-2 mt-2"}>Participant</div>
//                         <div id="users" className={"p-4"}>
//                             {this.state.users.map((user, number) => {
//                                 return <div key={number}>{user}</div>;
//                             })}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="row footer fixed-bottom">
//                     <div className="col-2 d-xl-block d-none">
//                         <div className="title row justify-content-end pe-4 mt-3">
//                             <div className="col-10 pt-2">
//                                 {nickname}
//                             </div>
//                             <div className="col-1 text-light d-xl-block d-lg-none ">
//                                 <button className={"btn btn-default p-0"} onClick={this.displayProfil}>
//                                     <img
//                                         className={"img_liste"} src={process.env.PUBLIC_URL + '/assets/user_modify.png'}
//                                         alt=""/>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                     <form onSubmit={this.handleSubmit} className="col-xl-8 col-lg-9 col-md-12">
//                         <div className="row justify-content-center">
//                             <div className="col-md-11 col-sm-10 col-10 mt-3 mt-lg-4 pe-sm-0">
//                                 <input className="form-control input_color" id="input" rows="1" type="text"
//                                        onChange={this.sendMessage}/>
//                             </div>
//                             <div
//                                 className="col-md-1 col-sm-2 col-2 col-1 mt-2 mt-lg-3 p-lg-0 p-md-0 pt-md-2 p-sm-0 pt-sm-2 ps-sm-4 p-0 pt-2 ps-2">
//                                 <button className="btn btn-default">
//                                     <img
//                                         className={"img_liste"} src={process.env.PUBLIC_URL + '/assets/send.png'}
//                                         alt=""/>
//                                 </button>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         );
//     }
//
// }
//
// // export default Chat;
//
//
//
//
