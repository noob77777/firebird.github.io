UserId = "";
receiver = "undefined";

  var firebaseConfig = {
    apiKey: "AIzaSyA6wxeT-E28I87gZG2X1lKdv52X5GF2BIU",
    authDomain: "firebird-2204b.firebaseapp.com",
    databaseURL: "https://firebird-2204b.firebaseio.com",
    projectId: "firebird-2204b",
    storageBucket: "firebird-2204b.appspot.com",
    messagingSenderId: "182608640887",
    appId: "1:182608640887:web:652f17a5cd1ab4fd6bbf72"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const dbRef = firebase
    .database()
    .ref()
    .child("Root");

function live_inbox_feed(snap) {
      list = snap.val();
      const ul = document.getElementById("live_inbox");
      ul.innerHTML = "";
      for (i = Math.max(1, list.length-12); i < list.length; i++) {
        var li = document.createElement("li");
        if(list[i].receiver == receiver || list[i].sender == receiver){
          li.innerText = JSON.stringify(list[i]);
          ul.appendChild(li);
        }
      }
    }

  function selectChat() {
      const SendTag = document.getElementById("sender");
  const RTag = document.getElementById("receiver");
    receiver = this.innerHTML;
    RTag.innerHTML = receiver;

        

    dbRef
      .child(UserId)
      .child("inbox")
      .on("value", live_inbox_feed);

  }

function update_contacts(list){
  const node = document.getElementById("contacts");
  node.innerHTML = "";
  for(i = 1; i < list.length; i++){
    var li = document.createElement("li");
    var btn = document.createElement("button");
    btn.onclick = selectChat;
    btn.innerHTML = list[i];
    li.appendChild(btn);
    node.appendChild(li);
  }
}


(function() {
  // Your web app's Firebase configuration
  // var firebaseConfig = {
  //   apiKey: "AIzaSyA6wxeT-E28I87gZG2X1lKdv52X5GF2BIU",
  //   authDomain: "firebird-2204b.firebaseapp.com",
  //   databaseURL: "https://firebird-2204b.firebaseio.com",
  //   projectId: "firebird-2204b",
  //   storageBucket: "firebird-2204b.appspot.com",
  //   messagingSenderId: "182608640887",
  //   appId: "1:182608640887:web:652f17a5cd1ab4fd6bbf72"
  // };
  // // Initialize Firebase
  // firebase.initializeApp(firebaseConfig);

  // const dbRef = firebase
  //   .database()
  //   .ref()
  //   .child("Root");

  // function read(snap) {
  //   const node = document.getElementById("live_mssg");
  //   node.innerHTML = snap.val().name;
  // }

  // dbRef.on("value", read);

  const btn = document.getElementById("submit_button");
  const input = document.getElementById("user");
  const SendTag = document.getElementById("sender");
  const RTag = document.getElementById("receiver");

  INBOX = ["begin"];
  CONTACTS = ["begin"];

  function login() {
    UserId = input.value;
    const node = document.getElementById("loginmenu");
    // node.style.visibility = "hidden";
    node.innerHTML = "<h1 id='header'>Welcome to FireBird</h1>";
    SendTag.innerHTML = UserId;
    RTag.innerHTML = receiver;

    function local_reader(snap) {
      flag = snap.exists();
      if (!flag) {
        dbRef.child(UserId).set({
          inbox: INBOX,
          contacts: CONTACTS
        });
      }
      if (flag) {
        list = [];
        function local_reader(snap){
          list = snap.val();
          update_contacts(list);
        }
        dbRef.child(UserId).child("contacts").once("value", local_reader);
        
      }

      const node2 = document.getElementById("interface");
      node2.style.visibility = "visible";
    }

    IN = dbRef.child(UserId).once("value", local_reader);

    
    dbRef
      .child(UserId)
      .child("inbox")
      .on("value", live_inbox_feed);

  }
  btn.onclick = login;

  const newIdBtn = document.getElementById("newuser");
  const inputNewUser = document.getElementById("newid");



  function createNewChat() {
    var li = document.createElement("li");
    var temp = document.createElement("button");
    temp.onclick = selectChat;
    temp.innerHTML = inputNewUser.value;
    li.appendChild(temp);
    var ul = document.getElementById("contacts");
    ul.appendChild(li);

    function local_reader(snap){
      list = snap.val();
      list.push(inputNewUser.value);
      dbRef.child(UserId).child("contacts").set(list);
    }
    dbRef.child(UserId).child("contacts").once("value", local_reader);

  }

  newIdBtn.onclick = createNewChat;

  const SEND = document.getElementById("send_mssg");
  function sendMessage() {
    const text = document.getElementById("live_mssg").value;
    dbRef
      .child(UserId)
      .child(receiver)
      .set(text);

    function local_reader(snap) {
      // console.log(snap.val());
      flag = snap.exists();

      list = [];
      function update_inbox(snap) {
        list = snap.val();
        // console.log(list);
        list.push({ sender: UserId, message: text, receiver: receiver});
        // console.log(list);

        dbRef
          .child(receiver)
          .child("inbox")
          .set(list);
      }

      function update_inbox_self(snap){
              list = snap.val();
        // console.log(list);
        list.push({ sender: UserId, message: text, receiver: receiver});
        // console.log(list);

        dbRef
          .child(UserId)
          .child("inbox")
          .set(list);
      }

      if (flag) {
        console.log("OK");
        dbRef
          .child(receiver)
          .child("inbox")
          .once("value", update_inbox);

        dbRef.child(UserId)
        .child("inbox")
        .once("value", update_inbox_self);  
      }
    }

    IN = dbRef.child(receiver).once("value", local_reader);

    document.getElementById("live_mssg").value = "";
  }
  SEND.onclick = sendMessage;
})();
