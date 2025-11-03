import jsPDF from 'jspdf'
import JsBarcode from 'jsbarcode'

interface LabelData {
  productName: string
  brand: string
  originalPrice: number
  newPrice: number
  discount: number
  newBarcode: string
  expirationDate: string
  storeName: string
}

export const labelGenerator = {
  async generateSingleLabel(data: LabelData): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150],
    })

    const barcodeDataUrl = this.generateBarcodeImage(data.newBarcode)

    pdf.setFillColor(255, 255, 255)
    pdf.rect(0, 0, 100, 150, 'F')

    pdf.setDrawColor(231, 76, 60)
    pdf.setLineWidth(2)
    pdf.rect(2, 2, 96, 146)

    pdf.setFillColor(231, 76, 60)
    pdf.rect(2, 2, 96, 20, 'F')

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('PROMOÇÃO', 50, 14, { align: 'center' })

    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text(data.productName, 50, 30, { align: 'center', maxWidth: 90 })

    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.text(data.brand, 50, 38, { align: 'center' })

    pdf.setFontSize(10)
    pdf.text('DE:', 10, 50)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.text(this.formatCurrency(data.originalPrice), 25, 50)
    pdf.setDrawColor(0, 0, 0)
    pdf.setLineWidth(0.5)
    pdf.line(25, 48, 55, 48)

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('POR:', 10, 60)
    pdf.setTextColor(231, 76, 60)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(24)
    pdf.text(this.formatCurrency(data.newPrice), 50, 65, { align: 'center' })

    pdf.setFillColor(231, 76, 60)
    pdf.circle(85, 60, 12, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(14)
    pdf.text(`-${data.discount}%`, 85, 63, { align: 'center' })

    if (barcodeDataUrl) {
      pdf.addImage(barcodeDataUrl, 'PNG', 15, 75, 70, 35)
    }

    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.text(data.newBarcode, 50, 115, { align: 'center' })

    pdf.setFontSize(7)
    pdf.text(`Válido até: ${this.formatDate(data.expirationDate)}`, 50, 125, { align: 'center' })
    pdf.text(data.storeName, 50, 131, { align: 'center' })

    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.3)
    pdf.line(5, 140, 95, 140)

    pdf.setFontSize(6)
    pdf.setTextColor(150, 150, 150)
    pdf.text('Drogarias Líder - Sistema Prazo', 50, 145, { align: 'center' })

    return pdf.output('blob')
  },

  async generateMultipleLabels(dataArray: LabelData[]): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const labelsPerRow = 2
    const labelsPerColumn = 3
    const labelWidth = 100
    const labelHeight = 150
    const marginX = 5
    const marginY = 5
    const spacingX = 5
    const spacingY = 5

    let currentPage = 0
    const labelsPerPage = labelsPerRow * labelsPerColumn

    for (let i = 0; i < dataArray.length; i++) {
      const pageIndex = Math.floor(i / labelsPerPage)
      const indexInPage = i % labelsPerPage
      const row = Math.floor(indexInPage / labelsPerRow)
      const col = indexInPage % labelsPerRow

      if (pageIndex > currentPage) {
        pdf.addPage()
        currentPage = pageIndex
      }

      const x = marginX + col * (labelWidth + spacingX)
      const y = marginY + row * (labelHeight + spacingY)

      await this.drawLabelOnPDF(pdf, dataArray[i], x, y, labelWidth, labelHeight)
    }

    return pdf.output('blob')
  },

  async drawLabelOnPDF(
    pdf: jsPDF,
    data: LabelData,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const barcodeDataUrl = this.generateBarcodeImage(data.newBarcode)

    pdf.setFillColor(255, 255, 255)
    pdf.rect(x, y, width, height, 'F')

    pdf.setDrawColor(231, 76, 60)
    pdf.setLineWidth(2)
    pdf.rect(x + 2, y + 2, width - 4, height - 4)

    pdf.setFillColor(231, 76, 60)
    pdf.rect(x + 2, y + 2, width - 4, 20, 'F')

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('PROMOÇÃO', x + width / 2, y + 14, { align: 'center' })

    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text(data.productName, x + width / 2, y + 30, { align: 'center', maxWidth: 90 })

    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.text(data.brand, x + width / 2, y + 38, { align: 'center' })

    pdf.setFontSize(10)
    pdf.text('DE:', x + 10, y + 50)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.text(this.formatCurrency(data.originalPrice), x + 25, y + 50)
    pdf.setDrawColor(0, 0, 0)
    pdf.setLineWidth(0.5)
    pdf.line(x + 25, y + 48, x + 55, y + 48)

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('POR:', x + 10, y + 60)
    pdf.setTextColor(231, 76, 60)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(24)
    pdf.text(this.formatCurrency(data.newPrice), x + width / 2, y + 65, { align: 'center' })

    pdf.setFillColor(231, 76, 60)
    pdf.circle(x + 85, y + 60, 12, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(14)
    pdf.text(`-${data.discount}%`, x + 85, y + 63, { align: 'center' })

    if (barcodeDataUrl) {
      pdf.addImage(barcodeDataUrl, 'PNG', x + 15, y + 75, 70, 35)
    }

    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.text(data.newBarcode, x + width / 2, y + 115, { align: 'center' })

    pdf.setFontSize(7)
    pdf.text(`Válido até: ${this.formatDate(data.expirationDate)}`, x + width / 2, y + 125, { align: 'center' })
    pdf.text(data.storeName, x + width / 2, y + 131, { align: 'center' })
  },

  generateBarcodeImage(barcode: string): string | null {
    try {
      const canvas = document.createElement('canvas')
      JsBarcode(canvas, barcode, {
        format: 'CODE128',
        width: 2,
        height: 80,
        displayValue: false,
        margin: 10,
      })
      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Erro ao gerar código de barras:', error)
      return null
    }
  },

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  },

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  },

  downloadLabel(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },
}