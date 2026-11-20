// ==================== KONVERTERA FILER (100 % LOKALT I WEBBLÄSAREN) ====================
(() => {
  const convertState = {
    file: null,
    fileType: null, // 'pdf' | 'docx' | 'excel'
    baseName: '',
    targetFormat: null, // 'xlsx' | 'docx' | 'pdf'
    arrayBuffer: null,
    workbook: null,
    sheetNames: [],
    selectedSheet: '',
    pdfPages: [], // [{ pageNum, rows: string[][] }]
    docxHtml: '',
    previewRows: [], // string[][]
    previewTitle: '',
    isProcessing: false
  };

  function setupPdfWorker() {
    if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  }

  function formatBytes(bytes) {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Sanera tecken som jsPDF:s standardfont (WinAnsi) inte stöder
  function sanitizePdfText(str) {
    return String(str ?? '')
      .replace(/\u2022/g, '-')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\u00A0/g, ' ')
      .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, ' ');
  }

  function detectFileType(fileName) {
    const lower = (fileName || '').toLowerCase();
    if (lower.endsWith('.pdf')) return 'pdf';
    if (lower.endsWith('.docx')) return 'docx';
    if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) return 'excel';
    return null;
  }

  function setStatus(msg, isError = false) {
    const el = document.getElementById('convert-status');
    if (!el) return;
    if (!msg) {
      el.classList.add('hidden');
      el.textContent = '';
      return;
    }
    el.classList.remove('hidden', 'text-rose-400', 'bg-rose-500/10', 'border-rose-500/30', 'text-sky-300', 'bg-sky-500/10', 'border-sky-500/30');
    if (isError) {
      el.classList.add('text-rose-400', 'bg-rose-500/10', 'border-rose-500/30');
    } else {
      el.classList.add('text-sky-300', 'bg-sky-500/10', 'border-sky-500/30');
    }
    el.textContent = msg;
  }

  // ==================== PDF: KOORDINATBASERAD RAD- & KOLUMNEXTRAHERING ====================
  async function extractPdfStructuredPages(arrayBuffer) {
    setupPdfWorker();
    if (!window.pdfjsLib) {
      throw new Error('PDF.js kunde inte laddas. Kontrollera internetanslutningen.');
    }
    const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const pages = [];

    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      const rawItems = (content.items || [])
        .map(it => {
          const text = String(it.str || '').replace(/\s+/g, ' ').trim();
          const x = it.transform ? it.transform[4] : 0;
          const y = it.transform ? it.transform[5] : 0;
          const w = it.width || 0;
          const h = it.height || (it.transform ? Math.abs(it.transform[3]) : 10) || 10;
          return { text, x, y, w, h };
        })
        .filter(it => it.text !== '');

      if (!rawItems.length) continue;

      // Sortera uppifrån och ner (störst Y först i PDF-koordinater), sedan vänster till höger
      rawItems.sort((a, b) => b.y - a.y || a.x - b.x);

      // Gruppera till visuella rader utifrån Y-koordinat
      const rowsByY = [];
      for (const item of rawItems) {
        const tol = Math.max(3.5, item.h * 0.45);
        let targetRow = null;
        for (const r of rowsByY) {
          if (Math.abs(r.y - item.y) <= tol) {
            targetRow = r;
            break;
          }
        }
        if (!targetRow) {
          targetRow = { y: item.y, items: [] };
          rowsByY.push(targetRow);
        }
        targetRow.items.push(item);
      }

      // Sortera element inom varje rad från vänster till höger och slå ihop närliggande textfragment i samma cell
      const mergedRows = rowsByY.map(r => {
        r.items.sort((a, b) => a.x - b.x);
        const cells = [];
        for (const it of r.items) {
          const prev = cells[cells.length - 1];
          if (prev) {
            const gap = it.x - (prev.x + prev.w);
            const spaceThreshold = Math.max(4, it.h * 0.65);
            if (gap <= spaceThreshold) {
              prev.text = `${prev.text} ${it.text}`.replace(/\s+/g, ' ').trim();
              prev.w = Math.max(prev.w, (it.x + it.w) - prev.x);
              continue;
            }
          }
          cells.push({ x: it.x, w: it.w, text: it.text });
        }
        return cells;
      });

      // Klustra X-positioner över sidan för att återskapa kolumner i rätt ordning
      const allX = mergedRows.flatMap(r => r.map(c => c.x)).sort((a, b) => a - b);
      const colAnchors = [];
      const colTolerance = 18;
      for (const x of allX) {
        const existing = colAnchors.find(ax => Math.abs(ax - x) <= colTolerance);
        if (existing === undefined) {
          colAnchors.push(x);
        }
      }
      colAnchors.sort((a, b) => a - b);

      // Placera varje cell i närmaste kolumn-index om sidan har tabellstruktur
      const structuredRows = mergedRows
        .map(cells => {
          if (colAnchors.length <= 1) {
            return [cells.map(c => c.text).join(' ').trim()];
          }
          const rowArr = new Array(colAnchors.length).fill('');
          for (const c of cells) {
            let bestIdx = 0;
            let bestDist = Infinity;
            for (let i = 0; i < colAnchors.length; i++) {
              const d = Math.abs(colAnchors[i] - c.x);
              if (d < bestDist) {
                bestDist = d;
                bestIdx = i;
              }
            }
            rowArr[bestIdx] = rowArr[bestIdx] ? `${rowArr[bestIdx]} ${c.text}` : c.text;
          }
          return rowArr;
        })
        // Rensa bort helt tomma skräprader
        .filter(row => row.some(cell => cell.trim() !== ''));

      if (structuredRows.length) {
        pages.push({ pageNum: p, rows: structuredRows });
      }
    }

    return pages;
  }

  function compactEmptyColumns(aoa) {
    if (!aoa.length) return [];
    const maxCols = Math.max(...aoa.map(r => r.length));
    const nonEmptyColIndices = [];
    for (let c = 0; c < maxCols; c++) {
      if (aoa.some(r => (r[c] || '').trim() !== '')) {
        nonEmptyColIndices.push(c);
      }
    }
    return aoa
      .map(r => nonEmptyColIndices.map(c => (r[c] || '').trim()))
      .filter(r => r.some(cell => cell !== ''));
  }

  // ==================== EXCEL -> AOA ====================
  function getExcelSheetRows(sheetName) {
    if (!convertState.workbook) return [];
    const sheet = convertState.workbook.Sheets[sheetName];
    if (!sheet) return [];
    const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    const cleaned = aoa
      .map(row => (Array.isArray(row) ? row.map(cell => String(cell ?? '').trim()) : []))
      .filter(row => row.some(cell => cell !== ''));
    return compactEmptyColumns(cleaned);
  }

  // ==================== WORD (.DOCX) -> HTML & PREVIEW ====================
  function extractDocxBlocks(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html || '', 'text/html');
    const blocks = [];

    function walk(node) {
      for (const child of node.children) {
        const tag = child.tagName.toLowerCase();
        if (tag === 'table') {
          const rows = [...child.querySelectorAll('tr')].map(tr =>
            [...tr.querySelectorAll('th,td')].map(td => td.textContent.replace(/\s+/g, ' ').trim())
          ).filter(r => r.some(c => c !== ''));
          if (rows.length) blocks.push({ type: 'table', rows });
        } else if (tag === 'ul' || tag === 'ol') {
          const items = [...child.querySelectorAll(':scope > li')].map((li, idx) => {
            const prefix = tag === 'ol' ? `${idx + 1}. ` : '- ';
            return prefix + li.textContent.replace(/\s+/g, ' ').trim();
          }).filter(Boolean);
          if (items.length) blocks.push({ type: 'list', items });
        } else if (/^h[1-6]$/.test(tag)) {
          const text = child.textContent.replace(/\s+/g, ' ').trim();
          if (text) blocks.push({ type: 'heading', level: Number(tag[1]), text });
        } else if (tag === 'p') {
          const text = child.textContent.replace(/\s+/g, ' ').trim();
          if (text) blocks.push({ type: 'paragraph', text });
        } else if (child.children && child.children.length) {
          walk(child);
        } else {
          const text = child.textContent.replace(/\s+/g, ' ').trim();
          if (text) blocks.push({ type: 'paragraph', text });
        }
      }
    }

    walk(doc.body);
    return blocks;
  }

  // ==================== FILINLÄSNING & UI-UPPDATERING ====================
  async function handleFileSelected(file) {
    if (!file) return;
    const fileType = detectFileType(file.name);
    if (!fileType) {
      setStatus('Filformatet stöds inte. Välj en PDF (.pdf), Word (.docx) eller Excel (.xlsx / .xls).', true);
      return;
    }

    convertState.file = file;
    convertState.fileType = fileType;
    convertState.baseName = file.name.replace(/\.[^.]+$/, '');
    convertState.pdfPages = [];
    convertState.docxHtml = '';
    convertState.workbook = null;
    convertState.sheetNames = [];
    convertState.selectedSheet = '';
    convertState.previewRows = [];
    convertState.isProcessing = true;

    // Standardmålformat baserat på uppladdad fil
    convertState.targetFormat = fileType === 'pdf' ? 'xlsx' : 'pdf';

    renderConvertControls();
    setStatus('Läser in fil lokalt i webbläsaren...');

    try {
      const buffer = await file.arrayBuffer();
      convertState.arrayBuffer = buffer;

      if (fileType === 'pdf') {
        convertState.pdfPages = await extractPdfStructuredPages(buffer);
        const allRows = compactEmptyColumns(convertState.pdfPages.flatMap(p => p.rows));
        convertState.previewRows = allRows;
        convertState.previewTitle = `${convertState.pdfPages.length} sida/sidor • ${allRows.length} rader`;
        if (!allRows.length) {
          setStatus('Kunde inte hitta någon extraherbar text i PDF:en (den kan vara skannad som bild).', true);
        } else {
          setStatus('');
        }
      } else if (fileType === 'docx') {
        if (!window.mammoth) {
          throw new Error('Mammoth.js kunde inte laddas.');
        }
        const res = await window.mammoth.convertToHtml({ arrayBuffer: buffer });
        convertState.docxHtml = res.value || '';
        const blocks = extractDocxBlocks(convertState.docxHtml);
        convertState.previewTitle = `${blocks.length} innehållsblock i Word-dokumentet`;
        setStatus('');
      } else if (fileType === 'excel') {
        if (!window.XLSX) {
          throw new Error('SheetJS (XLSX) kunde inte laddas.');
        }
        const wb = window.XLSX.read(new Uint8Array(buffer), { type: 'array' });
        convertState.workbook = wb;
        convertState.sheetNames = wb.SheetNames || [];
        convertState.selectedSheet = convertState.sheetNames[0] || '';
        convertState.previewRows = getExcelSheetRows(convertState.selectedSheet);
        convertState.previewTitle = `Blad: ${convertState.selectedSheet} • ${convertState.previewRows.length} rader`;
        setStatus('');
      }
    } catch (err) {
      setStatus(`Kunde inte läsa filen: ${err.message}`, true);
    } finally {
      convertState.isProcessing = false;
      renderConvertControls();
      renderConvertPreview();
    }
  }

  function setConvertTargetFormat(fmt) {
    convertState.targetFormat = fmt;
    renderConvertControls();
    renderConvertPreview();
  }

  function setConvertExcelSheet(sheetName) {
    convertState.selectedSheet = sheetName;
    convertState.previewRows = getExcelSheetRows(sheetName);
    convertState.previewTitle = `Blad: ${sheetName} • ${convertState.previewRows.length} rader`;
    renderConvertPreview();
  }

  function resetConverter() {
    convertState.file = null;
    convertState.fileType = null;
    convertState.baseName = '';
    convertState.targetFormat = null;
    convertState.arrayBuffer = null;
    convertState.workbook = null;
    convertState.sheetNames = [];
    convertState.selectedSheet = '';
    convertState.pdfPages = [];
    convertState.docxHtml = '';
    convertState.previewRows = [];
    convertState.previewTitle = '';
    const input = document.getElementById('convert-file-input');
    if (input) input.value = '';
    setStatus('');
    renderConvertControls();
    renderConvertPreview();
  }

  function renderConvertControls() {
    const fileInfoBar = document.getElementById('convert-file-info');
    const fileNameEl = document.getElementById('convert-file-name');
    const fileMetaEl = document.getElementById('convert-file-meta');
    const targetSection = document.getElementById('convert-target-section');
    const targetButtonsEl = document.getElementById('convert-target-buttons');
    const sheetWrapper = document.getElementById('convert-sheet-wrapper');
    const sheetSelect = document.getElementById('convert-sheet-select');
    const exportBtn = document.getElementById('convert-export-btn');

    if (!fileInfoBar || !targetSection || !targetButtonsEl) return;

    if (!convertState.file) {
      fileInfoBar.classList.add('hidden');
      targetSection.classList.add('hidden');
      if (exportBtn) exportBtn.disabled = true;
      return;
    }

    fileInfoBar.classList.remove('hidden');
    targetSection.classList.remove('hidden');

    const typeLabels = { pdf: 'PDF-dokument', docx: 'Word-dokument (.docx)', excel: 'Excel-fil' };
    if (fileNameEl) fileNameEl.textContent = convertState.file.name;
    if (fileMetaEl) fileMetaEl.textContent = `${typeLabels[convertState.fileType] || ''} • ${formatBytes(convertState.file.size)}`;

    if (sheetWrapper && sheetSelect) {
      if (convertState.fileType === 'excel' && convertState.sheetNames.length > 1) {
        sheetWrapper.classList.remove('hidden');
        sheetSelect.innerHTML = convertState.sheetNames
          .map(name => `<option value="${escapeHtml(name)}" ${name === convertState.selectedSheet ? 'selected' : ''}>${escapeHtml(name)}</option>`)
          .join('');
      } else {
        sheetWrapper.classList.add('hidden');
      }
    }

    const options = convertState.fileType === 'pdf'
      ? [
          {
            id: 'xlsx',
            title: 'Till Excel (.xlsx)',
            desc: 'Återskapar rader och kolumner via X/Y-koordinater',
            icon: 'fa-file-excel',
            color: 'emerald'
          },
          {
            id: 'docx',
            title: 'Till Word (.docx)',
            desc: 'Bevarar tabeller, rader och listor som riktiga Word-tabeller',
            icon: 'fa-file-word',
            color: 'sky'
          }
        ]
      : [
          {
            id: 'pdf',
            title: 'Till PDF (.pdf)',
            desc: convertState.fileType === 'docx'
              ? 'Renderar text och tabeller till en ren, utskriftsvänlig PDF'
              : 'Anpassar kolumner och layout så att allt ryms snyggt på sidan',
            icon: 'fa-file-pdf',
            color: 'rose'
          }
        ];

    targetButtonsEl.innerHTML = options.map(opt => {
      const active = convertState.targetFormat === opt.id;
      const borderCls = active
        ? `border-${opt.color}-500 bg-${opt.color}-500/15 ring-2 ring-${opt.color}-500/40`
        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 hover:border-slate-400 dark:hover:border-slate-500';
      return `
        <button type="button" onclick="window.portalConverter.setTargetFormat('${opt.id}')" class="p-4 rounded-2xl border text-left transition flex items-center gap-3.5 ${borderCls}">
          <div class="w-11 h-11 rounded-xl bg-${opt.color}-500/20 text-${opt.color}-400 flex items-center justify-center text-xl shrink-0">
            <i class="fa-solid ${opt.icon}"></i>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-extrabold text-slate-900 dark:text-white">${opt.title}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${opt.desc}</div>
          </div>
        </button>
      `;
    }).join('');

    if (exportBtn) {
      const hasData = convertState.fileType === 'docx'
        ? Boolean(convertState.docxHtml)
        : convertState.previewRows.length > 0;
      exportBtn.disabled = convertState.isProcessing || !hasData;
    }
  }

  function renderConvertPreview() {
    const section = document.getElementById('convert-preview-section');
    const titleEl = document.getElementById('convert-preview-title');
    const bodyEl = document.getElementById('convert-preview-body');
    if (!section || !bodyEl) return;

    if (!convertState.file || convertState.isProcessing) {
      section.classList.add('hidden');
      bodyEl.innerHTML = '';
      return;
    }

    if (convertState.fileType === 'docx') {
      if (!convertState.docxHtml) {
        section.classList.add('hidden');
        return;
      }
      section.classList.remove('hidden');
      if (titleEl) titleEl.textContent = convertState.previewTitle || 'Förhandsvisning av Word-dokument';
      bodyEl.innerHTML = `
        <div class="p-5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs sm:text-sm space-y-2.5 leading-relaxed convert-docx-preview">
          ${convertState.docxHtml}
        </div>
      `;
      return;
    }

    const rows = convertState.previewRows || [];
    if (!rows.length) {
      section.classList.add('hidden');
      return;
    }

    section.classList.remove('hidden');
    const maxPreviewRows = 100;
    const slice = rows.slice(0, maxPreviewRows);
    const colCount = Math.max(...slice.map(r => r.length));
    if (titleEl) {
      const extra = rows.length > maxPreviewRows ? ` (visar första ${maxPreviewRows})` : '';
      titleEl.textContent = `${convertState.previewTitle || ''} • ${colCount} kolumner${extra}`;
    }

    const headerRow = slice[0] || [];
    const dataRows = slice.slice(1);

    bodyEl.innerHTML = `
      <table class="w-full text-left border-collapse text-xs">
        <thead class="sticky top-0 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-sky-200 font-bold border-b border-slate-300 dark:border-slate-700">
          <tr>
            ${Array.from({ length: colCount }, (_, idx) => `<th class="py-2.5 px-3 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">${escapeHtml(headerRow[idx] || `Kolumn ${idx + 1}`)}</th>`).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200/70 dark:divide-slate-800">
          ${dataRows.map(row => `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              ${Array.from({ length: colCount }, (_, idx) => `<td class="py-2 px-3 border-r border-slate-200/60 dark:border-slate-800/80 text-slate-700 dark:text-slate-200">${escapeHtml(row[idx] || '')}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // ==================== EXPORTERING ====================
  function triggerBlobDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async function exportConvertedFile() {
    if (!convertState.file || !convertState.targetFormat) return;
    const outName = `${convertState.baseName}.${convertState.targetFormat}`;

    try {
      if (convertState.fileType === 'pdf' && convertState.targetFormat === 'xlsx') {
        const rows = convertState.previewRows;
        if (!rows.length) throw new Error('Ingen data att exportera.');
        const ws = window.XLSX.utils.aoa_to_sheet(rows);
        const colCount = Math.max(...rows.map(r => r.length));
        ws['!cols'] = Array.from({ length: colCount }, (_, c) => {
          const maxLen = rows.reduce((m, r) => Math.max(m, String(r[c] || '').length), 8);
          return { wch: Math.min(60, maxLen + 3) };
        });
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, 'Konverterad PDF');
        window.XLSX.writeFile(wb, outName);
      } else if (convertState.fileType === 'pdf' && convertState.targetFormat === 'docx') {
        if (!window.docx) throw new Error('Biblioteket docx kunde inte laddas.');
        const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, ShadingType, TextRun, BorderStyle } = window.docx;

        const children = [];
        for (const page of convertState.pdfPages) {
          if (convertState.pdfPages.length > 1) {
            children.push(new Paragraph({
              children: [new TextRun({ text: `Sida ${page.pageNum}`, bold: true, size: 22, color: '4F46E5' })],
              spacing: { before: page.pageNum > 1 ? 240 : 0, after: 120 }
            }));
          }

          // Gruppera konsekutiva flerkolumnsrader till riktiga Word-tabeller
          let idx = 0;
          while (idx < page.rows.length) {
            const row = page.rows[idx];
            const nonEmptyCount = row.filter(c => c !== '').length;
            const looksLikeTable = row.length >= 2 && nonEmptyCount >= 2;

            if (looksLikeTable) {
              const tableRows = [];
              while (idx < page.rows.length && page.rows[idx].length >= 2 && page.rows[idx].filter(c => c !== '').length >= 2) {
                tableRows.push(page.rows[idx]);
                idx++;
              }
              const maxCols = Math.max(...tableRows.map(r => r.length));
              const wordRows = tableRows.map((r, rIdx) =>
                new TableRow({
                  tableHeader: rIdx === 0,
                  children: Array.from({ length: maxCols }, (_, cIdx) =>
                    new TableCell({
                      shading: rIdx === 0 ? { fill: 'E2E8F0', type: ShadingType.CLEAR } : undefined,
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                        left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                        right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' }
                      },
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: r[cIdx] || '', bold: rIdx === 0, size: 20 })]
                        })
                      ]
                    })
                  )
                })
              );
              children.push(new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: wordRows
              }));
              children.push(new Paragraph({ text: '', spacing: { after: 120 } }));
            } else {
              const lineText = row.filter(Boolean).join(' ').trim();
              if (lineText) {
                const isBullet = /^[•\-*]\s+/.test(lineText);
                children.push(new Paragraph({
                  text: isBullet ? lineText.replace(/^[•\-*]\s+/, '') : lineText,
                  bullet: isBullet ? { level: 0 } : undefined,
                  spacing: { after: 80 }
                }));
              }
              idx++;
            }
          }
        }

        const doc = new Document({ sections: [{ children }] });
        const blob = await Packer.toBlob(doc);
        triggerBlobDownload(blob, outName);
      } else if (convertState.fileType === 'docx' && convertState.targetFormat === 'pdf') {
        if (!window.jspdf || !window.jspdf.jsPDF) throw new Error('jsPDF kunde inte laddas.');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const blocks = extractDocxBlocks(convertState.docxHtml);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 14;
        const maxWidth = pageWidth - margin * 2;
        let y = margin;

        const ensureSpace = (needed) => {
          if (y + needed > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
        };

        for (const block of blocks) {
          if (block.type === 'heading') {
            const fontSize = block.level === 1 ? 16 : block.level === 2 ? 14 : 12;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(fontSize);
            const lines = doc.splitTextToSize(sanitizePdfText(block.text), maxWidth);
            ensureSpace(lines.length * (fontSize * 0.45) + 4);
            doc.text(lines, margin, y);
            y += lines.length * (fontSize * 0.45) + 3;
          } else if (block.type === 'paragraph') {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10.5);
            const lines = doc.splitTextToSize(sanitizePdfText(block.text), maxWidth);
            ensureSpace(lines.length * 5 + 3);
            doc.text(lines, margin, y);
            y += lines.length * 5 + 2.5;
          } else if (block.type === 'list') {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10.5);
            for (const itemText of block.items) {
              const lines = doc.splitTextToSize(sanitizePdfText(itemText), maxWidth - 4);
              ensureSpace(lines.length * 5 + 2);
              doc.text(lines, margin + 3, y);
              y += lines.length * 5 + 1.5;
            }
            y += 2;
          } else if (block.type === 'table' && block.rows.length) {
            const head = [block.rows[0].map(sanitizePdfText)];
            const body = block.rows.slice(1).map(r => r.map(sanitizePdfText));
            doc.autoTable({
              startY: y,
              head: body.length ? head : undefined,
              body: body.length ? body : head,
              margin: { left: margin, right: margin },
              styles: { font: 'helvetica', fontSize: 9, cellPadding: 2.5, overflow: 'linebreak' },
              headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: 'bold' },
              theme: 'grid'
            });
            y = (doc.lastAutoTable ? doc.lastAutoTable.finalY : y) + 6;
          }
        }

        doc.save(outName);
      } else if (convertState.fileType === 'excel' && convertState.targetFormat === 'pdf') {
        if (!window.jspdf || !window.jspdf.jsPDF) throw new Error('jsPDF kunde inte laddas.');
        const rows = convertState.previewRows;
        if (!rows.length) throw new Error('Kalkylbladet är tomt.');
        const colCount = Math.max(...rows.map(r => r.length));
        const orientation = colCount > 5 ? 'landscape' : 'portrait';
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(sanitizePdfText(`${convertState.baseName} (${convertState.selectedSheet})`), 12, 13);

        const head = [rows[0].map(sanitizePdfText)];
        const body = rows.slice(1).map(r => r.map(sanitizePdfText));
        const fontSize = colCount > 10 ? 7 : colCount > 7 ? 8 : 9;

        doc.autoTable({
          startY: 18,
          head: body.length ? head : undefined,
          body: body.length ? body : head,
          margin: { left: 10, right: 10, bottom: 12 },
          styles: {
            font: 'helvetica',
            fontSize,
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          theme: 'grid'
        });

        doc.save(outName);
      }

      if (typeof window.showToast === 'function') {
        window.showToast(`Filen "${outName}" har skapats och laddats ner!`);
      }
    } catch (err) {
      setStatus(`Kunde inte exportera filen: ${err.message}`, true);
    }
  }

  // ==================== INITIERING AV DRAG & DROP ====================
  function initConverter() {
    const dropzone = document.getElementById('convert-dropzone');
    const fileInput = document.getElementById('convert-file-input');
    if (!dropzone || !fileInput || dropzone.dataset.bound === '1') return;
    dropzone.dataset.bound = '1';

    fileInput.addEventListener('change', e => {
      const f = e.target.files?.[0];
      if (f) handleFileSelected(f);
    });

    ['dragenter', 'dragover'].forEach(evt => {
      dropzone.addEventListener(evt, e => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('border-indigo-500', 'bg-indigo-500/10');
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      dropzone.addEventListener(evt, e => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('border-indigo-500', 'bg-indigo-500/10');
      });
    });

    dropzone.addEventListener('drop', e => {
      const f = e.dataTransfer?.files?.[0];
      if (f) handleFileSelected(f);
    });
  }

  window.portalConverter = {
    init: initConverter,
    setTargetFormat: setConvertTargetFormat,
    setExcelSheet: setConvertExcelSheet,
    exportFile: exportConvertedFile,
    reset: resetConverter
  };

  window.addEventListener('DOMContentLoaded', initConverter);
})();
