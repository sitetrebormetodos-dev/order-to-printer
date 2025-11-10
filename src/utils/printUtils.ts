import { Order } from "@/types/order";

export const generateReceiptHTML = (order: Order): string => {
  const itemsHTML = order.items
    .map(
      (item) => {
        let itemName = item.name;
        
        // Adicionar detalhes embaixo do nome
        if (item.size) itemName += `\nTamanho: ${item.size}`;
        if (item.base) itemName += `\nBase: ${item.base}`;
        if (item.meioAMeio) itemName += `\nMeio a Meio: ${item.meioAMeio}`;
        if (item.frutas) itemName += `\nF: ${item.frutas}`;
        if (item.mixIns) itemName += `\nM: ${item.mixIns}`;
        if (item.toppings) itemName += `\nT: ${item.toppings}`;
        
        return `
    <tr>
      <td style="white-space: pre-line;">${itemName}</td>
      <td>${item.quantity}</td>
      <td>R$ ${item.price.toFixed(2)}</td>
      <td>R$ ${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `;
      }
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
        table { width: 100%; margin: 10px 0; border-collapse: collapse; table-layout: fixed; }
        th, td { padding: 4px 2px; font-size: 10px; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top; }
        th { border-bottom: 1px solid black; }
        th:nth-child(1), td:nth-child(1) { width: 45%; }
        th:nth-child(2), td:nth-child(2) { width: 15%; text-align: center; }
        th:nth-child(3), td:nth-child(3) { width: 20%; text-align: right; }
        th:nth-child(4), td:nth-child(4) { width: 20%; text-align: right; }
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
