import { Order } from "@/types/order";

export const generateReceiptHTML = (order: Order): string => {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px 4px; border-bottom: 1px dashed #ddd;">${item.name}</td>
      <td style="padding: 8px 4px; border-bottom: 1px dashed #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px 4px; border-bottom: 1px dashed #ddd; text-align: right;">R$ ${item.price.toFixed(2)}</td>
      <td style="padding: 8px 4px; border-bottom: 1px dashed #ddd; text-align: right; font-weight: bold;">R$ ${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Courier New', monospace;
          width: 300px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          text-align: center;
          font-size: 24px;
          margin: 10px 0;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
        }
        .info {
          text-align: center;
          margin: 15px 0;
          font-size: 12px;
        }
        table {
          width: 100%;
          margin: 20px 0;
          border-collapse: collapse;
        }
        th {
          border-bottom: 2px solid #000;
          padding: 8px 4px;
          text-align: left;
          font-size: 12px;
        }
        td {
          font-size: 12px;
        }
        .total {
          margin-top: 20px;
          padding-top: 10px;
          border-top: 2px solid #000;
          font-size: 16px;
          font-weight: bold;
          text-align: right;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          border-top: 1px dashed #000;
          padding-top: 15px;
        }
      </style>
    </head>
    <body>
      <h1>RECIBO DE PEDIDO</h1>
      <div class="info">
        <div>Pedido #${order.orderNumber}</div>
        <div>${new Date(order.date).toLocaleString("pt-BR")}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align: center;">Qtd</th>
            <th style="text-align: right;">Preço</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
      <div class="total">
        TOTAL: R$ ${order.total.toFixed(2)}
      </div>
      <div class="footer">
        <div>Obrigado pela preferência!</div>
        <div>www.seusite.com.br</div>
      </div>
    </body>
    </html>
  `;
};

export const printOrder = (order: Order, numCopies: number = 1) => {
  const htmlContent = generateReceiptHTML(order);
  const encodedHTML = encodeURIComponent(htmlContent);
  const printUrl = `print://escpos.org/escpos/usb/print?srcTp=uri&srcObj=html&numCopies=${numCopies}&src=data:text/html,${encodedHTML}`;
  
  // Redireciona diretamente para impressão USB (Android)
  // O ESC/POS USB Print Service reconhece automaticamente o esquema print://
  window.location.href = printUrl;
  return true;
};
