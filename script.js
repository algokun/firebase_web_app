// Author : MOhan
// Date : 3 May 2019
// This Script is taken reference from Firebase Official Docs 
// Here is the link : https://firebase.google.com/docs/web/setup


// Firebase Init

var config = {
    //Your Configuration goes here
};

firebase.initializeApp(config);

var db = firebase.firestore();

var email,password;
var signup_btn;
var download = "";
var arr = [];

// Getting Required Objects

signup_signup_btn = document.getElementById("signup_signup");
signup_login_btn = document.getElementById("signup_login");
login_signup_btn = document.getElementById("login_signup");
login_login_btn = document.getElementById("login_login");
var one = document.getElementById("item1");
var two = document.getElementById("item2");
var three = document.getElementById("item3");
var okay_btn = document.getElementById("okay_btn");
var choose = document.getElementById("choose");

okay_btn.style.cursor = "not-allowed";
okay_btn.disabled = true;

// Signup Button Event
signup_signup_btn.addEventListener(
    'click',
    function(e){
        email = document.getElementById("signup_email").value;
        var pass1 = document.getElementById("signup_pass1").value;
        var pass2 = document.getElementById("signup_pass2").value;

        if(email.length == 0){
            window.alert("Check the details and try agian");
        }
        else if(pass1 != pass2){
            window.alert("Passwords not matched");
        }
        else if(pass1.length < 10){
            window.alert("Password length should be 10 characters minimum");
        }
        else{
            firebaseSignup(email , pass1);
        }
    }
);

//Loginpage redirect Event

signup_login_btn.addEventListener(
    'click',
    function(e){
        one.style.position = "relative";
        three.style.position = "absolute";
        three.style.top = 0;
    }
);

//Signup page Redirect Event

login_signup_btn.addEventListener(
    'click',
    function(e){
        one.style.position = "absolute";
        three.style.position = "relative";
        three.style.top = -10;
    }
);

// Login Button Event

login_login_btn.addEventListener(
    'click',
    function(e){
        var email_login = document.getElementById("login_email").value;
        var pass_login = document.getElementById("login_pass").value;

        if(email_login.length == 0 || pass_login.length == 0){
            window.alert("Check the details and try agian");
        }
        else{
            firebaseLogin(email_login , pass_login);
        }
    }
);

//Firebase Login Script

function firebaseLogin(email , password){
    const auth = firebase.auth();

    auth.signInWithEmailAndPassword(email, password)
    .then(function(user) {
        window.location.href = "homepage.html";
        console.log(user)
        }, function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert(errorMessage);
        });
}

// Firebase Signup Event

function firebaseSignup(email , password){
    const auth = firebase.auth();

    auth.createUserWithEmailAndPassword(email, password)
    .then(function(user) {
        two.style.left = 0;            
        }, function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(errorCode+"   "+errorMessage);
        });
}

// User Profile Picture Upload Script

function readURL(input) {
    var file;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            file = e.target.result;
            $('#avatar')
                .attr('src', file)
                .width(150)
                .height(200);
        };

        reader.readAsDataURL(input.files[0]);

        var user = firebase.auth().currentUser;
        var uid = user.uid;
        var storage_ref = firebase.storage().ref('profile_images/'+uid+'/'+makeid(6)+'.png');
        
        var task = storage_ref.put(input.files[0]);

        task.on(
            'state_changed',
            
            function progress(snapshot){
                
            },

            function error(err){

            },
        
            function complete() {
                    task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        arr.push(downloadURL);
                        console.log(arr);
                        okay_btn.disabled = false;
                        okay_btn.style.cursor = "pointer";
                    });
                }    
        );
    }
}

// User Profile Update Script

okay_btn.addEventListener(
    'click',
    function(e){
        var usr_name = document.getElementById("name").value;                         
        var phone = document.getElementById("phone").value;                         
        uploadUserDatatoFirebase(arr[0] , usr_name , phone);
    }
);

// Store User Data to Firebase > "Users" Collection

function uploadUserDatatoFirebase(downloadUrl , name , phone){
    var user = firebase.auth().currentUser;
    var uid = user.uid;
    console.log(uid);
    firebase.firestore().collection("users").doc(uid).set(
        {
            name : name,
            profimg : downloadUrl,
            phone : phone,
        })
        .then(function() {
            console.log("Document successfully written!");
            window.location.href = "homepage.html";
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
}

// Random String Generator from Stack Over Flow

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

