To host the server: <br/>
Set environment variables by running **each line** of readdddddd.sh in the terminal.<br/>
(Unfortunately, the current credential may be invalid. We are trying to switch to a new service.)<br/>
And then run node index<br>

Major work is put in html and javascript code files in js folder<br/>
**Webpage**<br/>
index.html - entry page<br/>
indexx.html - main page<br/> 
**Server side**<br/>
index.js - server setup: host socket.io session and interactions (receive and send); express.js routing; Microsoft Azure Storage interactions;<br/>
**Client side**<br/>
load_socket.js - loading socket.io and deal with user infomation and chatting messages<br/>
create_Monaco.js - core functions (everything about the editor)<br/>
gdrive.js - Google drive interactions<br/>
route.js - routing functions<br/>
themes.js - changing themes<br/>
left-bar.js - left-bar interactions<br/>
ping.js - socket.io latency measurement and dealing with disconnection<br/>
(socket.js) - a local version of socket.io in case it the online version is inaccessible<br/>