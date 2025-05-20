const express = require("express");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const sass = require("sass");
const app = express();
const pg = require("pg");

const Client=pg.Client;

client=new Client({
    database:"proiect",
    user:"andrei",
    password:"andrei",
    host:"localhost",
    port:5432
})

client.connect()
client.query("select * from albume", function(err, rezultat ){
    console.log(err)    
    console.log("Rezultat query:", rezultat)
})
client.query("select * from unnest(enum_range(null::categ_album))", function(err, rezultat ){
    console.log(err)    
    console.log(rezultat)
})

console.log("Folderul proiectului: ", __dirname);
console.log("Calea fisierului index.js: ", __filename);
console.log("Folderul curent de lucru: ", process.cwd());

app.set("view engine", "ejs");

obGlobal={
    obErori:null,
    obImagini: null,
    folderScss: path.join(__dirname,"resurse/scss"),
    folderCss: path.join(__dirname,"resurse/css"),
    folderBackup: path.join(__dirname,"backup")
}

function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);
    if(!caleCss){
        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0];
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss);
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss);

    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true});
    }

    let numeFisCss=path.basename(caleCss);
    let timestamp=Date.now();
    numeFisCss=numeFisCss.replace(".css", `_${timestamp}.css`);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ));
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css);
}

vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){ //verificam pentru ca rename poate insemna si stergerea fisierului
            compileazaScss(caleCompleta);
        }
    }
})

// bonus stergere fisiere backup "expirate"
const tempBackup = path.join(__dirname, "backup", "resurse", "css");
const T = 5;
function cleanupBackup() {
    const threshold = Date.now() - (T * 60 * 1000);
    fs.readdir(tempBackup, (err, files) => {
      if (err) return;
      
      files.forEach(file => {
        const filePath = path.join(tempBackup, file);
        
        fs.stat(filePath, (err, stats) => {
          if (err) return;
          
          if (stats.mtimeMs < threshold) {
            fs.unlink(filePath, () => {});
          }
        });
      });
    });
}
cleanupBackup();
setInterval(cleanupBackup, 5 * 60 * 1000);

function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    console.log(continut);
    obGlobal.obErori=JSON.parse(continut);
    console.log(obGlobal.obErori);
    
    obGlobal.obErori.eroare_default.imagine=path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine);
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza, eroare.imagine);
    }
    console.log(obGlobal.obErori);
}
initErori()

function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    for (let imag of vImagini){
        [numeFis, ext]=imag.fisier.split(".");
        let caleFisAbs=path.join(caleAbs,imag.fisier);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.fisier_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp");
        imag.fisier=path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier);
        
    }
    console.log(obGlobal.obImagini)
}
initImagini();

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare= obGlobal.obErori.info_erori.find(function(elem){ 
                        return elem.identificator==identificator;
                    });
    if(eroare){
        if(eroare.status)
            res.status(identificator)
        var titluCustom=titlu || eroare.titlu;
        var textCustom=text || eroare.text;
        var imagineCustom=imagine || eroare.imagine;
    }
    else{
        var err=obGlobal.obErori.eroare_default;
        var titluCustom=titlu || err.titlu;
        var textCustom=text || err.text;
        var imagineCustom=imagine || err.imagine;


    }
    res.render("pagini/eroare", {
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
})
}


// bonus oferte
function getCurrentOffer() {
    try {
        const offerFilePath = path.join(__dirname, "resurse", "json","oferte.json");
        if (!fs.existsSync(offerFilePath)) {
            console.log("Fișierul oferte.json nu există!");
            return null;
        }
        
        const fileContent = fs.readFileSync(offerFilePath, 'utf8');
        const data = JSON.parse(fileContent);
        const offers = data.oferte || [];
        
        if (offers.length === 0) {
            console.log("Nu există oferte în fișier!");
            return null;
        }
        
        const currentOffer = offers[0];
        const endDate = new Date(currentOffer['data-finalizare']);
        const now = new Date();
        
        console.log("Data curentă:", now);
        console.log("Data finalizare ofertă:", endDate);
        console.log("Oferta validă:", endDate > now);
        
        if (endDate > now) {
            return currentOffer;
        } else {
            console.log("Oferta a expirat!");
            return null;
        }
    } catch (error) {
        console.error('Eroare la obținerea ofertei curente:', error);
        return null;
    }
}

