import type { ShoppingListEntry } from '@/types/shopping_list_entry.ts'
import jsPDF from 'jspdf'
import autoTable, { type RowInput } from 'jspdf-autotable'

export function useShoppingListPdf () {
  function printShoppingList (entries: ShoppingListEntry[], title = 'Einkaufsliste') {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const marginLeft = 14
    const marginRight = 14
    const marginBottom = 14
    const rowHeight = 10

    const colWidths = {
      erledigt: 22,
      name: pageWidth - marginLeft - marginRight - 22 - 30 - 30,
      menge: 30,
      vorrat: 30,
    }

    // Calculate how many empty rows are needed to fill the page
    const tableStartY = 34
    const headerHeight = 10
    const availableHeight = pageHeight - tableStartY - headerHeight - marginBottom
    const totalRows = Math.floor(availableHeight / rowHeight)
    const emptyRowsNeeded = Math.max(0, totalRows - entries.length)

    const emptyRow = ['', '', '', '']
    const body = <RowInput[]>[
      ...entries.map(e => ['', e.name, e.amount, e.stock]),
      ...Array.from({ length: emptyRowsNeeded }).fill(emptyRow),
    ]

    // Titel
    doc.setFontSize(18)
    doc.text(title, marginLeft, 20)

    // Datum
    doc.setFontSize(10)
    doc.setTextColor(120)
    doc.text(`Erstellt am: ${new Date().toLocaleString('de-DE')}`, marginLeft, 28)
    doc.setTextColor(0)

    // Tabelle
    autoTable(doc, {
      startY: tableStartY,
      head: [['Erledigt', 'Name', 'Menge', 'Vorrat']],
      body, // @ts-ignore
      styles: { fontSize: 11, cellPadding: 2.5, minCellHeight: rowHeight },
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      tableLineWidth: 0,
      tableLineColor: 255,
      columnStyles: {
        0: { cellWidth: colWidths.erledigt, halign: 'center', lineWidth: 0 },
        1: { cellWidth: colWidths.name, lineWidth: 0 },
        2: { cellWidth: colWidths.menge, halign: 'center', lineWidth: 0 },
        3: { cellWidth: colWidths.vorrat, halign: 'center', lineWidth: 0 },
      },
      didDrawCell (data) {
        if (data.column.index === 0 && data.row.section === 'body') {
          const { x, y, height } = data.cell
          const size = 5
          const cx = x + 11
          const cy = y + height / 2 - size / 2
          doc.setDrawColor(80)
          doc.setLineWidth(0.4)
          doc.rect(cx, cy, size, size)
        }
      },
    })

    // Druckdialog öffnen
    doc.autoPrint()
    window.open(doc.output('bloburl'), '_blank')
  }

  return { printShoppingList }
}
