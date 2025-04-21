// src/utils/api.js

export const fetchFirmen = async () => {
    const response = await fetch('http://localhost:8080/api/firmen');
    if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Firmen');
    }
    return await response.json();
};

export const updateFirma = async (id, updatedFirma) => {
    const response = await fetch(`http://localhost:8080/api/firma/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFirma),
    });

    if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren der Firma');
    }
    return await response.json();
};

// Hier kannst du auch noch andere API-Aufrufe wie Löschen, Erstellen usw. hinzufügen
