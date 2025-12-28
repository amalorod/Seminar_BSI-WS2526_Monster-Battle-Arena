
let monsters = [];
let selectedMonsters = []; 
let monsterWins = {}; 


class Monster {
    constructor(data) {
        this.name = data.name;
        this.strength = data.strength;
        this.defenseName = data.verteidigung; 
        this.hp = data.hp;
        this.defense = data.defenseval; 
        this.maxHp = data.hp; 
        this.wins = data.wins || 0
    }

    attack(target) {
        const damage = Math.max(0, this.strength - target.defense);
        target.hp -= damage;
        if (target.hp < 0) target.hp = 0;
        return damage;
    }

    isAlive() {
        return this.hp > 0;
    }
}







async function initializeGame() {
    
   
    
    const savedWins = localStorage.getItem('myMonsterWins');

    try {
        // JSON laden 
        const response = await fetch('./data/monster.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        monsters = data.map(d => new Monster(d));
        console.log("Monster aus JSON geladen:", monsters);

        // Wins AUS localStorage (falls vorhanden)
        monsterWins = savedWins ? JSON.parse(savedWins) : {};
        
        // Falls neue Monster: Wins initialisieren
        monsters.forEach(m => {
            if (!monsterWins[m.name]) monsterWins[m.name] = 0;
        });

        showMonsters();
    } catch (error) {
        console.error("Fehler beim Laden der JSON:", error);
    }
}








function showMonsters() {
    const monsterImages = document.querySelectorAll('.monster');
    const attackImages = [
        document.getElementById("monster1a"),
        document.getElementById("monster2a"),
        document.getElementById("monster3a"),
        document.getElementById("monster4a")
    ];




    
    function hideAllAttackImages() {
        attackImages.forEach(img => {
            if(img) img.style.display = "none";
        });
    }  hideAllAttackImages();




  
   

   
    monsterImages.forEach((img, index) => { img.onclick = () => {
            
           
            if (!monsters[index]) return;
            const clickedMonster = monsters[index];

            // Reset, falls schon 2 gewählt 
            if (selectedMonsters.length === 2) {
                selectedMonsters = [];
                hideAllAttackImages();
                monsterImages.forEach(image => image.classList.remove('selected'));
                document.getElementById("Ergebnisse").innerHTML = ""; 
            }

            // kein doppelt anklicken
            if (selectedMonsters.includes(clickedMonster)) {
                return; 
            }

            
            selectedMonsters.push(clickedMonster);
            img.classList.add('selected');

            // Wenn 2 Monster gewählt sind Kampf starten
            if (selectedMonsters.length === 2) {
                const m1 = selectedMonsters[0];
                const m2 = selectedMonsters[1];
                
                console.log("2 Monster gewählt! Kampf startet...");
                
                //Bilder
                const firstIndex = monsters.indexOf(m1);
                const secondIndex = monsters.indexOf(m2);
                if (attackImages[firstIndex]) attackImages[firstIndex].style.display = "block";
                if (attackImages[secondIndex]) attackImages[secondIndex].style.display = "block";

                



                startBattle(m1, m2);
            }
        };
    });
}

















//Kampf Logik
const startBattle = (monster1, monster2) => {
    const ergebnisDiv = document.getElementById("Ergebnisse");
    let log = `⚔️ Kampf startet: ${monster1.name} VS ${monster2.name} ⚔️ <br><br>`;

    let round = 1;
    const originalHp1 = monster1.hp;
    const originalHp2 = monster2.hp;

    
    while (monster1.isAlive() && monster2.isAlive()) {
        console.log(`--- Runde ${round} ---`);  
        log += `<br> --- Runde ${round} --- <br>`;

        // 1. Monster greift an
        const dmg1 = monster1.attack(monster2);
        
        console.log(` ${monster1.name} greift an! (Stärke: ${monster1.strength})`);
        console.log(` ${monster2.name} blockt mit ${monster2.defenseName}.`);
        console.log(`${monster2.name} verliert ${dmg1} HP. (Verbleibend: ${monster2.hp})`);
         
        log += `💥 ${monster1.name} greift an! (Stärke: ${monster1.strength})<br>`;
        log += `🛡️ ${monster2.name} blockt mit ${monster2.defenseName}.<br>`;
        log += `➖ ${monster2.name} verliert ${dmg1} HP. (Verbleibend: ${monster2.hp})<br>`;

        // Prüfen, ob Monster 2 besiegt ist
        if (!monster2.isAlive()) {
            console.log(`${monster2.name} ist besiegt!`);
            console.log(`GEWINNER: ${monster1.name}`);
            

            log += `<br>${monster2.name} ist besiegt!<br>`;
            log += `🏆 GEWINNER: ${monster1.name} 🏆<br>`;

            updateHighscore(monster1, monster2);
            break; 
        }

        // 2. Monster greift an
        const dmg2 = monster2.attack(monster1);
        
        console.log(`${monster2.name} kontert! (Stärke: ${monster2.strength})`);
        console.log(`${monster1.name} blockt mit ${monster1.defenseName}.`);
        console.log(`${monster1.name} verliert ${dmg2} HP. (Verbleibend: ${monster1.hp})`);
        
    
        log += `💥 ${monster2.name} kontert!<br>`;
        log += `🛡️ ${monster1.name} blockt mit ${monster1.defenseName}.<br>`;
        log += `➖ ${monster1.name} verliert ${dmg2} HP. (Verbleibend: ${monster1.hp})<br>`;


        //Prüfen ob 1. Monster bersiegt ist
        if (!monster1.isAlive()) {
            console.log(`${monster1.name} ist besiegt!`);
            console.log(` GEWINNER: ${monster2.name}`);
            
            log += `<br>💀 ${monster1.name} ist besiegt! 💀<br>`;
            log += `🏆 GEWINNER: ${monster2.name} 🏆<br>`;

            updateHighscore(monster2, monster1);
            break;
        }

        round++;
    }
    
    console.log(`Kampf beendet!`);
    log += `<br>⚔️ Kampf beendet! ⚔️<br>`;
    
    // HP Reset
    monster1.hp = originalHp1;
    monster2.hp = originalHp2;

    // log als innerhtml ausgeben
    ergebnisDiv.innerHTML = log;


    saveBattleLog(`${monster1.name} hat gegen ${monster2.name} gekämpft.`);
};




// log
const saveBattleLog = (logEntry) => {
    const history = JSON.parse(localStorage.getItem('battleHistory')) || [];
    history.push(logEntry);
    localStorage.setItem('battleHistory', JSON.stringify(history));
    
}



function resetFight() {
    showMonsters(); 
    
    document.getElementById("Ergebnisse").innerHTML = "";
    const images = document.querySelectorAll('.monster');
    images.forEach(img => img.classList.remove('selected'));
    selectedMonsters = [];
    
    // Attack Images verstecken
    document.getElementById("monster1a").style.display = "none";
    document.getElementById("monster2a").style.display = "none";
    document.getElementById("monster3a").style.display = "none";
    document.getElementById("monster4a").style.display = "none";
}


window.onload = function() {
    
    const ids = ["monster1a", "monster2a", "monster3a", "monster4a"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.style.display = "none";



    }); initializeGame();
};






function loadPage()  {
    location.reload();
}








function updateHighscore(winner, loser) {
     monsterWins[winner.name] = (monsterWins[winner.name] || 0) + 1;
    monsterWins[loser.name] = 0;

    // Ausgabe
    let output = "";
    const sortedMonsters = [...monsters].sort((a, b) => 
        (monsterWins[b.name] || 0) - (monsterWins[a.name] || 0)
    );

    sortedMonsters.forEach(monster => {
        const wins = monsterWins[monster.name] || 0;
        if (monster === winner) {
            output += `${monster.name}: ${wins} <br>`;
        } else {
            output += `${monster.name}: ${wins}<br>`;
        }
    });

    
    document.getElementById("ausgabeSieger").innerHTML = output;
    

    
    localStorage.setItem('myMonsterWins', JSON.stringify(monsterWins));
}