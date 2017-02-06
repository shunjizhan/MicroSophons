var address;

$('#inputClick').click(function() {
    address = $('#linkInput').val();  
    
    alert(address);
    window.open(address);
});
socket.join(address);


//var Globals = {
//    'domain': address;
//}
//
//module.exports = Globals;