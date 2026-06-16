const puppeteer = require('puppeteer');
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const DIAGRAMS_FILE = path.join(DOCS_DIR, 'diagramas.md');
const DOC_FILE = path.join(DOCS_DIR, 'documentacion.md');
const OUTPUT_FILE = path.join(DOCS_DIR, 'documentacion.pdf');

function parseMermaidBlocks(md) {
  const blocks = [];
  const lines = md.split('\n');
  let currentTitle = '';
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      currentTitle = lines[i].replace('## ', '').trim();
    }
    if (lines[i].trim() === '```mermaid') {
      i++;
      let code = '';
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code += lines[i] + '\n';
        i++;
      }
      if (code.trim()) blocks.push({ title: currentTitle, code: code.trim() });
    }
  }
  return blocks;
}

async function renderMermaidSVGs(blocks) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const results = [];

  for (const block of blocks) {
    console.log(`  Renderizando: ${block.title}...`);
    const html = `
      <!DOCTYPE html><html><head>
      <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
      <style>body{margin:20px;background:white}svg{max-width:100%;height:auto}</style>
      </head><body>
      <div class="mermaid">${block.code}</div>
      <script>
        mermaid.initialize({startOnLoad:false,theme:'default'});
        try { mermaid.run({nodes: [document.querySelector('.mermaid')]}); } catch(e) {}
      </script>
      </body></html>`;
    try {
      await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForSelector('svg', { timeout: 25000 });
      await new Promise(r => setTimeout(r, 2000));
      const svg = await page.evaluate(() => {
        const el = document.querySelector('.mermaid svg');
        return el ? el.outerHTML : null;
      });
      if (svg) {
        results.push({ title: block.title, svg });
        console.log(`    ✅ Renderizado`);
      } else {
        console.log(`    ⚠ No se encontró SVG`);
      }
    } catch (err) {
      console.log(`    ❌ Error: ${err.message.slice(0, 80)}`);
    }
  }
  await browser.close();
  return results;
}

async function main() {
  // 1. Renderizar diagramas Mermaid
  console.log('Paso 1/3: Renderizando diagramas Mermaid...');
  const diagramsMd = fs.readFileSync(DIAGRAMS_FILE, 'utf-8');
  const blocks = parseMermaidBlocks(diagramsMd);
  const svgs = await renderMermaidSVGs(blocks);
  console.log(`  ${svgs.length}/${blocks.length} diagramas renderizados`);

  // 2. Convertir documentación markdown a HTML
  console.log('Paso 2/3: Convirtiendo documentación a HTML...');
  const docMd = fs.readFileSync(DOC_FILE, 'utf-8');
  // Remover el índice (todo entre ## Índice y ## 1.)
  let body = docMd.replace(/## Índice[\s\S]*?(?=## 1\.)/, '');
  const bodyHtml = marked(body);

  // 3. Construir HTML completo
  let html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  @page { margin: 25mm 20mm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
  h1 { color: #1a56db; border-bottom: 3px solid #1a56db; padding-bottom: 8px; font-size: 22pt; }
  h2 { color: #2563eb; margin-top: 35px; font-size: 16pt; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; page-break-before: always; }
  h2:first-of-type { page-break-before: avoid; }
  h3 { color: #374151; font-size: 13pt; margin-top: 22px; }
  h4 { color: #4b5563; font-size: 11pt; }
  table { border-collapse: collapse; width: 100%; margin: 15px 0; font-size: 9.5pt; }
  th, td { border: 1px solid #d1d5db; padding: 5px 8px; text-align: left; }
  th { background: #2563eb; color: white; font-weight: 600; }
  tr:nth-child(even) { background: #f9fafb; }
  code { background: #f3f4f6; padding: 1px 5px; border-radius: 3px; font-size: 9.5pt; color: #d97706; }
  pre { background: #1f2937; color: #e5e7eb; padding: 12px 16px; border-radius: 6px; font-size: 8.5pt; line-height: 1.5; overflow-x: auto; }
  blockquote { border-left: 4px solid #2563eb; margin: 15px 0; padding: 8px 16px; background: #f0f4ff; }
  img { max-width: 100%; height: auto; }
  .cover { text-align: center; padding-top: 120px; page-break-after: always; }
  .cover h1 { font-size: 30pt; border: none; color: #1e3a8a; margin-bottom: 10px; }
  .cover .subtitle { font-size: 14pt; color: #6b7280; margin: 15px 0 40px; }
  .cover .meta { margin-top: 50px; font-size: 11pt; color: #4b5563; line-height: 2; }
  .cover .meta strong { color: #1e3a8a; }
  .diagram { text-align: center; margin: 20px 0; page-break-inside: avoid; }
  .diagram svg { max-width: 100%; height: auto; }
  hr { border: none; border-top: 1px solid #d1d5db; margin: 30px 0; }
  ul, ol { padding-left: 25px; }
  li { margin: 4px 0; }
  a { color: #2563eb; }
  .toc { page-break-after: always; }
  .toc h2 { page-break-before: avoid; }
</style></head><body>`;

  // Portada
  html += `
  <div class="cover">
    <h1>TodoStock S.A.</h1>
    <div class="subtitle">Sistema de Gestión para Distribuidora Mayorista</div>
    <p style="font-size:12pt;color:#4b5563;">Desarrollo de Sistemas Web (Back End) 2</p>
    <p style="font-size:12pt;color:#4b5563;margin-bottom:40px;">IFTS 29 &mdash; 1&deg; Cuatrimestre 2026</p>
    <div class="meta">
      <p><strong>Grupo 2</strong></p>
      <p>Benitez Guillermo &bull; Benitez Julian<br>Moreno Diego &bull; Vigo Lucrecia<br>Vivar Edison Cristian</p>
    </div>
  </div>`;

  // Contenido principal
  html += bodyHtml;

  // Inyectar diagramas SVG después del título de la sección 5
  if (svgs.length > 0) {
    const heading5 = '<h2 id="5-diagramas-uml">5. Diagramas UML</h2>';
    let diagramHtml = '<p>Los siguientes diagramas fueron generados con Mermaid y describen la arquitectura del sistema.</p>';
    for (const svg of svgs) {
      diagramHtml += `<h3>${svg.title}</h3><div class="diagram">${svg.svg}</div>`;
    }
    html = html.replace(heading5, heading5 + diagramHtml);
  }

  html += `</body></html>`;

  // 4. Generar PDF
  console.log('Paso 3/3: Generando PDF...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  await page.pdf({
    path: OUTPUT_FILE,
    format: 'A4',
    margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8pt;text-align:center;width:100%;color:#999;">TodoStock S.A. &mdash; Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>'
  });

  await browser.close();
  const stats = fs.statSync(OUTPUT_FILE);
  console.log(`\n✅ PDF generado: ${OUTPUT_FILE} (${(stats.size / 1024).toFixed(1)} KB)`);
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
