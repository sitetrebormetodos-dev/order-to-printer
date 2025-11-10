import { Order } from "@/types/order";

export const generateReceiptHTML = (order: Order): string => {
  const itemsHTML = order.items
    .map((item, index) => {
      let details = '';
      
      if (item.size) details += `Tamanho: ${item.size}\n`;
      if (item.base) details += `Base: ${item.base}\n`;
      if (item.meioAMeio) details += `🍦 Meio a Meio: ${item.meioAMeio}\n`;
      if (item.frutas) details += `F: ${item.frutas}\n`;
      if (item.mixIns) details += `M: ${item.mixIns}\n`;
      if (item.toppings) details += `T: ${item.toppings}\n`;
      
      return `Item ${index + 1} - R$ ${item.price.toFixed(2)}\n${details}`;
    })
    .join('\n');

  return `
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: monospace; 
          width: 280px; 
          padding: 10px;
          margin: 0;
        }
        .center { 
          text-align: center; 
          margin: 5px 0;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin: 10px 0;
        }
        .info {
          font-size: 11px;
          margin: 3px 0;
        }
        .cart-header {
          font-size: 12px;
          margin: 10px 0 5px 0;
        }
        .items {
          font-size: 10px;
          white-space: pre-line;
          line-height: 1.5;
          margin: 10px 0;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          margin: 15px 0 10px 0;
          padding-top: 10px;
          border-top: 1px dashed black;
        }
        .thanks {
          text-align: center;
          font-size: 11px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="center title">#${order.orderNumber}</div>
      <div class="center info">Pedido: ${order.orderNumber}</div>
      <div class="center info">${new Date(order.date).toLocaleDateString("pt-BR")} ${new Date(order.date).toLocaleTimeString("pt-BR")}</div>
      <div class="cart-header">🛒 Carrinho com ${order.items.length} ${order.items.length === 1 ? 'item' : 'itens'}</div>
      <div class="items">${itemsHTML}</div>
      <div class="total">R$ ${order.total.toFixed(2)}</div>
      <div class="thanks">Obrigado!</div>
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
