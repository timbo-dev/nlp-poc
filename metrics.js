

// Carregar e processar o arquivo JSON
fs.readFile('output.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.error("Erro ao ler o arquivo:", err);
    return;
  }
  try {
    const data = JSON.parse(jsonString);
    calculateAccuracy(data);
  } catch (err) {
    console.error("Erro ao analisar JSON:", err);
  }
});