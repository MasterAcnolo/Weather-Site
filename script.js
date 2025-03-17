const API_KEY = "8092011a413fdf96273cd8b560732f20";

async function obtenirMeteo() {
    const ville = document.getElementById("ville").value.trim();
    if (ville === "") {
        alert("Veuillez entrer une ville !");
        return;
    }

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

        console.log("MétéoData :", meteoData);
        
        document.querySelector(".Output").innerHTML = `
        <h2>${name}, ${country}</h2>
        <img src="https://openweathermap.org/img/wn/${meteoData.weather[0].icon}@2x.png" alt="Météo">
        <p>🌡 Température : ${meteoData.main.temp}°C</p>
        <p>🌤 Condition : ${meteoData.weather[0].description}</p>
        <p>💨 Vent : ${meteoData.wind.speed} m/s</p>
        <p>💧 Humidité : ${meteoData.main.humidity}%</p>
        <p>⚡ Pression : ${meteoData.main.pressure} hPa</p>
        <p>👀 Visibilité : ${(meteoData.visibility / 1000).toFixed(1)} km</p>
        <p>🌅 Lever du soleil : ${new Date(meteoData.sys.sunrise * 1000).toLocaleTimeString("fr-FR")}</p>
        <p>🌇 Coucher du soleil : ${new Date(meteoData.sys.sunset * 1000).toLocaleTimeString("fr-FR")}</p>`;
    
        // Activer l'effet d'apparition
        document.querySelector(".Output").classList.add("active");
    } catch (error) {
        console.error("Erreur :", error);
    }
}

let villes = [];

async function chargerVilles() {
    try {
        const response = await fetch('src/cities-minified.json');
        villes = await response.json();
        console.log("Villes chargées :", villes.length);
    } catch (error) {
        console.error("Erreur lors du chargement des villes :", error);
    }
}

document.addEventListener("DOMContentLoaded", chargerVilles);

function afficherSuggestions() {
    const input = document.getElementById("ville").value.toLowerCase();
    const suggestionsDiv = document.getElementById("suggestions");
    suggestionsDiv.style.display = "block"; // ✅ Correction

    if (input.length < 2) {
        suggestionsDiv.innerHTML = "";
        suggestionsDiv.style.display = "none"; // ✅ Masquer si input trop court
        return;
    }

    const suggestions = villes
        .filter(v => v.name.toLowerCase().startsWith(input))
        .slice(0, 5);

    if (suggestions.length === 0) {
        suggestionsDiv.innerHTML = "";
        suggestionsDiv.style.display = "none"; // ✅ Masquer si aucune suggestion
        return;
    }

    suggestionsDiv.innerHTML = suggestions.map(v => 
        `<p onclick="selectionnerVille('${v.name}')">${v.name}, ${v.country}</p>`
    ).join("");
}

function selectionnerVille(nom) {
    document.getElementById("ville").value = nom;
    const suggestionsDiv = document.getElementById("suggestions");
    suggestionsDiv.innerHTML = "";
    suggestionsDiv.style.display = "none"; // ✅ Masquer après sélection
}
