import { Order } from "@/types/order";

export const generateReceiptHTML = (order: Order): string => {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>R$ ${item.price.toFixed(2)}</td>
      <td>R$ ${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: monospace; width: 280px; padding: 10px; }
        h1 { text-align: center; font-size: 18px; margin: 5px 0; }
        .center { text-align: center; margin: 10px 0; font-size: 11px; }
        table { width: 100%; margin: 10px 0; border-collapse: collapse; }
        th, td { padding: 4px 2px; font-size: 11px; }
        th { border-bottom: 1px solid black; }
        .total { margin-top: 10px; padding-top: 10px; border-top: 1px solid black; font-size: 14px; font-weight: bold; text-align: right; }
      </style>
    </head>
    <body>
      <h1>RECIBO DE PEDIDO</h1>
      <div class="center">
        <div>Pedido: ${order.orderNumber}</div>
        <div>${new Date(order.date).toLocaleDateString("pt-BR")} ${new Date(order.date).toLocaleTimeString("pt-BR")}</div>
      </div>
      <table>
        <tr>
          <th>Item</th>
          <th>Qtd</th>
          <th>Preco</th>
          <th>Total</th>
        </tr>
        ${itemsHTML}
      </table>
      <div class="total">
        TOTAL: R$ ${order.total.toFixed(2)}
      </div>
      <div class="center">
        <div>Obrigado!</div>
      </div>
    </body>
    </html>
  `;
};

export const printOrder = (order: Order, numCopies: number = 1) => {
  const htmlContent = generateReceiptHTML(order);
  
  // Codifica o HTML para URL, mas mantém as aspas simples conforme documentação
  const encodedHTML = encodeURIComponent(htmlContent);
  
  // Segue o padrão exato da documentação com aspas simples ao redor do data:text/html
  const printUrl = `print://escpos.org/escpos/usb/print?srcTp=uri&srcObj=html&numCopies=${numCopies}&src='data:text/html,${encodedHTML}'`;
  
  // Redireciona diretamente para impressão USB (Android)
  window.location.href = printUrl;
  return true;
};
