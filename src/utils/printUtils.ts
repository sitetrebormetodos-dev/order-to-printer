import { Order } from "@/types/order";

export const generateReceiptHTML = (order: Order): string => {
  const itemsHTML = order.items
    .map((item, index) => {
      let rows = `
        <tr>
          <td colspan="2" style="font-weight: bold; padding-top: 8px;">Item ${index + 1} - R$ ${item.price.toFixed(2)}</td>
        </tr>`;
      
      if (item.size && item.size.trim()) {
        rows += `
        <tr>
          <td style="padding-left: 10px;">Tamanho:</td>
          <td style="text-align: right;">${item.size}</td>
        </tr>`;
      }
      
      if (item.base && item.base.trim()) {
        rows += `
        <tr>
          <td style="padding-left: 10px;">Base:</td>
          <td style="text-align: right;">${item.base}</td>
        </tr>`;
      }
      
      if (item.meioAMeio && item.meioAMeio.trim()) {
        rows += `
        <tr>
          <td style="padding-left: 10px;">Meio a Meio:</td>
          <td style="text-align: right;">${item.meioAMeio}</td>
        </tr>`;
      }
      
      if (item.frutas && item.frutas.trim()) {
        rows += `
        <tr>
          <td style="padding-left: 10px;">F:</td>
          <td style="text-align: right;">${item.frutas}</td>
        </tr>`;
      }
      
      if (item.mixIns && item.mixIns.trim()) {
        rows += `
        <tr>
          <td style="padding-left: 10px;">M:</td>
          <td style="text-align: right;">${item.mixIns}</td>
        </tr>`;
      }
      
      if (item.toppings && item.toppings.trim()) {
        rows += `
        <tr>
          <td style="padding-left: 10px;">T:</td>
          <td style="text-align: right;">${item.toppings}</td>
        </tr>`;
      }
      
      return rows;
    })
    .join("");

  return `
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: monospace; width: 280px; padding: 10px; }
        h1 { text-align: center; font-size: 20px; margin: 5px 0; }
        .center { text-align: center; margin: 10px 0; font-size: 11px; }
        .cart-info { font-size: 11px; margin: 10px 0; }
        table { width: 100%; margin: 10px 0; border-collapse: collapse; }
        td { padding: 2px 4px; font-size: 10px; word-wrap: break-word; }
        .total { margin-top: 10px; padding-top: 10px; border-top: 1px solid black; font-size: 14px; font-weight: bold; text-align: center; }
      </style>
    </head>
    <body>
      <h1>#${order.orderNumber}</h1>
      <div class="center">
        <div>Pedido: ${order.orderNumber}</div>
        <div>${new Date(order.date).toLocaleDateString("pt-BR")} ${new Date(order.date).toLocaleTimeString("pt-BR")}</div>
      </div>
      <div class="cart-info">Carrinho com ${order.items.length} ${order.items.length === 1 ? 'item' : 'itens'}</div>
      <table>
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
