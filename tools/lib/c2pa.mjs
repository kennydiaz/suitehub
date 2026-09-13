// Lectura del manifiesto C2PA de una imagen, para saber de donde salio.
//
// Lo usan tools/fotos-casos.mjs (que se niega a convertir una imagen generada)
// y tools/revisa-fotos.mjs (que audita una carpeta entera). Es el unico momento
// en que se puede saber: al convertir a WebP corremos strip-c2pa para no servir
// 5 KB de metadata por archivo, y ahi se pierde la prueba.
//
// El manifiesto va en un sitio distinto segun el formato:
//   PNG   chunk caBX
//   JPEG  marcador APP11 (0xFFEB), posiblemente partido en varios
//   WebP  chunk RIFF C2PA

export function buscaC2PA(b) {
  if (b.length > 8 && b.readUInt32BE(0) === 0x89504e47) {
    let p = 8;
    while (p + 8 <= b.length) {
      const l = b.readUInt32BE(p);
      const t = b.toString('ascii', p + 4, p + 8);
      if (t === 'caBX') return b.subarray(p + 8, p + 8 + l);
      if (t === 'IEND') break;
      p += 12 + l;
    }
    return null;
  }

  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    const trozos = [];
    let p = 2;
    while (p + 4 <= b.length) {
      if (b[p] !== 0xff) { p++; continue; }
      const marca = b[p + 1];
      if (marca === 0xd9 || marca === 0xda) break; // fin de imagen o inicio del scan
      const l = b.readUInt16BE(p + 2);
      if (marca === 0xeb) trozos.push(b.subarray(p + 4, p + 2 + l));
      p += 2 + l;
    }
    return trozos.length ? Buffer.concat(trozos) : null;
  }

  if (b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF') {
    let p = 12;
    while (p + 8 <= b.length) {
      const t = b.toString('ascii', p, p + 4);
      const l = b.readUInt32LE(p + 4);
      if (t === 'C2PA') return b.subarray(p + 8, p + 8 + l);
      p += 8 + l + (l % 2); // los chunks RIFF van alineados a par
    }
  }

  return null;
}

// Devuelve el nombre del generador si la imagen la hizo un modelo, o null.
// Los generadores firman con digitalSourceType = trainedAlgorithmicMedia.
export function generadaPorIA(bytes) {
  const cab = buscaC2PA(bytes);
  if (!cab) return null;
  const s = cab.toString('latin1');
  if (!/trainedAlgorithmicMedia|compositeWithTrainedAlgorithmicMedia/.test(s)) return null;
  const agente = s.match(/dname([A-Za-z0-9.\-]{3,30})gversion/);
  return agente ? agente[1].replace(/^i/, '') : 'un generador de imagenes';
}

// Para auditar: dice de donde salio la imagen, sin juzgar.
export function procedencia(bytes) {
  const cab = buscaC2PA(bytes);
  if (!cab) return { estado: 'camara', detalle: 'sin manifiesto' };
  const generador = generadaPorIA(bytes);
  if (generador) return { estado: 'generada', detalle: generador };
  const firmante = (cab.toString('latin1').match(/(OpenAI|Adobe|Google|Microsoft|Leica|Sony|Canon|Nikon)/) || [])[0];
  return { estado: 'firmada', detalle: firmante ? `firmada por ${firmante}` : 'manifiesto sin generador declarado' };
}
