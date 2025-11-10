import { Order } from "@/types/order";

export const generateReceiptHTML = (order: Order): string => {
  const itemsHTML = order.items
    .map(
      (item, index) => {
        let detailsHTML = '';
        
        if (item.size || item.base || item.meioAMeio || item.frutas || item.mixIns || item.toppings) {
          detailsHTML = `
            <div class="item-details">
              ${item.size ? `<div class="detail-row"><span class="detail-label">Tamanho:</span> <span class="detail-value">${item.size}</span></div>` : ''}
              ${item.base ? `<div class="detail-row"><span class="detail-label">Base:</span> <span class="detail-value">${item.base}</span></div>` : ''}
              ${item.meioAMeio ? `<div class="detail-row"><span class="detail-label">🍦 Meio a Meio:</span> <span class="detail-value">${item.meioAMeio}</span></div>` : ''}
              ${item.frutas ? `<div class="detail-row"><span class="detail-label">F:</span> <span class="detail-value">${item.frutas}</span></div>` : ''}
              ${item.mixIns ? `<div class="detail-row"><span class="detail-label">M:</span> <span class="detail-value">${item.mixIns}</span></div>` : ''}
              ${item.toppings ? `<div class="detail-row"><span class="detail-label">T:</span> <span class="detail-value">${item.toppings}</span></div>` : ''}
            </div>
          `;
        }
        
        return `
          <div class="item-card">
            <div class="item-header">
              <div class="item-title">Item ${index + 1} - R$ ${item.price.toFixed(2)}</div>
            </div>
            ${detailsHTML}
          </div>
        `;
      }
    )
    .join("");

  return `
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; width: 280px; padding: 10px; }
        h1 { text-align: center; font-size: 18px; margin: 5px 0; color: #1e40af; }
        .center { text-align: center; margin: 10px 0; font-size: 11px; }
        .cart-title { text-align: left; font-size: 14px; margin: 10px 0; color: #1e40af; }
        .item-card { 
          background: #f0f4ff; 
          border-radius: 8px; 
          padding: 8px; 
          margin: 8px 0; 
          border: 1px solid #ddd;
        }
        .item-header { 
          font-weight: bold; 
          margin-bottom: 6px;
          font-size: 11px;
        }
        .item-title { color: #1e40af; }
        .item-details { 
          font-size: 9px; 
          line-height: 1.4;
        }
        .detail-row {
          margin: 3px 0;
          display: flex;
          justify-content: space-between;
        }
        .detail-label {
          font-weight: bold;
          flex-shrink: 0;
        }
        .detail-value {
          text-align: right;
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 65%;
        }
        .total { 
          margin-top: 15px; 
          padding-top: 10px; 
          border-top: 2px solid #1e40af; 
          font-size: 16px; 
          font-weight: bold; 
          color: #16a34a;
        }
      </style>
    </head>
    <body>
      <h1>#${order.orderNumber}</h1>
      <div class="center">
        <div>Pedido: ${order.orderNumber}</div>
        <div>${new Date(order.date).toLocaleDateString("pt-BR")} ${new Date(order.date).toLocaleTimeString("pt-BR")}</div>
      </div>
      <div class="cart-title">🛒 Carrinho com ${order.items.length} ${order.items.length === 1 ? 'item' : 'itens'}</div>
      ${itemsHTML}
      <div class="total">
        R$ ${order.total.toFixed(2)}
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
