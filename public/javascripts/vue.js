var vueinst = new Vue({
    el: '#vuemain',
    data:{
        username:'',
        lemail:'',
        lpwd:'',
        rname:'',
        rpwd:'',
        remail:'',
        rismanager:0,
        /* toggle if this user is a manager or is this user viewing its own profile*/
        ismanager:0,
        isthisuser:0,
        isloggedin:0,
        members:{marr:["Alex","Jone","Sarah","Tifa"]},
        tasks:[],
        dones:[],
        groups:[{name:"test group",arr:[
                    {id:15,title:"test15",note:"this is a test."},
                    {id:16,title:"test16",note:"this is another test."},
                    {id:17,title:"test17",note:"this is a test."},
                    {id:18,title:"test18",note:"this is another test."},
                ]
            },{name:"test group2",arr:[
                    {id:7,title:"test5",note:"this is a test."},
                    {id:8,title:"test6",note:"this is another test."},
                    {id:9,title:"test7",note:"this is a test."},
                    {id:10,title:"test8",note:"this is another test."}
                ]
            },
        ],
        targettask:null,
        profile:{id:"",name:"",age:"",gender:"",company:"",capability:"",avail_from:'',avail_to:''},
        getUsername: function() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                vueinst.username = xhttp.responseText;
            }
        };
        xhttp.open("GET", "/users/username", true);
        xhttp.send();
        },

        login: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.getUsername();
                    vueinst.ismanager=xhttp.responseText;
                    alert("You are logged in.");
                    window.location.href = '/index.html';

                } else if (this.readyState == 4 && this.status == 401) {
                    alert("Login Fail.");
                }
            };
            xhttp.open("POST", "/login", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ email: this.lemail, pwd: this.lpwd }));
        },
        register: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    alert("Successfully registered. You need to log in.");
                    window.location.href = '/index.html';
                }
            };
            xhttp.open("POST", "/register", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ user: this.rname, pwd: this.rpwd , email:this.remail , ismanager:this.rismanager }));

        },
        logout: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    alert("You've logged out.");
                    window.location.href = '/index.html';
                }
            };
            xhttp.open("POST", "/logout", true);
            xhttp.send();
        },
        del_task:function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    window.location.href = '/index.html';
                }
            };
            xhttp.open("POST", "/users/deletetask", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ id:this.targettask.id}));
        },
        view_profile:function (uid){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.profile=JSON.parse(this.responseText);
                    window.location.href = '/profile.html';
                }
        };

    xhttp.open("GET", "profile.json?uid="+encodeURIComponent(uid), true);

    xhttp.send();
}




    },
    computed:{
        bla:function(){
            if(this.ismanager)
                return "Edit";
            else
                return "View";
        },
        getdataskttl:function(){
            var t =  this.targettask;
            if (t !== null)
                return t.title;
            else
                return null;
        },
        getdatasknote:function(){
            var t =  this.targettask;
            if (t !== null && t.note !== undefined)
                return t.note;
            else
                return null;
        },
        getdataskddl:function(){
            var t =  this.targettask;
            if (t !== null && t.deadline !== undefined)
                return t.deadline;
            else
                return null;
        },
        getdataskstatus:function(){
            var t =  this.targettask;
            if (t !== null && t.status !== undefined)
                return t.status;
            else
                return null;
        },
        t_id_form:function(){
            var t =  this.targettask;
            if (t !== null)
                return t.id;
            else
                return null;
        }
    }
});

// Get the modal
var modals = document.getElementsByClassName('modal');

// When the user clicks anywhere outside of the modal, close it

window.onclick = function(event) {
    for (modal of modals){
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
};


