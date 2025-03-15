const API_KEY = "8092011a413fdf96273cd8b560732f20";

function getMeteo() {

    const ville = document.getElementById("ville").value;

    if (ville === ""){
        alert("Veuillez entrez une ville bande de saligots");
    return;
        }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${API_KEY}&units=metric&lang=fr`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            
            if(data.cod === 200) {
                    document.getElementById("resultat".innerHTML = `
                        
                        <h2> ${data.name}, ${data.sys.country}</h2>
                        <p> Température: ${data.main.temp} °C</p>
                        `)
                
            }


        })
}