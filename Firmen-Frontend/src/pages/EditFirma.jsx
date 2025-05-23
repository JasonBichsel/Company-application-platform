import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Funktion zur Bereinigung der Eingabedaten
const sanitizeInput = (input) => {
    return input.replace(/<[^>]*>/g, '');  // Entfernt HTML-Tags
};

function EditFirma() {
    const location = useLocation(); // Holen der Firma aus dem state
    const navigate = useNavigate();
    
    // Initialisieren der Firma und Formulardaten
    const [firma, setFirma] = useState(location.state?.firma || {});
    const [formData, setFormData] = useState({
        firmenname: firma.firmenname || '',
        adresse: firma.adresse || '',
        kontaktperson: firma.kontaktperson || '',
        email: firma.email || '',
        telefon: firma.telefon || ''
        // Passwort wird hier nicht gesetzt, da es nicht bearbeitet werden soll
    });

    useEffect(() => {
        setFirma(location.state?.firma || {});
        setFormData({
            firmenname: firma.firmenname || '',
            adresse: firma.adresse || '',
            kontaktperson: firma.kontaktperson || '',
            email: firma.email || '',
            telefon: firma.telefon || ''
        });
    }, [location]);

    // Funktion zum Bearbeiten der Formulardaten und sicherstellen, dass die Eingabe sicher ist
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Bereinige die Eingabe, bevor sie gesetzt wird
        const sanitizedValue = sanitizeInput(value);

        setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
    };

    // Funktion zum Absenden des Formulars
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Überprüfen, ob die Felder leer sind und nur die nicht-leeren Felder in der Anfrage senden
        const updatedFirma = { 
            ...firma, 
            firmenname: formData.firmenname || firma.firmenname,
            adresse: formData.adresse || firma.adresse,
            kontaktperson: formData.kontaktperson || firma.kontaktperson,
            email: formData.email || firma.email,
            telefon: formData.telefon || firma.telefon
            // Passwort wird nicht geändert
        };

        // API-Anfrage zum Aktualisieren der Firma
        const response = await fetch(`http://localhost:8080/api/firma/${firma.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFirma),
        });

        if (response.ok) {
            // Nach erfolgreicher Aktualisierung zurück zur Firmenübersicht
            navigate('/firmen-list');
        } else {
            // Fehlerbehandlung
            alert('Fehler beim Aktualisieren der Firma');
        }
    };

    return (
        <div>
            <h1>Firma bearbeiten</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Firmenname:
                    <input
                        type="text"
                        name="firmenname"
                        value={formData.firmenname}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Adresse:
                    <input
                        type="text"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Kontaktperson:
                    <input
                        type="text"
                        name="kontaktperson"
                        value={formData.kontaktperson}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    E-Mail:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Telefonnummer:
                    <input
                        type="text"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                {/* Das Passwortfeld wird hier nicht angezeigt */}
                <button type="submit">Firma aktualisieren</button>
            </form>
        </div>
    );
}

export default EditFirma;