app.use("/resurse", function(req, res, next){
    let caleFisier = path.join(__dirname, "resurse", req.url);
    if (fs.existsSync(caleFisier) && fs.lstatSync(caleFisier).isDirectory()) {
        afisareEroare(res, 403);
    } else {
        next();
    }
})

app.use("/resurse", express.static(path.join(__dirname, "resurse"), {
    index: false,
    fallthrough: true
}))

app.get("/produse", function(req, res){
    console.log(req.query)
    var conditieQuery=""; // TO DO where din parametri
    if(req.query.tip){
        conditieQuery=` where categorie='${req.query.tip}'`
    }

    let queryOptiuni="select * from unnest(enum_range(null::categ_album))"
    client.query(queryOptiuni, function(err, rezOptiuni){
        console.log(rezOptiuni)
        
    let queryPreturi="select min(pret) as pret_min, max(pret) as pret_max from albume"
    client.query(queryPreturi, function(err, rezPreturi){
        if (err){
            console.log(err);
            afisareEroare(res, 2);
        }
        let queryProduse="select * from albume" + conditieQuery;
        client.query(queryProduse, function(err, rez){
            if (err){
                console.log(err);
                afisareEroare(res, 2);
            }
            else{
                let ofertaCurenta = getCurrentOffer();
                res.render("pagini/produse", {produse: rez.rows, optiuni:rezOptiuni.rows,
                                                pret_min: parseFloat(rezPreturi.rows[0].pret_min),
                                                pret_max: parseFloat(rezPreturi.rows[0].pret_max),
                                                oferta: ofertaCurenta})
            }
            })
        })
    });
})

app.get("/produs/:id", function(req, res){
    client.query(`select * from albume where id = ${req.params.id}`, function(err, rez){
        if (err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else{
            if (rez.rowCount==0){
                afisareEroare(res, 404);
            }
            else{
                res.render("pagini/produs", {prod: rez.rows[0]})
            }
        }
    })
})

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "resurse/ico/favicon/favicon.ico"));
})

app.get(["/","/index","/home"], function(req, res){
    let ofertaCurenta = getCurrentOffer();
    res.render("pagini/index",{ip:req.ip, oferta: ofertaCurenta});
})

app.get(["/galerie"], function(req, res){
    res.render("pagini/galerie",{ip:req.ip, imagini:obGlobal.obImagini.imagini});
})

app.get(["/galerie-animata"], function(req, res){
    res.render("pagini/galerie-animata", {imagini:obGlobal.obImagini.imagini});
})


app.get("/index/a", function(req, res){
    res.render("pagini/index");
})


app.get("/cerere", function(req, res){
    res.send("<p style='color:blue'>Buna ziua</p>")
})


app.get("/fisier", function(req, res, next){
    res.sendfile(path.join(__dirname,"package.json"));
})

// bonus comparare
app.get("/comparare", function(req, res){
    if (!req.query.ids) {
        afisareEroare(res, 400);
        return;
    }
    
    const ids = req.query.ids.split(",");
    const id1 = parseInt(ids[0]);
    const id2 = parseInt(ids[1]);
    
    client.query("SELECT * FROM albume WHERE id = $1 OR id = $2", [id1, id2], function(err, rez){
        if (err){
            afisareEroare(res, 2);
            return;
        }
        if (rez.rowCount < 2){
            afisareEroare(res, 404);
            return;
        }
        
        res.render("pagini/comparare", {albume: rez.rows});
    });
});

app.get("/*.ejs", function(req, res, next){
    afisareEroare(res,400);
})


app.get("/*", function(req, res, next){
    try{
        res.render("pagini"+req.url,function (err, rezultatRandare){
            if (err){
                if(err.message.startsWith("Failed to lookup view")){
                    afisareEroare(res,404);
                }
                else{
                    afisareEroare(res);
                }
            }
            else{
                console.log(rezultatRandare);
                res.send(rezultatRandare);
            }
        });
    }
    catch(errRandare){
        if(errRandare.message.startsWith("Cannot find module")){
            afisareEroare(res,404);
        }
        else{
            afisareEroare(res);
        }
    }
})

const vectFoldere = ["temp", "temp1", "backup"];
vectFoldere.forEach(folder => {
    const caleFolder = path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder);
        console.log("Folderul a fost creat.");
    } else {
        console.log("Folderul există deja.");
    }
});


app.listen(8080);
console.log("Serverul a pornit");