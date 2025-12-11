// ---------------------------------------------------------
// Fonction pour faire défiler la page jusqu'à une section
// ---------------------------------------------------------
function goTo(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}



// =========================================================
// FONCTION : afficher un message coloré (succès / erreur)
// =========================================================
function showMessage(msg, type) {

    let box = document.createElement("div");

    box.style.padding = "12px";
    box.style.marginTop = "15px";
    box.style.borderRadius = "10px";
    box.style.fontWeight = "600";
    box.style.animation = "fadeIn 0.5s";

    if (type === "success") {
        box.style.background = "#d4f8d4";
        box.style.color = "#145214";
        box.style.border = "1px solid #8cd98c";
    } else {
        box.style.background = "#ffd6d6";
        box.style.color = "#8b0000";
        box.style.border = "1px solid #ff9b9b";
    }

    box.textContent = msg;

    let result = document.getElementById("result");
    result.innerHTML = "";
    result.appendChild(box);
}



// =========================================================
// Charger l’historique depuis localStorage
// =========================================================
function chargerActivite() {
    let liste = JSON.parse(localStorage.getItem("historique")) || [];
    let ul = document.getElementById("activity");
    ul.innerHTML = "";

    liste.forEach(item => {
        let li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
}



// =========================================================
// FONCTION PRINCIPALE : Calcul précompté / postcompté
// =========================================================
function calculer() {

    let capital = parseFloat(document.getElementById('capital').value);
    let taux = parseFloat(document.getElementById('taux').value);
    let duree = parseFloat(document.getElementById('duree').value);
    let typeInteret = document.getElementById('typeInteret').value;

    if (isNaN(capital) || isNaN(taux) || isNaN(duree)) {
        showMessage("⚠️ Veuillez remplir tous les champs correctement !", "error");
        return;
    }

    // Intérêts bruts (formule classique)
    let interets = (capital * taux * duree) / 36000;

    let montantRecu = 0;
    let montantRembourse = 0;
    let tauxEffectif = 0;

    // 🔹 POSTCOMPTÉ
    if (typeInteret === "post") {
        montantRecu = capital;
        montantRembourse = capital + interets;
        tauxEffectif = (interets / capital) * (36000 / duree);
    }

    // 🔹 PRÉCOMPTÉ
    else if (typeInteret === "pre") {
        montantRecu = capital - interets;
        montantRembourse = capital;
        tauxEffectif = (interets / montantRecu) * (36000 / duree);
    }

    document.getElementById('solde').innerText = montantRembourse.toFixed(2);


    // MESSAGE
    showMessage(
        `✔️ Intérêts : ${interets.toFixed(2)} DT  
        💰 Montant reçu : ${montantRecu.toFixed(2)} DT  
        🧾 Montant remboursé : ${montantRembourse.toFixed(2)} DT  
        📈 Taux effectif réel : ${tauxEffectif.toFixed(2)} %`,
        "success"
    );

    // -----------------------------------------------------
    // HISTORIQUE
    // -----------------------------------------------------
    let texte =
        `[${typeInteret === "post" ? "Postcomptés" : "Précomptés"}] Capital: ${capital} DT | ` +
        `Taux: ${taux}% | Durée: ${duree} j → ` +
        `Intérêts: ${interets.toFixed(2)} DT | ` +
        `Taux effectif: ${tauxEffectif.toFixed(2)} %`;

    let li = document.createElement("li");
    li.textContent = texte;
    document.getElementById("activity").appendChild(li);

    let historique = JSON.parse(localStorage.getItem("historique")) || [];
    historique.push(texte);
    localStorage.setItem("historique", JSON.stringify(historique));
}



// =========================================================
// Charger automatiquement l’historique
// =========================================================
window.onload = chargerActivite;
