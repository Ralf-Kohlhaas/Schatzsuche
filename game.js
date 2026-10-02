// ========================================
// Schatzsuche – gemeinsame Einstellungen
// ========================================

// Größe der Zielzone in Metern
const TARGET_RADIUS = 10;


// ========================================
// GPS und Entfernung
// ========================================

let watchId = null;


// Startet die Standortüberwachung
function startLocationTracking() {

    const status = document.getElementById("status");

    if (!navigator.geolocation) {
        status.textContent =
            "❌ Dieser Browser unterstützt keine Standortabfrage.";
        return;
    }

    status.textContent =
        "📍 Standort wird ermittelt ...";

    watchId = navigator.geolocation.watchPosition(

        // Neue Position erhalten
        updatePosition,

        // Fehler
        handleLocationError,

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


// Neue GPS-Position verarbeiten
function updatePosition(position) {

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const status = document.getElementById("status");
    const distanceElement = document.getElementById("distance");

    // Entfernung zum Ziel berechnen
    const distance = calculateDistance(
        latitude,
        longitude,
        TARGET_LAT,
        TARGET_LON
    );

    // Entfernung minus Zielradius
    const remainingDistance = Math.max(
        0,
        distance - TARGET_RADIUS
    );

    // Auf ganze Meter runden
    distanceElement.textContent =
        Math.round(remainingDistance) + " m";


    // Prüfen, ob das Ziel erreicht wurde
    if (distance <= TARGET_RADIUS) {

        status.textContent =
            "🎉 Ziel erreicht!";

        markPageCompleted();

    } else {

        status.textContent =
            "📍 Entfernung zum Ziel";
    }
}


// Fehler bei der Standortabfrage
function handleLocationError(error) {

    const status = document.getElementById("status");

    switch (error.code) {

        case error.PERMISSION_DENIED:
            status.textContent =
                "❌ Standortzugriff wurde verweigert.";
            break;

        case error.POSITION_UNAVAILABLE:
            status.textContent =
                "❌ Standort momentan nicht verfügbar.";
            break;

        case error.TIMEOUT:
            status.textContent =
                "❌ Zeitüberschreitung bei der Standortabfrage.";
            break;

        default:
            status.textContent =
                "❌ Unbekannter Fehler bei der Standortabfrage.";
    }
}


// ========================================
// Entfernung zwischen zwei GPS-Punkten
// ========================================

// Berechnung nach der Haversine-Formel
function calculateDistance(lat1, lon1, lat2, lon2) {

    const earthRadius = 6371000; // Meter

    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;

    const deltaLat =
        (lat2 - lat1) * Math.PI / 180;

    const deltaLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(deltaLat / 2) *
        Math.sin(deltaLat / 2) +
        Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
}


// ========================================
// Fortschritt speichern
// ========================================

function markPageCompleted() {

    localStorage.setItem(
        "schatzsuche_" + PAGE_ID,
        "completed"
    );

    showNextButton();
}


// Prüfen, ob diese Seite schon erledigt wurde
function checkPageCompleted() {

    const completed =
        localStorage.getItem(
            "schatzsuche_" + PAGE_ID
        );

    if (completed === "completed") {
        showNextButton();

        document.getElementById("status").textContent =
            "✅ Dieses Ziel wurde bereits erreicht.";
    }
}


// Weiter-Button anzeigen
function showNextButton() {

    const nextButton =
        document.getElementById("nextButton");

    nextButton.style.visibility = "visible";
}


// ========================================
// Start
// ========================================

checkPageCompleted();
startLocationTracking();
