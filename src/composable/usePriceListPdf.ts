import type { PriceList } from '@/types/price_list.ts'
import type { PriceListEntry } from '@/types/price_list_entry.ts'
import type { ShoppingListEntry } from '@/types/shopping_list_entry.ts'
import jsPDF from 'jspdf'
import autoTable, { type RowInput } from 'jspdf-autotable'
import logoUrl from '@/assets/logo.png'
import { formatPrice } from '@/composable/usePriceUtils.ts'

function loadImageAsBase64 (url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.addEventListener('load', () => {
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
    })
    img.addEventListener('error', () => {
      reject(new Error(`Bild konnte nicht geladen werden: ${url}`))
    })
    img.src = url
  })
}

// Berechnet Schrift- und Zeilengrößen, sodass alle Einträge auf eine Seite passen
function calculateLayoutSizes (entries: PriceListEntry[], availableHeight: number) {
  const SAFETY_MARGIN = 0.97 // 3% Puffer gegen Rundungsdifferenzen
  const safeAvailableHeight = availableHeight * SAFETY_MARGIN

  const hasSubtitleCount = entries.filter(e => e.subtitle).length
  const noSubtitleCount = entries.length - hasSubtitleCount

  // Grenzen, damit die Schrift weder unleserlich klein noch unnötig riesig wird
  const MIN_TITLE_FONT = 8
  const MAX_TITLE_FONT = 36
  const MIN_SUBTITLE_FONT = 6.5
  const MAX_SUBTITLE_FONT = 20

  // Verhältnisse, wie sie in der bisherigen Version verwendet wurden
  const SUBTITLE_FONT_RATIO = 20 / 24 // subTitleFontSize / titleFontSize
  const ROW_HEIGHT_RATIO = 30 / 24 // rowHeight / titleFontSize (Zeile ohne Subtitel)
  const SUBTITLE_ROW_HEIGHT_RATIO = 30 / 24 // subtitleRowHeight / titleFontSize (mit Subtitel)

  // Binäre Suche über die Titel-Schriftgröße, um die größte passende Größe zu finden
  let low = MIN_TITLE_FONT
  let high = MAX_TITLE_FONT
  let bestTitleFontSize = MIN_TITLE_FONT

  for (let i = 0; i < 25; i++) {
    const mid = (low + high) / 2
    const rowHeight = mid * ROW_HEIGHT_RATIO
    const subtitleRowHeight = mid * SUBTITLE_ROW_HEIGHT_RATIO

    const totalHeight = noSubtitleCount * rowHeight + hasSubtitleCount * subtitleRowHeight

    if (totalHeight <= safeAvailableHeight) {
      bestTitleFontSize = mid
      low = mid
    } else {
      high = mid
    }
  }

  const titleFontSize = Math.min(MAX_TITLE_FONT, Math.max(MIN_TITLE_FONT, bestTitleFontSize))
  const subTitleFontSize = Math.min(
    MAX_SUBTITLE_FONT,
    Math.max(MIN_SUBTITLE_FONT, titleFontSize * SUBTITLE_FONT_RATIO),
  )
  const rowHeight = titleFontSize * ROW_HEIGHT_RATIO
  const subtitleRowHeight = titleFontSize * SUBTITLE_ROW_HEIGHT_RATIO

  return { titleFontSize, subTitleFontSize, rowHeight, subtitleRowHeight }
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
    const marginBottom = 14

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
    const availableHeight = pageHeight - tableStartY - marginBottom

    // Nur aktivierte Einträge werden gedruckt – EINMAL filtern und
    // danach konsistent für Layout-Berechnung, body UND rowMeta verwenden
    const printableEntries = entries.filter(e => e.enabled)

    // Schrift- und Zeilengrößen so berechnen, dass alles auf eine Seite passt
    const { titleFontSize, subTitleFontSize, rowHeight, subtitleRowHeight } = calculateLayoutSizes(
      printableEntries,
      availableHeight,
    )

    const rowMeta = printableEntries.map(e => ({
      title: e.title,
      subtitle: e.subtitle,
      price: formatPrice(e.price),
    }))

    const body = <RowInput[]>printableEntries.map(() => ['', ''])

    // Titel der Liste – oben mittig, groß
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text(priceList.title, pageWidth / 2, 22, { align: 'center' })
    doc.setFont('helvetica', 'normal')

    // Zeilenabstand aus der Schriftgröße ableiten
    const titleLineHeight = titleFontSize * 0.35 * 1.15
    const subtitleLineHeight = subTitleFontSize * 0.35 * 1.15
    const titleSubtitleGap = titleFontSize * 0.1

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: marginLeft, right: marginRight, bottom: marginBottom },
      body,
      theme: 'plain',
      showHead: 'never',
      styles: { fontSize: titleFontSize, cellPadding: 1.5, minCellHeight: rowHeight },
      tableLineWidth: 0,
      tableLineColor: 255,
      rowPageBreak: 'avoid',
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
        const meta = rowMeta[data.row.index]
        if (!meta || data.row.section !== 'body') {
          return
        }

        const { x, y, height } = data.cell
        const padding = data.cell.padding('left')

        if (data.column.index === 0) {
          // Namensspalte: Titel (+ Subtitel)
          const textX = x + padding

          if (meta.subtitle) {
            const blockHeight = titleLineHeight + titleSubtitleGap + subtitleLineHeight
            const startY = y + (height - blockHeight) / 2

            doc.setFontSize(titleFontSize)
            doc.setTextColor(0)
            doc.text(meta.title, textX, startY + titleLineHeight * 0.75)

            doc.setFontSize(subTitleFontSize)
            doc.setTextColor(70)
            doc.text(
              meta.subtitle,
              textX,
              startY + titleLineHeight + titleSubtitleGap + subtitleLineHeight * 0.75,
            )
            doc.setTextColor(0)
          } else {
            doc.setFontSize(titleFontSize)
            doc.setTextColor(0)
            doc.text(meta.title, textX, y + height / 2 + titleLineHeight * 0.25)
          }
        }

        if (data.column.index === 1) {
          // Preisspalte: rechtsbündig, auf gleicher Baseline wie der Titel
          const textX = x + data.cell.width - data.cell.padding('right')

          const titleBaselineY = meta.subtitle
            ? y
            + (height - (titleLineHeight + titleSubtitleGap + subtitleLineHeight)) / 2
            + titleLineHeight * 0.75
            : y + height / 2 + titleLineHeight * 0.25

          doc.setFontSize(titleFontSize)
          doc.setTextColor(0)
          doc.text(meta.price, textX, titleBaselineY, { align: 'right' })
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
