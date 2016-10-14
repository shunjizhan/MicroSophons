function do_things()
{  


    var box = document.getElementById('typey_box');//built in function
    var results_box = document.getElementById('output');
    var text = box.value; //built in function
    var message = "The length is " + text.length; // similar to python
    results_box.innerHTML = message;


}