document.addEventListener("DOMContentLoaded", function() {
    actualizeazaPeToatePaginile();
    adaugaEventListeners();
});

function actualizeazaPeToatePaginile() {
    const container = document.getElementById("container-comparare");
    if (container) {
        actualizeazaUI();
    }
}

function adaugaEventListeners() {
    document.querySelectorAll(".select-produs").forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            const id = this.value;
            let nume = "";
            
            if (this.closest("#art-produs")) {
                nume = document.querySelector(".val-nume") ? 
                       document.querySelector(".val-nume").textContent : 
                       document.querySelector(".nume").textContent;
            } else {
                const produs = this.closest(".produs");
                nume = produs.querySelector(".val-nume").textContent;
            }
            
            if (this.checked) {
                adaugaLaComparare(id, nume);
            } else {
                eliminaDinComparare(id);
            }
        });
    });
}

function adaugaLaComparare(id, nume) {
    let produse = getProduse();
    if (!produse.some(p => p.id === id)) {
        if (produse.length < 2) {
            produse.push({ id: id, nume: nume });
            localStorage.setItem("produseComparare", JSON.stringify({
                produse: produse,
                data: new Date().getTime()
            }));
            actualizeazaUI();
        } else {
            const checkbox = document.querySelector(`.select-produs[value="${id}"]`);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
    }
}

function eliminaDinComparare(id) {
    let produse = getProduse();
    produse = produse.filter(p => p.id !== id);
    
    localStorage.setItem("produseComparare", JSON.stringify({
        produse: produse,
        data: new Date().getTime()
    }));
    actualizeazaUI();
}

function getProduse() {
    const storage = localStorage.getItem("produseComparare");
    if (!storage) return [];
    const data = JSON.parse(storage);
    const zi = 24 * 60 * 60 * 1000;
    if (new Date().getTime() - data.data > zi) {
        localStorage.removeItem("produseComparare");
        return [];
    }
    
    return data.produse || [];
}

function actualizeazaUI() {
    const container = document.getElementById("container-comparare");
    const lista = document.getElementById("lista-comparare");
    const produse = getProduse();
    
    gestioneazaStareCheckboxuri(produse);
    if (produse.length === 0) {
        container.style.display = "none";
        return;
    }
    
    container.style.display = "block";
    lista.innerHTML = "";
    produse.forEach((produs) => {
        const item = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = produs.nume;
        item.appendChild(span);
        const buton = document.createElement("button");
        buton.textContent = "×";
        buton.addEventListener("click", function() {
            const checkbox = document.querySelector(`.select-produs[value="${produs.id}"]`);
            if (checkbox) {
                checkbox.checked = false;
            }
            eliminaDinComparare(produs.id);
        });
        item.appendChild(buton);
        lista.appendChild(item);
    });

    const butonExistent = document.getElementById("btn-compara");
    if (butonExistent) butonExistent.remove();
    
    if (produse.length === 2) {
        const buton = document.createElement("button");
        buton.id = "btn-compara";
        buton.textContent = "Compară";
        buton.addEventListener("click", function() {
            const ids = produse.map(p => p.id).join(",");
            // window.location.href = `/comparare?ids=${ids}`;
            window.open(`/comparare?ids=${ids}`, "_blank");
        });
        
        container.appendChild(buton);
    }
}

function gestioneazaStareCheckboxuri(produse) {
    const toateCheckboxurile = document.querySelectorAll(".select-produs");
    
    if (produse.length >= 2) {
        toateCheckboxurile.forEach(checkbox => {
            const esteProdusSelectat = produse.some(p => p.id === checkbox.value);
            
            if (!esteProdusSelectat) {
                checkbox.disabled = true;
                checkbox.parentElement.classList.add("checkbox-inactiv");
            } else {
                checkbox.disabled = false;
                checkbox.checked = true;
                checkbox.parentElement.classList.remove("checkbox-inactiv");
            }
        });
    } else {
        toateCheckboxurile.forEach(checkbox => {
            checkbox.disabled = false;
            checkbox.parentElement.classList.remove("checkbox-inactiv");
            
            const esteProdusSelectat = produse.some(p => p.id === checkbox.value);
            checkbox.checked = esteProdusSelectat;
        });
    }
}