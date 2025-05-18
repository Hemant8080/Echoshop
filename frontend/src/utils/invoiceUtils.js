import { formatINR, formatUSD } from './currencyUtils';

// Simple invoice generator without external dependencies
const createSimpleInvoice = (order) => {
  // Create an HTML string for the invoice
  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #INV-${order._id.slice(-8)}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .invoice-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .invoice-header h1 {
          color: #7c3aed;
          margin-bottom: 5px;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .company-info, .invoice-info {
          width: 45%;
        }
        .customer-info {
          margin-bottom: 30px;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .invoice-table th {
          background-color: #7c3aed;
          color: white;
          padding: 10px;
          text-align: left;
        }
        .invoice-table td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        .invoice-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .invoice-summary {
          width: 40%;
          margin-left: auto;
        }
        .invoice-summary table {
          width: 100%;
          border-collapse: collapse;
        }
        .invoice-summary td {
          padding: 5px;
        }
        .invoice-summary .total {
          font-weight: bold;
          color: #7c3aed;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #888;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <h1>EcoShop</h1>
        <p>Invoice</p>
      </div>
      
      <div class="invoice-details">
        <div class="company-info">
          <p><strong>EcoShop Inc.</strong></p>
          <p>123 Commerce Street</p>
          <p>Mumbai, Maharashtra 400001</p>
          <p>India</p>
          <p>GSTIN: 27AABCT1332L1ZT</p>
        </div>
        
        <div class="invoice-info">
          <p><strong>Invoice #:</strong> INV-${order._id.slice(-8)}</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Payment ID:</strong> ${order.paymentInfo.id}</p>
          <p><strong>Status:</strong> ${order.orderStatus}</p>
        </div>
      </div>
      
      <div class="customer-info">
        <h3>Bill To:</h3>
        <p>${order.user?.name || "Customer"}</p>
        <p>${order.shippingInfo.address}</p>
        <p>${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.pinCode}</p>
        <p>${order.shippingInfo.country}</p>
        <p>Phone: ${order.shippingInfo.phoneNo}</p>
      </div>
      
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${formatINR(item.price)}</td>
              <td>${item.quantity}</td>
              <td>${formatINR(item.price * item.quantity)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="invoice-summary">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td>${formatINR(order.itemsPrice)}</td>
          </tr>
          <tr>
            <td>Tax:</td>
            <td>${formatINR(order.taxPrice)}</td>
          </tr>
          <tr>
            <td>Shipping:</td>
            <td>${formatINR(order.shippingPrice)}</td>
          </tr>
          <tr class="total">
            <td>Total:</td>
            <td>${formatINR(order.totalPrice)}</td>
          </tr>
        </table>
      </div>
      
      <div class="footer">
        <p>Thank you for shopping with EcoShop!</p>
        <p>For any questions regarding this invoice, please contact support@ecoshop.com</p>
        <p>This is a computer-generated invoice and does not require a signature.</p>
      </div>
    </body>
    </html>
  `;
  
  return invoiceHTML;
};

/**
 * Download an invoice for an order
 * @param {Object} order - The order object
 */
export const downloadInvoice = (order) => {
  // Generate the invoice HTML
  const invoiceHTML = createSimpleInvoice(order);
  
  // Create a Blob from the HTML content
  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = `EcoShop_Invoice_${order._id.slice(-8)}.html`;
  
  // Append the link to the body
  document.body.appendChild(link);
  
  // Click the link to trigger the download
  link.click();
  
  // Remove the link from the document
  document.body.removeChild(link);
  
  // Revoke the URL to free up memory
  URL.revokeObjectURL(url);
};
