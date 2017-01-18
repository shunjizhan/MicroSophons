var oauthToken;
var userAction;
var pickerApiLoaded;
var developerKey = 'AIzaSyBDwDS55hHxheQxjvi2ja1Fh3Wbn8Y4_80';
var CLIENT_ID = '824756862450-tiuvvkbla31oos8u5e40eph69bseo0vf.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.file'];




$('#gDrive-save').click(function(e) {
	handleAuthClick(event,'save');
});

$('#gDrive-open').click(function(e) {
	handleAuthClick(event,'open');
});

 
//SAVE AND OPEN SCRIPT

//Check if current user has authorized this application
function checkAuth() {
    gapi.auth.authorize(
    {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
    }, handleAuthResult);
}


//Handle response from authorization server
function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        loadApi();
    }
}


// Initiate auth flow in response to user clicking authorize button
function handleAuthClick(event,userClick) {
    userAction = userClick;
    gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult);
    return false;
}


// Load API library
function loadApi() {
    gapi.client.load('drive', 'v3');
    gapi.load('picker', {'callback': onPickerApiLoad});
}


function onPickerApiLoad() {
    pickerApiLoaded = true;
    if (userAction=="save") {
        userAction="";

        //document.getElementById('driveText').style.display='none';
        //document.getElementById('driveSavedPanel').style.display='block';
        createFileWithHTMLContent(filenames[current_ID], editors[current_ID].getValue());
    }
    if (userAction=="open") {
        userAction="";
        createPicker();
    }
}

// Create and render a Picker object for picking HTML file
function createPicker() {
    if (pickerApiLoaded) {
        var view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes("text/plain");
        var picker = new google.picker.PickerBuilder().
            addView(view).
            setOAuthToken(oauthToken).
            setDeveloperKey(developerKey).
            setCallback(pickerCallback).
            build();
        picker.setVisible(true);
    }
}
// Put content of file in tryit editor
function pickerCallback(data) {
    var docID = '';
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        docID = doc[google.picker.Document.ID];
        getContentOfFile(docID);
    }
}


//Get contents
function getContentOfFile(theID){


    gapi.client.request({'path': '/drive/v2/files/'+theID,'method': 'GET',callback: function ( theResponseJS, theResponseTXT ) {
        var myToken = gapi.auth.getToken();
        var myXHR   = new XMLHttpRequest();
        var fileContent='';

        //console.log(theResponseJS);
        myXHR.open('GET', theResponseJS.downloadUrl, true );
        myXHR.setRequestHeader('Authorization', 'Bearer ' + myToken.access_token );
        myXHR.onreadystatechange = function( theProgressEvent ) {
            if (myXHR.readyState == 4) {
                if ( myXHR.status == 200 ) {
                    var lang = get_type(theResponseJS.fileExtension);
                    new_tab(theResponseJS.title, myXHR.response, lang, true, -1);
                    //document.getElementById("textareaCode").innerHTML=code;
                    //window.editor.getDoc().setValue(code);
                    //submitTryit(1);
                    //resetModal();
                }
            }
        }
        myXHR.send();
        }

    });


}

function createFileWithHTMLContent(name,data,callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    const contentType = 'text/plain';


    var metadata = {
        'name': name,
        'mimeType': contentType
    };

    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n\r\n' +
        data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v3/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
            'Content-Type': 'multipart/related; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});

    if (!callback) {
        callback = function() {
            //document.getElementById("driveSavedText").innerHTML = file.name + " saved in Google Drive";
            //document.getElementById("driveSavedPanel").className = "w3-panel w3-large";
        };
    }
    request.execute(callback);
}


