
/*
* Goes to the last open website if there was a previous one. 
*/
function goBack(){
    if(navigation.canGoBack) { // Checks whether the navigation has a previous page to return to
        history.back(); // Reopen the last window
    }
}