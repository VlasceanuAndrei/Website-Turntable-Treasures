window.addEventListener("DOMContentLoaded", function(){
    if(localStorage.getItem("tema")){ // functionalitatea de mentinere a temei intre pagini
        document.body.classList.add("dark");
        document.getElementById("switch-tema").checked = true;
    }

    this.document.getElementById("switch-tema").onchange = function(){
        exista_tema = document.body.classList.toggle("dark")
        if(exista_tema){
            localStorage.setItem("tema", "dark")
        }
        else{
            localStorage.removeItem("tema")
        }
    }
})