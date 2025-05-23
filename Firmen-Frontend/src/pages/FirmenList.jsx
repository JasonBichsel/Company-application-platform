import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import './FirmenList.css'; // CSS-Datei eingebunden

function FirmenList() {
    const [firmen, setFirmen] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [password, setPassword] = useState('');
    const [selectedFirma, setSelectedFirma] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchFirmen = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/firma', { method: 'GET' });
            if (response.ok) {
                const data = await response.json();
                setFirmen(data);
            } else {
                console.error('Fehler beim Abrufen der Firmen');
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Firmen:', error);
        }
    };

    useEffect(() => {
        fetchFirmen();
        const handleStorageChange = (e) => {
            if (e.key === 'firmaStatusUpdated') {
                fetchFirmen();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleEditClick = (firma) => {
        setSelectedFirma(firma);
        setIsModalOpen(true);
    };

    const handleUpdateFirma = async () => {
        if (!password) {
            alert('Bitte Passwort eingeben.');
            return;
        }
        setLoading(true);
        const cleanedPassword = password.trim().replace(/^"|"$/g, '');
        const isPasswordValid = await checkPassword(selectedFirma.id, cleanedPassword);
        if (isPasswordValid) {
            navigate(`/edit-firma/${selectedFirma.id}`, { state: { firma: selectedFirma } });
        } else {
            alert('Falsches Passwort.');
        }
        setLoading(false);
        setIsModalOpen(false);
    };

    const checkPassword = async (id, password) => {
        try {
            const response = await fetch(`http://localhost:8080/api/firma/check-passwort/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (!response.ok) {
                console.error('Fehler bei der Passwortüberprüfung:', response.status);
                return false;
            }
            const data = await response.json();
            return data.valid || false;
        } catch (error) {
            console.error('Fehler bei der Passwortüberprüfung:', error);
            return false;
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="firmen-container">
            <h1>Firmenübersicht</h1>
            <div class="search-container">
            <input 
                type="text" 
                placeholder="Suche nach Firmen..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="search-bar"
            />
            <button onClick={handleGoHome} className="back-button">
                Zurück zur Startseite
            </button>
            </div>
        
            <ul className="firmen-liste">
                {firmen.filter(firma => firma.firmenname.toLowerCase().includes(searchTerm.toLowerCase())).map((firma) => (
                    <li key={firma.id} className={`firmen-item ${firma.status === 'offen' ? 'status-offen' : firma.status === 'in Arbeit' ? 'status-in-arbeit' : 'status-versendet'}`}>
                        <p className="firmenname"><strong>Firmenname:</strong> {firma.firmenname}</p>
                        <p className="details"><strong>Adresse:</strong> {firma.adresse}</p>
                        <p className="details"><strong>Kontaktperson:</strong> {firma.kontaktperson}</p>
                        <p className="details"><strong>Email:</strong> {firma.email}</p>
                        <p className="details"><strong>Telefon:</strong> {firma.telefon}</p>
                        <p className="details"><strong>Status:</strong> {firma.status}</p>
                        <button onClick={() => handleEditClick(firma)}>Bearbeiten</button>
                    </li>
                ))}
            </ul>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleUpdateFirma}
                loading={loading}
                password={password}
                onPasswordChange={(e) => setPassword(e.target.value)}
            />

            
        </div>
    );
}

export default FirmenList;
