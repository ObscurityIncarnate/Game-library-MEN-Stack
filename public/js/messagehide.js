const clearButton = document.querySelector(".clearMessage");
const divElem = document.querySelector(".message");
const errorMessage = document.querySelector(".error");
if(clearButton){
    clearButton.addEventListener("click", ()=>{
        divElem.style.visibility =  "hidden";
        errorMessage.style.visibility = "hidden";
    })
}
    