// src/App.js
import React, { useState } from 'react';
import { render, Printer, Text, Line } from 'react-thermal-printer';

function App() {
  const [log, setLog] = useState([]);

  const addLog = (message) => {
    // Agrega mensajes a un array de logs para mostrar en pantalla
    setLog((prev) => [...prev, message]);
  };

  async function handlePrint() {
    try {
      addLog('Generando bytes de impresión...');
      // 1) Generar el buffer ESC/POS
      //    con los componentes que quieras (Text, Line, Barcode, QrCode, etc.)
      const data = await render(
        <Printer type="epson">
          <Text align="center" bold size={{ width: 2, height: 2 }}>
            Hello World
          </Text>
          <Line />
          <Text>¡Esta impresión viene desde el navegador!</Text>
        </Printer>
      );

      addLog('Solicitando acceso al puerto serie...');
      // 2) Pedir permiso al usuario para acceder a la impresora (puerto serie)
      const port = await window.navigator.serial.requestPort();
      addLog('Abriendo puerto a 9600 baud...');
      await port.open({ 
        baudRate: 9600,
        // dataBits: 8,
        // stopBits: 1,
        // parity: 'none',
      });

      // 3) Enviar los datos binarios al puerto serie
      addLog('Enviando datos a la impresora...');
      const writer = port.writable?.getWriter();
      if (writer) {
        await writer.write(data);
        writer.releaseLock();
      }

      // 4) Cerrar el puerto (opcional, pero recomendable)
      addLog('Cerrando puerto...');
      await port.close();

      addLog('¡Impresión completada con éxito!');
    } catch (error) {
      addLog('Error al imprimir: ' + error.message);
    }
  }

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Ejemplo: Impresión vía Web Serial API</h1>

      <p>
        Este ejemplo utiliza <code>react-thermal-printer</code> para generar
        los bytes ESC/POS y la <b>Web Serial API</b> para enviarlos a una
        impresora térmica conectada por puerto serie.
      </p>

      <button onClick={handlePrint}>Imprimir</button>

      {/* Mostrar el log en pantalla */}
      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f9f9f9',
          border: '1px solid #ddd',
        }}
      >
        <h3>Log:</h3>
        {log.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
