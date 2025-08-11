
/*
* Goes to the last open website if there was a previous one. 
*/
function goBack(){
    if(navigation.canGoBack) {
        history.back();
    }
}