var address;

$('#inputClick').click(function() {
    address = $('#linkInput').val();  
    if (address == ''){
        alert("Please Enter a Non-empty Name!");
        event.preventDefault();
    }
    else{
        alert(address);
        window.open(address);  
    }
});

$('#searchClick').click(function() {
    alert("We cannot find your project!");
    event.preventDefault();
});

//var Globals = {
//    'domain': address;
//}
//
//module.exports = Globals;