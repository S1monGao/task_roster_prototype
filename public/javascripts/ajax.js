function get_tasks (){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var gtasks = JSON.parse(xhttp.responseText);
            var gdones=[],gtodos=[];
            for (task of gtasks)
            {
                if(task.status==1)
                    gdones.push(task);
                else
                    gtodos.push(task);
            }
            vueinst.tasks=gtodos;
            vueinst.dones=gdones;
        }
    };

    xhttp.open("GET", "/tasks.json", true);

    xhttp.send();
}

function get_members(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            vueinst._data.members=JSON.parse(this.responseText);
        }
    };

    xhttp.open("GET", "/members.json", true);

    xhttp.send();
}

function get_profile(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            vueinst._data.profile=JSON.parse(this.responseText);
        }
    };

    xhttp.open("GET", "profile.json", true);

    xhttp.send();
}



function getUsername() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            vueinst._data.username = xhttp.responseText;
        }
    };
    xhttp.open("GET", "/users/username", true);
    xhttp.send();
}

function getUserInfo(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var userInfo = JSON.parse(xhttp.responseText);
            vueinst._data.ismanager=userInfo.ismanager;
            vueinst._data.isthisuser=userInfo.isthisuser;
            vueinst._data.isloggedin=userInfo.isloggedin;
        }
    };
    xhttp.open("GET", "/getuserinfo", true);
    xhttp.send();
}