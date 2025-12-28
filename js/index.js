function closeModal() {
 
    const modalElement = document.getElementById("myModal");
    if (modalElement) {
        modalElement.style.display = "none";
        collectInput();
    }
  
  
}


function collectInput() {
  
  var userFname = document.getElementById("fname").value;
  var userLname = document.getElementById("lname").value;
  var userEname = document.getElementById("name").value;
  var userAge = document.getElementById("alter").value;
  
  document.getElementById("userdata").innerHTML = 
    `Hallo, ${userFname + " " + userLname}! <br>
    Dein Alter ist: ${userAge}<br>
    Deine E-Mail lautet: ${userEname} <br>
    
    
    
    `;
  
  
  
}

alert ("Wichtig! Starte die Webseite über xampp/mampp und rufe sie über localhost/ auf!")
