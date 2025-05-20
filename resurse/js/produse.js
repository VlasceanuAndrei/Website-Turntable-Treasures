window.onload = function(){
    let produseInitiale = Array.from(document.getElementsByClassName("produs"));
    btn = document.getElementById("filtrare");
    btn.onclick = function(){
        const regex = /[^a-zA-Z0-9\s$]/;
        let btnInputNume = document.getElementById("inp-nume");
        let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase();
        if(inpNume && regex.test(inpNume)){
            alert("Numele nu poate contine caractere speciale!");
            btnInputNume.style.border = "2px solid red";
            btnInputNume.value = "";
            return;
        }

        let vectRadio = document.getElementsByName("gr_rad");

        let inpDurata = null;
        let minDurata = null;
        let maxDurata = null;
        for (let rad of vectRadio){
            if (rad.checked){
                inpDurata = rad.value;
                if (inpDurata != "toate"){
                    [minDurata, maxDurata] = inpDurata.split(":");
                    minDurata = parseInt(minDurata);
                    maxDurata = parseInt(maxDurata);
                }
                break;
            }
        }

        let inpPret = document.getElementById("inp-pret").value;

        let inpGen = document.getElementById("inp-gen").value.trim();
        if(inpGen == "") {
            inpGen = "toate";
        }
        
        let checkTags = document.getElementsByName("tags");
        let taguri = [];
        for (let cb of checkTags){
            if(cb.checked) {
                taguri.push(cb.value);
            }
        }
        
        let btnInputDescriere = document.getElementById("inp-descriere");
        let inpDescriere = document.getElementById("inp-descriere").value.trim().toLowerCase();
        if(inpDescriere && regex.test(inpDescriere)){
            alert("Descrierea nu poate contine caractere speciale!");
            btnInputDescriere.classList.add("is-invalid");
            btnInputDescriere.value = "";
            return;
        } else {
            btnInputDescriere.classList.remove("is-invalid");
        }
        let cuvinteDescriere = [];
        if(inpDescriere) {
            cuvinteDescriere = inpDescriere.split(",").map(cuv => cuv.trim()).filter(cuv => cuv.length > 0);
        }
        
        let inpBestseller = document.getElementById("inp-bestseller").value;
        
        let inpCulori = document.getElementById("inp-culori");
        let culoriSelectate = [];
        for(let opt of inpCulori.options) {
            if(opt.selected) {
                culoriSelectate.push(opt.value);
            }
        }
        if(culoriSelectate.length == 0)
            culoriSelectate.push("toate");

        let produse = document.getElementsByClassName("produs");
        let contorProduse = 0;
        for (let prod of produse){
            prod.style.display = "none";
            
            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let cond1 = nume.startsWith(inpNume);

            let nrPiese = 0;
            let elemNrPiese = prod.getElementsByClassName("val-nr-piese")[0];
            if(elemNrPiese) {
                nrPiese = parseInt(elemNrPiese.getAttribute("content"));
            }
            
            let cond2 = (inpDurata == "toate" || (minDurata <= nrPiese && nrPiese < maxDurata));

            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
            let cond3 = (inpPret <= pret);

            let categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
            let cond4 = (inpGen == "toate" || inpGen.toLowerCase() == categorie);
            
            let tagsText = prod.getElementsByClassName("val-taguri")[0].innerHTML.trim();
            let prodTags = tagsText.replace(/[{}"]/, '').split(',').map(tag => tag.trim());
            
            let cond5 = true;
            if(taguri.length > 0) {
                cond5 = taguri.some(tag => prodTags.includes(tag));
            }
            
            let descriere = prod.getElementsByClassName("val-descriere")[0].innerHTML.trim().toLowerCase();
            let cond6 = true;
            if(cuvinteDescriere.length > 0) {
                cond6 = cuvinteDescriere.some(cuv => descriere.includes(cuv));
            }
            
            let bestseller = prod.getElementsByClassName("val-bestseller")[0].innerHTML.trim();
            let cond7 = (inpBestseller == "FALSE" || (inpBestseller == "TRUE" && bestseller == "Da"));
            
            let culoare = prod.getElementsByClassName("val-culoare")[0].innerHTML.trim();
            let cond8 = culoriSelectate.includes(culoare) || culoriSelectate.includes("toate");

            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8) {
                prod.style.display = "block";
                btnInputNume.style.border = "1px solid black";
                btnInputDescriere.style.border = "1px solid black";
                contorProduse++;
            }
        }
        if(!contorProduse){
            document.getElementById("fara-produse").style.display = "block";
        }
        else {
            document.getElementById("fara-produse").style.display = "none";
        }
        marcProduseIeftine();
    }

    document.getElementById("inp-pret").onchange = function(){
        document.getElementById("infoRange").innerHTML = `(${this.value})`;
    }

    document.getElementById("resetare").onclick = function(){
        let textAlert= "Sunteti sigur ca doriti sa resetati filtrele?";
        if(confirm(textAlert)){
            document.getElementById("inp-nume").value = "";
            

            document.getElementById("i_rad1").checked = false;
            document.getElementById("i_rad2").checked = false;
            document.getElementById("i_rad3").checked = false;
            document.getElementById("i_rad4").checked = true;
            
            let inpPret = document.getElementById("inp-pret");
            inpPret.value = inpPret.min;
            document.getElementById("infoRange").innerHTML = `(${inpPret.min})`;
            
            document.getElementById("inp-gen").value = "";
            
            let checkTags = document.getElementsByName("tags");
            for(let cb of checkTags) {
                cb.checked = true;
            }
            
            document.getElementById("inp-descriere").value = "";
            document.getElementById("inp-descriere").classList.remove("is-invalid");
            
            document.getElementById("inp-bestseller").value = "FALSE";
            
            let inpCulori = document.getElementById("inp-culori");
            for(let opt of inpCulori.options) {
                opt.selected = false;
            }
    
            let produse = document.getElementsByClassName("produs");
            for (let prod of produse){
                prod.style.display = "block";
            }
            
            for (let prod of produseInitiale){
                prod.parentNode.appendChild(prod);
            }
            
            document.getElementById("fara-produse").style.display = "none";
            marcProduseIeftine();
        }
    }
    
    document.getElementById("sortCrescNume").onclick = function(){
        sorteaza(1);
    }
    
    document.getElementById("sortDescrescNume").onclick = function(){
        sorteaza(-1);
    }

    function sorteaza(semn){
        let produse = document.getElementsByClassName("produs");
        let vProduse = Array.from(produse);
        vProduse.sort(function(a, b){ 
            let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim());
            let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim());
            if (pretA != pretB){
                return semn * (pretA - pretB);
            }
            
            let numeA = a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let numeB = b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            return semn * numeA.localeCompare(numeB);
        });
        
        for (let prod of vProduse){
            prod.parentNode.appendChild(prod);
        }
    }

    window.onkeydown = function(e){
        console.log(e);
        if (e.key == "q" && e.ctrlKey){
            let produse = document.getElementsByClassName("produs");
            sumaPreturi = 0;
            let numarProduse = 0;
            
            for (let prod of produse){
                if(prod.style.display != "none"){
                    let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
                    sumaPreturi += pret;
                    numarProduse++;
                }
            }
            
            if(!document.getElementById("suma_preturi")){
                let pRezultat = document.createElement("p");
                pRezultat.innerHTML = `Suma prețurilor pentru cele ${numarProduse} albume afișate este: ${sumaPreturi.toFixed(2)} RON`;
                pRezultat.id = "suma_preturi";
                let p = document.getElementById("p-suma");
                p.parentNode.insertBefore(pRezultat, p.nextElementSibling);
                
                setTimeout(function(){
                    let p1 = document.getElementById("suma_preturi");
                    if(p1){
                        p1.remove();
                    }
                }, 2000);
            }
        }
    }


    function marcProduseIeftine() {
        const existingMarkers = document.getElementsByClassName("cheapest-marker");
        while (existingMarkers.length > 0) {
            existingMarkers[0].remove();
        }

        const produse = document.getElementsByClassName("produs");
        
        const categorii = {};
        
        for (let prod of produse) {
            if (prod.style.display === "none") continue;
            const categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim();
            const pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
            if (!categorii[categorie] || pret < categorii[categorie].pret) {
                categorii[categorie] = {
                    produs: prod,
                    pret: pret
                };
            }
        }
        
        for (let categorie in categorii) {
            const prodIeftine = categorii[categorie].produs;
            const marker = document.createElement("div");
            marker.className = "cheapest-marker";
            marker.innerHTML = "CEL MAI IEFTIN PRODUS<br>DIN CATEGORIA SA!";
            
            prodIeftine.appendChild(marker);
        }
    }
    marcProduseIeftine();
}