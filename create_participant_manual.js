const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel,
        AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign, PageBreak,
        LevelFormat, PageNumber, Footer, Header } = require('docx');

// Core Values Recovery brand colors
const NAVY = "1D4486";
const GOLD = "D4AA4C";
const GRAY = "666666";

// Read the markdown file
const markdown = fs.readFileSync('/Users/cjoh/Dropbox (Maestral)/coaching101/Participant_Manual.md', 'utf8');
const lines = markdown.split('\n');

// Helper to remove emojis from text
function removeEmojis(text) {
  return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
}

// Helper to create styled paragraphs
function createParagraph(text, opts = {}) {
  const { heading, bold, italic, color, alignment, spaceBefore, spaceAfter, numbering } = opts;
  const cleanText = removeEmojis(text);
  // Only set font for non-heading paragraphs (headings use paragraph style fonts)
  const textRunOpts = { text: cleanText, bold, italics: italic, color: color || "000000" };
  if (!heading) {
    textRunOpts.font = "Roboto Condensed";
  }
  return new Paragraph({
    heading,
    alignment: alignment || AlignmentType.LEFT,
    spacing: { before: spaceBefore || 0, after: spaceAfter || 0 },
    numbering,
    children: [new TextRun(textRunOpts)]
  });
}

// Parse markdown to document elements
const children = [];
let inCodeBlock = false;
let currentTable = null;
let tableRows = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Skip empty lines at document start
  if (children.length === 0 && line.trim() === '') continue;

  // Code blocks
  if (line.startsWith('```')) {
    inCodeBlock = !inCodeBlock;
    continue;
  }
  if (inCodeBlock) continue;

  // Title (# at start)
  if (line.startsWith('# ') && !line.startsWith('## ')) {
    children.push(createParagraph(line.substring(2), {
      heading: HeadingLevel.TITLE,
      color: NAVY,
      alignment: AlignmentType.CENTER,
      spaceBefore: 240,
      spaceAfter: 240
    }));
  }
  // H2
  else if (line.startsWith('## ') && !line.startsWith('### ')) {
    if (children.length > 0) children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(createParagraph(line.substring(3), {
      heading: HeadingLevel.HEADING_1,
      color: NAVY,
      spaceBefore: 360,
      spaceAfter: 240
    }));
  }
  // H3
  else if (line.startsWith('### ') && !line.startsWith('#### ')) {
    children.push(createParagraph(line.substring(4), {
      heading: HeadingLevel.HEADING_2,
      color: NAVY,
      spaceBefore: 240,
      spaceAfter: 180
    }));
  }
  // H4
  else if (line.startsWith('#### ')) {
    children.push(createParagraph(line.substring(5), {
      heading: HeadingLevel.HEADING_3,
      color: GRAY,
      bold: true,
      spaceBefore: 180,
      spaceAfter: 120
    }));
  }
  // Horizontal rule
  else if (line.trim() === '---') {
    children.push(new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [new TextRun({ text: "━".repeat(50), color: GOLD })]
    }));
  }
  // Bullet list
  else if (line.match(/^[-*•]\s+/)) {
    const text = removeEmojis(line.replace(/^[-*•]\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1'));
    children.push(new Paragraph({
      numbering: { reference: "bullet-list", level: 0 },
      spacing: { after: 60 },
      children: [new TextRun({ text, font: "Roboto Condensed" })]
    }));
  }
  // Numbered list
  else if (line.match(/^\d+\.\s+/)) {
    const text = removeEmojis(line.replace(/^\d+\.\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1'));
    children.push(new Paragraph({
      numbering: { reference: "numbered-list-" + i, level: 0 },
      spacing: { after: 60 },
      children: [new TextRun({ text, font: "Roboto Condensed" })]
    }));
  }
  // Table detection (markdown tables)
  else if (line.includes('|') && line.trim().startsWith('|')) {
    // Skip table separator lines
    if (line.match(/^\|[\s\-:]+\|/)) continue;

    const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
    tableRows.push(cells);

    // Check if next line is not a table - finalize table
    if (i + 1 >= lines.length || !lines[i + 1].includes('|')) {
      if (tableRows.length > 0) {
        const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: GRAY };
        const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };
        const colWidth = Math.floor(9360 / tableRows[0].length);

        children.push(new Table({
          columnWidths: Array(tableRows[0].length).fill(colWidth),
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          rows: tableRows.map((row, rowIdx) => new TableRow({
            tableHeader: rowIdx === 0,
            children: row.map(cellText => new TableCell({
              borders: cellBorders,
              width: { size: colWidth, type: WidthType.DXA },
              shading: rowIdx === 0 ? { fill: NAVY, type: ShadingType.CLEAR } : undefined,
              verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({
                children: [new TextRun({
                  text: removeEmojis(cellText.replace(/\*\*(.*?)\*\*/g, '$1')),
                  bold: rowIdx === 0,
                  color: rowIdx === 0 ? "FFFFFF" : "000000",
                  font: "Roboto Condensed"
                })]
              })]
            }))
          }))
        }));
        tableRows = [];
      }
    }
  }
  // Bold emphasis **text**
  else if (line.includes('**')) {
    const parts = line.split(/\*\*(.*?)\*\*/);
    const runs = parts.map((part, idx) =>
      new TextRun({ text: removeEmojis(part), bold: idx % 2 === 1, font: "Roboto Condensed" })
    );
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: runs
    }));
  }
  // Regular paragraph
  else if (line.trim()) {
    // Replace markdown bold
    const text = removeEmojis(line.replace(/\*\*(.*?)\*\*/g, '$1'));
    children.push(createParagraph(text, { spaceAfter: 120 }));
  }
  // Empty line
  else {
    children.push(new Paragraph({ children: [new TextRun("")] }));
  }
}

// Create document with Core Values styling
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Roboto Condensed", size: 22 } }
    },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 56, bold: true, color: NAVY, font: "Bebas Neue" },
        paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: NAVY, font: "Bebas Neue" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, color: NAVY, font: "Bebas Neue" },
        paragraph: { spacing: { before: 240, after: 180 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: GRAY, font: "Bebas Neue" },
        paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      ...Array.from({ length: 100 }, (_, i) => ({
        reference: `numbered-list-${i}`,
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      }))
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Coaching 101 Participant Workbook | Version 1.0 | Core Values Recovery  |  Page ", size: 18, color: GRAY, font: "Roboto Condensed" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GRAY, font: "Roboto Condensed" })
          ]
        })]
      })
    },
    children
  }]
});

// Save the document
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/Users/cjoh/Dropbox (Maestral)/coaching101/Participant_Manual.docx", buffer);
  console.log("✅ Participant Manual created successfully!");
  console.log("📄 File: /Users/cjoh/Dropbox (Maestral)/coaching101/Participant_Manual.docx");
  console.log("🎨 Core Values branding applied (Navy #1D4486 & Gold #D4AA4C)");
});
