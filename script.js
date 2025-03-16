const API_KEY = "8092011a413fdf96273cd8b560732f20";

async function obtenirMeteo() {
    const ville = document.getElementById("ville").value;
    if (ville === "") {
        alert("Veuillez entrer une ville !");
        return;
    }

    // Utiliser l'API Geocoding pour obtenir latitude et longitude
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${ville}&limit=1&appid=${API_KEY}`;
    
    try {
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            document.getElementById("resultat").innerHTML = `<p style="color:red;">Ville non trouvée !</p>`;
            return;
        }

        const { lat, lon, name, country } = geoData[0];

        const meteoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`;
        const meteoResponse = await fetch(meteoUrl);
        const meteoData = await meteoResponse.json();

        //document.getElementById("icone-meteo").src = `https://openweathermap.org/img/wn/${meteoData.weather[0].icon}@2x.png`;



        document.getElementById("resultat").innerHTML = `
        <h2>${name}, ${country}</h2>
        <img src="https://openweathermap.org/img/wn/${meteoData.weather[0].icon}@2x.png" alt="Météo">
        <p>🌡 Température : ${meteoData.main.temp}°C</p>
        <p>🌤 Condition : ${meteoData.weather[0].description}</p>
        <p>💨 Vent : ${meteoData.wind.speed} m/s</p>
        <p>💧 Humidité : ${meteoData.main.humidity}%</p>
        <p>⚡ Pression : ${meteoData.main.pressure} hPa</p>
        <p>👀 Visibilité : ${(meteoData.visibility / 1000).toFixed(1)} km</p>
        <p>🌅 Lever du soleil : ${new Date(meteoData.sys.sunrise * 1000).toLocaleTimeString("fr-FR")}</p>
        <p>🌇 Coucher du soleil : ${new Date(meteoData.sys.sunset * 1000).toLocaleTimeString("fr-FR")}</p>
            `;

    } catch (error) {
        console.error("Erreur :", error);
    }
}

let villes = [];

async function chargerVilles() {
    const response = await fetch('src/cities-minified.json'); // Charge la liste des villes
    villes = await response.json();
}

document.addEventListener("DOMContentLoaded", chargerVilles);

function afficherSuggestions() {
    const input = document.getElementById("ville").value.toLowerCase();
    const suggestionsDiv = document.getElementById("suggestions");

    if (input.length < 2) {
        suggestionsDiv.innerHTML = "";
        return;
    }

    const suggestions = villes
        .filter(v => v.name.toLowerCase().startsWith(input))
        .slice(0, 5); // Limite à 5 suggestions

    suggestionsDiv.innerHTML = suggestions.map(v => `<p onclick="selectionnerVille('${v.name}')">${v.name}, ${v.country}</p>`).join("");
}

function selectionnerVille(nom) {
    document.getElementById("ville").value = nom;
    document.getElementById("suggestions").innerHTML = "";
}