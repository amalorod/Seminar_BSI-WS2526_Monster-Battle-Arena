function showCustom() {

document.getElementById("customModal").style.display ="flex";
activateSliderLabels();

}

function closeCustom() {
    const modal = document.getElementById("customModal");
    if(modal) {
        modal.style.display = "none";
    }
}

function activateSliderLabels() {
    
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {  
        const display = slider.nextElementSibling;

        if (display && display.classList.contains("slider-value")) {
   
            display.innerText = slider.value;

            //event listener für den slider
            slider.addEventListener('input', function() {
               
                const prefix = (this.value > 0) ? "" : ""; 
                display.innerText = prefix + this.value;
                
               
                if (this.value > 0) display.style.color = "green";
                else if (this.value < 0) display.style.color = "red";
                else display.style.color = "black";
            });
        }
    });
}

function saveAllMonsters() {
    // durch alle 4 Monster iterieren
    for (let i = 0; i < 4; i++) {
        
        // Inputs für dieses Monster finden
        const nameInput = document.getElementById(`name-${i}`);
        const atkInput = document.getElementById(`atk-${i}`);
        const hpInput = document.getElementById(`hp-${i}`);
        const defInput = document.getElementById(`def-${i}`);

        // Sicherheitscheck: Existiert das Monster im Array?
        if (monsters[i]) {
            
            //  Name ändern (nur wenn was eingetippt wurde)
            if (nameInput.value.trim() !== "") {
                monsters[i].name = nameInput.value;
            }

            // Werte anpassen 
           
            const atkBonus = parseInt(atkInput.value);
            const hpBonus = parseInt(hpInput.value);
            const defBonus = parseInt(defInput.value);

           
            
            monsters[i].strength = atkBonus;
            monsters[i].hp = hpBonus;
            monsters[i].maxHp = hpBonus;
            monsters[i].defense = defBonus;

            monsters[i].defenseval = defBonus;
            monsters[i].verteidigung = monsters[i].defenseName;
        }
    }

    
    localStorage.setItem('myMonsterList', JSON.stringify(monsters));
    alert("Monster erfolgreich aktualisiert und gespeichert!");
    
    
    document.getElementById("customModal").style.display = "none";
    showMonsters();
}