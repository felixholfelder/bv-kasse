import type { ShoppingListEntry } from '@/types/shopping_list_entry.ts'
import jsPDF from 'jspdf'
import autoTable, { type RowInput } from 'jspdf-autotable'
import type { PriceListEntry } from '@/types/price_list_entry.ts'
import type { PriceList } from '@/types/price_list.ts'
import { formatPrice } from '@/composable/usePriceUtils.ts'
import logoUrl from '@/assets/logo.png'

function loadImageAsBase64 (url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas-Kontext konnte nicht erstellt werden'))
        return
      }
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = url
  })
}

export function usePriceListPdf () {
  let logoBase64Promise: Promise<string> | null = null
  function getLogoBase64 () {
    if (!logoBase64Promise) {
      logoBase64Promise = loadImageAsBase64(logoUrl)
    }
    return logoBase64Promise
  }

  async function printPriceList (entries: PriceListEntry[], priceList: PriceList) {
    const logoBase64 = await getLogoBase64()

    const doc = new jsPDF({ orientation: 'landscape' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const marginLeft = 14
    const marginRight = 14
    const rowHeight = 30
    const subtitleRowHeight = 30
    const titleFontSize = 24
    const subTitleFontSize = 20

    // Zeilenabstand aus der Schriftgröße ableiten (statt fest verdrahtet)
    const titleLineHeight = titleFontSize * 0.35 * 1.15      // ≈ 9.7mm bei 24pt
    const subtitleLineHeight = subTitleFontSize * 0.35 * 1.15 // ≈ 8.05mm bei 20pt
    const titleSubtitleGap = 2 // zusätzlicher Freiraum zwischen den beiden Zeilen

    const colWidths = {
      name: pageWidth - marginLeft - marginRight - 45,
      preis: 45,
    }

    function drawBackground () {
      const logoSize = 120
      const gState = new (doc as any).GState({ opacity: 0.08 })
      doc.saveGraphicsState()
      doc.setGState(gState)
      doc.addImage(
        logoBase64,
        'PNG',
        (pageWidth - logoSize) / 2,
        (pageHeight - logoSize) / 2,
        logoSize,
        logoSize,
      )
      doc.restoreGraphicsState()
    }

    drawBackground()

    const tableStartY = 36

    const rowMeta = entries.map(e => ({ title: e.title, subtitle: e.subtitle }))

    const body = <RowInput[]>entries.map(e => ['', formatPrice(e.price)])

    // Titel der Liste – oben mittig, groß
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text(priceList.title, pageWidth / 2, 22, { align: 'center' })
    doc.setFont('helvetica', 'normal')

    // Tabelle – ohne Kopfzeile, ohne farbige Hinterlegung, ohne Checkboxen
    autoTable(doc, {
      startY: tableStartY,
      body,
      theme: 'plain',
      showHead: 'never',
      styles: { fontSize: titleFontSize, cellPadding: 3.5, minCellHeight: rowHeight },
      tableLineWidth: 0,
      tableLineColor: 255,
      columnStyles: {
        0: { cellWidth: colWidths.name, lineWidth: 0 },
        1: { cellWidth: colWidths.preis, halign: 'right', lineWidth: 0 },
      },
      didParseCell (data) {
        if (data.column.index === 0 && data.row.section === 'body') {
          const meta = rowMeta[data.row.index]
          if (meta?.subtitle) {
            data.cell.styles.minCellHeight = subtitleRowHeight
          }
        }
      },
      didDrawCell (data) {
        if (data.column.index === 0 && data.row.section === 'body') {
          const meta = rowMeta[data.row.index]
          if (!meta) return

          const { x, y, height } = data.cell
          const textX = x + data.cell.padding('left')

          if (meta.subtitle) {
            const blockHeight = titleLineHeight + titleSubtitleGap + subtitleLineHeight
            const startY = y + (height - blockHeight) / 2

            doc.setFontSize(titleFontSize)
            doc.setTextColor(0)
            doc.text(meta.title, textX, startY + titleLineHeight * 0.75)

            doc.setFontSize(subTitleFontSize)
            doc.setTextColor(130)
            doc.text(meta.subtitle, textX, startY + titleLineHeight + titleSubtitleGap + subtitleLineHeight * 0.75)
            doc.setTextColor(0)
          } else {
            doc.setFontSize(titleFontSize)
            doc.setTextColor(0)
            doc.text(meta.title, textX, y + height / 2 + titleLineHeight * 0.25)
          }
        }
      },
      willDrawPage () {
        drawBackground()
      },
    })

    doc.autoPrint()
    window.open(doc.output('bloburl'), '_blank')
  }

  return { printPriceList }
}