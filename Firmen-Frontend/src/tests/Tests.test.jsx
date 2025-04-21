import React from 'react'; // React importieren
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import '@testing-library/jest-dom'; // für 'toBeInTheDocument'
import App from '../App';
import AdminPage from '../pages/AdminPage';
import RegistrationForm from '../pages/RegistrationForm';
import HomePage from '../pages/HomePage';
import FirmenList from '../pages/FirmenList';
import { fetchFirmen } from '../utils/api'; // API-Utils importieren
import { useNavigate } from 'react-router-dom'; // useNavigate aus 'react-router-dom' importieren


// Mock für useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

// Mock für fetch API in allgemeinen Tests
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
    })
);

// Mock für fetchFirmen
jest.mock('../utils/api', () => ({
    fetchFirmen: jest.fn(() => Promise.resolve([
        { id: 1, firmenname: 'Firma 1', adresse: 'Adresse 1', kontaktperson: 'Max', email: 'max@firma1.com', telefon: '0123456789', status: 'offen' },
        { id: 2, firmenname: 'Firma 2', adresse: 'Adresse 2', kontaktperson: 'Anna', email: 'anna@firma2.com', telefon: '9876543210', status: 'in Arbeit' },
    ])),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

afterEach(() => {
    jest.clearAllMocks(); // Alle Mocks zurücksetzen
});

// **FirmenList-Tests**
test('FirmenList rendert Firmen korrekt', async () => {
    render(<Router><FirmenList /></Router>);

    // Warten auf das Laden der Firmen-Daten
    const firma1Element = await screen.findByText(/Firma 1/i);
    expect(firma1Element).toBeInTheDocument();

    // Überprüfen, ob die Daten der Firmen auf der Seite korrekt angezeigt werden
    expect(screen.getByText('Firma 1')).toBeInTheDocument();
    expect(screen.getByText('Adresse 1')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('max@firma1.com')).toBeInTheDocument();

    expect(screen.getByText('Firma 2')).toBeInTheDocument();
    expect(screen.getByText('Adresse 2')).toBeInTheDocument();
    expect(screen.getByText('Anna')).toBeInTheDocument();
    expect(screen.getByText('anna@firma2.com')).toBeInTheDocument();
});

test('Fehlerbehandlung bei fehlendem API-Antwort', async () => {
    const mockError = true; // oder den Zustand simulieren, bei dem die API einen Fehler gibt

    render(<FirmenList firmen={[]} error={mockError} />);
    
    const errorMessage = await screen.findByText(/Fehler beim Laden der Firmen/i);
    expect(errorMessage).toBeInTheDocument();
});

// **AdminPage Test**
test('AdminPage wird nur für autorisierte Benutzer gerendert', async () => {
    const mockAuthValue = { isAuthenticated: false };

    render(
        <Router>
            <AuthContext.Provider value={mockAuthValue}>
                <AdminPage />
            </AuthContext.Provider>
        </Router>
    );

    // Warte darauf, dass der Text "Zugriff verweigert" im DOM erscheint
    await waitFor(() => screen.getByText(/Zugriff verweigert/i));

    // Überprüfe, ob der Text im Dokument ist
    expect(screen.getByText(/Zugriff verweigert/i)).toBeInTheDocument();
});


// **App Test**
test('App wird korrekt gerendert', () => {
    render(
      <MemoryRouter initialEntries={['/']}>  {/* MemoryRouter für Tests */}
        <App />  {/* Deine App-Komponente */}
      </MemoryRouter>
    );
  
    const linkElement = screen.getByText(/Willkommen auf meiner Persönlichen Webseite/i); // Beispiel-Text, den du erwartest
    expect(linkElement).toBeInTheDocument();
  });

// **RegistrationForm Test**
test('Registrierungsformular absenden und Navigation', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockImplementation(() => mockNavigate); // Mock implementieren
  
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegistrationForm />
      </MemoryRouter>
    );
  
    // Formulareingaben simulieren
    fireEvent.change(screen.getByPlaceholderText(/Firmenname/i), {
      target: { value: 'Test Firma' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Adresse/i), {
      target: { value: 'Test Adresse' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Kontaktperson/i), {
      target: { value: 'Max Mustermann' },
    });
    fireEvent.change(screen.getByPlaceholderText(/E-Mail/i), {
      target: { value: 'test@firma.de' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Telefonnummer/i), {
      target: { value: '123456789' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Passwort/i), {
      target: { value: 'Passwort123' },
    });
  
    // Formular absenden
    fireEvent.click(screen.getByRole('button', { name: /Registrieren/i }));
  
    // Warten, dass die Navigation stattfindet
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/firmen-list');
    });
  
    // Hier entfernen wir die Überprüfung auf die Formularwerte,
    // da diese nicht mehr im Formular angezeigt werden müssen.
});


// **Navigation Tests**
test('Test für Navigation zur Registrierung und Firmenliste', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockImplementation(() => mockNavigate); // Mock implementieren
  
    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );
  
    // Klicken auf den Button für die Registrierung
    fireEvent.click(screen.getByText(/Firmen Bewerbung/i));
  
    // Warten, bis die Navigation abgeschlossen ist und überprüfe die URL
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/register'));
  
    // Jetzt gehen wir zur Firmenliste
    fireEvent.click(screen.getByText(/Die beworbenen Firmen/i));
  
    // Überprüfen, ob die URL zur Firmenlisten-Seite navigiert
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/firmen-list'));
  });
