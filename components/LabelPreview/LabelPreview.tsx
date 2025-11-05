import { Download, Printer, Eye } from 'lucide-react'
import Button from '@/components/Button/Button'
import { labelGenerator } from '@/utils/labelGenerator'
import styles from './LabelPreview.module.css'

interface LabelPreviewProps {
  promotion: {
    id: string
    product_id: string
    discount: number
    new_price: number
    new_barcode: string
  }
  product: {
    name: string
    brand: string
    current_price: number
    expiration_date: string
  }
  storeName: string
}

export default function LabelPreview({ promotion, product, storeName }: LabelPreviewProps) {
  const handleDownload = async () => {
    try {
      const labelData = {
        productName: product.name,
        brand: product.brand,
        originalPrice: product.current_price,
        newPrice: promotion.new_price,
        discount: promotion.discount,
        newBarcode: promotion.new_barcode,
        expirationDate: product.expiration_date,
        storeName: storeName,
      }

      const blob = await labelGenerator.generateSingleLabel(labelData)
      const filename = `etiqueta-${promotion.new_barcode}-${Date.now()}.pdf`
      labelGenerator.downloadLabel(blob, filename)
    } catch (error) {
      alert('Erro ao gerar etiqueta')
    }
  }

  const handlePrint = async () => {
    try {
      const labelData = {
        productName: product.name,
        brand: product.brand,
        originalPrice: product.current_price,
        newPrice: promotion.new_price,
        discount: promotion.discount,
        newBarcode: promotion.new_barcode,
        expirationDate: product.expiration_date,
        storeName: storeName,
      }

      const blob = await labelGenerator.generateSingleLabel(labelData)
      const url = URL.createObjectURL(blob)
      const printWindow = window.open(url)
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print()
        })
      }
    } catch (error) {
      alert('Erro ao imprimir etiqueta')
    }
  }

  const handlePreview = async () => {
    try {
      const labelData = {
        productName: product.name,
        brand: product.brand,
        originalPrice: product.current_price,
        newPrice: promotion.new_price,
        discount: promotion.discount,
        newBarcode: promotion.new_barcode,
        expirationDate: product.expiration_date,
        storeName: storeName,
      }

      const blob = await labelGenerator.generateSingleLabel(labelData)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (error) {
      alert('Erro ao visualizar etiqueta')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.preview}>
        <div className={styles.labelMockup}>
          <div className={styles.labelHeader}>
            <span className={styles.labelTitle}>PROMOÇÃO</span>
          </div>
          <div className={styles.labelBody}>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.brand}>{product.brand}</p>
            <div className={styles.priceSection}>
              <div className={styles.oldPrice}>
                <span className={styles.priceLabel}>DE:</span>
                <span className={styles.priceValue}>{formatCurrency(product.current_price)}</span>
              </div>
              <div className={styles.newPriceWrapper}>
                <span className={styles.newPrice}>{formatCurrency(promotion.new_price)}</span>
                <div className={styles.discountBadge}>-{promotion.discount}%</div>
              </div>
            </div>
            <div className={styles.barcodeArea}>
              <div className={styles.barcodePlaceholder}>
                <span className={styles.barcodeText}>Código de Barras</span>
              </div>
              <span className={styles.barcodeNumber}>{promotion.new_barcode}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="primary" onClick={handlePreview}>
          <Eye size={16} />
          Visualizar
        </Button>
        <Button variant="secondary" onClick={handleDownload}>
          <Download size={16} />
          Download
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer size={16} />
          Imprimir
        </Button>
      </div>
    </div>
  )
}