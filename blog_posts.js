// Author : MOhan
// Date : 3 May 2019
// This Script is taken reference from Firebase Official Docs 
// Here is the link : https://firebase.google.com/docs/web/setup

var config = {
    //Your Configuration goes here
};

firebase.initializeApp(config);

var db = firebase.firestore();
var uid = "";
var okay_btn = document.getElementById("save");

var arr = [];

function readURL(input) {
    okay_btn.disabled = true;
    okay_btn.style.cursor = "not-allowed";
    
    var file;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            file = e.target.result;
            $('#desc_img')
                .attr('src', file)
                .width(150)
                .height(200);
        };

        reader.readAsDataURL(input.files[0]);

        var user = firebase.auth().currentUser;
        uid = user.uid;
        var storage_ref = firebase.storage().ref('posts/'+makeid(8)+'.png');
        
        var task = storage_ref.put(input.files[0]);

        task.on(
            'state_changed',
            
            function progress(snapshot){
                
            },

            function error(err){

            },
        
            function complete() {
                    task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        arr.splice( 0, 0, downloadURL );
                        console.log(arr);
                        okay_btn.disabled = false;
                        okay_btn.style.cursor = "pointer";
                    });
                }    
        );
    }
}

okay_btn.addEventListener(
    'click',
    function(e){
        $('#exampleModal').modal('hide');
        var desc_data = document.getElementById("exampleFormControlTextarea1").value;
        console.log(desc_data);
        addPostToDatabase(arr[0] , desc_data);
    }
);

function addPostToDatabase(downloadUrl , desc){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    db.collection("posts").add({
            desc: desc,
            img : downloadUrl,
            uid : uid,
            time : dateTime
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
}


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function getUserProfilePic(){
    
    var user = firebase.auth().currentUser;
    uid = user.uid;
    
    var docRef = db.collection("users").doc(uid);

    docRef.get().then(
        function(doc) {
        if (doc.exists) {
            var data = doc.data();
            console.log("Document data:", data);
            document.getElementById("user_profile").src = data.profimg;
            document.getElementById("username_display").innerHTML = data.name;

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

}

setTimeout(function(){
    getUserProfilePic();
    getPosts();
  }, 1000)

const main_list = document.querySelector("#main_list");

function getPosts(){
    db.collection("posts").orderBy("time").onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                db.collection("users").doc(change.doc.data().uid).get().then(
                    function(snap){
                        main_list.innerHTML += "<div class='col-lg-4'> <div class='card' style='width: 20rem;' id='main_card'> <div class='image_container_card'> <img src="+ change.doc.data().img + " class='card-img-top' > </div> <div class='card-body'> <h5> "+snap.data().name+"</h5> <p class='card-text'> "+change.doc.data().desc+"</p> </div> </div> </div>";   
                    }
                );
            }
        });
    });
}

var inputfile= $('#uploadFile')
$('#save').on('click',function(){
    inputfile.replaceWith(inputfile.val('').clone(true));
})


document.getElementById("drop_down_btn").addEventListener(
    'click',
    function(e){
        firebase.auth().signOut().then(function() {
            window.location.href = "index.html";
          }, function(error) {
            // An error happened.
          });
    }
);