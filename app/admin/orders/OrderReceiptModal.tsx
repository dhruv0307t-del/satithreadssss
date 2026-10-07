"use client";

import { X, Download, Printer } from "lucide-react";
import Image from "next/image";

interface OrderReceiptModalProps {
    order: any;
    onClose: () => void;
}

export default function OrderReceiptModal({ order, onClose }: OrderReceiptModalProps) {
    const handleDownload = () => {
        // Create a blob with HTML content
        const receiptContent = document.getElementById('receipt-content');
        if (!receiptContent) return;

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order Receipt - ${order._id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 40px; 
      background: #ffe4e1;
    }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { 
      font-size: 36px; 
      text-align: center; 
      color: #bf7e81; 
      margin-bottom: 10px;
      font-family: Georgia, serif;
    }
    .subtitle { 
      text-align: center; 
      font-size: 12px; 
      color: #bf7e81; 
      text-transform: uppercase; 
      letter-spacing: 2px;
      margin-bottom: 5px;
    }
    .gstin { 
      text-align: center; 
      font-size: 10px; 
      color: #bf7e81; 
      margin-bottom: 20px;
    }
    .divider {
      border-bottom: 2px solid #bf7e81;
      margin: 20px 0;
    }
    .order-info { 
      background: #ffe4e1; 
      padding: 15px; 
      border-radius: 10px; 
      margin: 20px 0;
      display: flex;
      justify-content: space-between;
    }
    .info-item { font-size: 12px; }
    .label { color: #bf7e81; }
    .value { font-weight: bold; color: #bf7e81; margin-left: 5px; }
    .section { margin: 30px 0; }
    .section-title { 
      font-size: 18px; 
      font-weight: bold; 
      color: #bf7e81; 
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #bf7e81;
    }
    .grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 20px; 
      margin: 20px 0;
    }
    .box { 
      background: #ffe4e1; 
      padding: 15px; 
      border-radius: 10px; 
      border: 1px solid #E5DDD3;
    }
    .box-title { 
      font-size: 14px; 
      font-weight: bold; 
      color: #bf7e81; 
      margin-bottom: 10px;
    }
    .box-content { 
      font-size: 12px; 
      color: #555; 
      line-height: 1.6;
    }
    .item { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 15px; 
      background: #ffe4e1; 
      border: 1px solid #E5DDD3; 
      border-radius: 10px;
      margin-bottom: 10px;
    }
    .item-info { flex: 1; }
    .item-name { 
      font-weight: bold; 
      font-size: 14px; 
      color: #bf7e81;
      margin-bottom: 5px;
    }
    .item-details { 
      font-size: 11px; 
      color: #bf7e81;
    }
    .item-price { 
      font-weight: bold; 
      font-size: 20px; 
      color: #bf7e81;
      text-align: right;
    }
    .summary { 
      background: #ffe4e1; 
      padding: 20px; 
      border-radius: 10px; 
      border: 2px solid #bf7e81;
      max-width: 400px;
      margin-left: auto;
      margin-top: 20px;
    }
    .summary-title {
      font-size: 16px;
      font-weight: bold;
      color: #bf7e81;
      margin-bottom: 15px;
    }
    .summary-row { 
      display: flex; 
      justify-content: space-between; 
      font-size: 13px;
      margin-bottom: 10px;
    }
    .summary-total { 
      border-top: 2px solid #bf7e81; 
      padding-top: 15px; 
      margin-top: 15px;
    }
    .total-label { 
      font-size: 16px; 
      font-weight: bold;
      color: #bf7e81;
    }
    .total-value { 
      font-size: 24px; 
      font-weight: bold; 
      color: #bf7e81;
    }
    .status-bar { 
      background: linear-gradient(to right, #bf7e81, #bf7e81);
      color: #ffe4e1; 
      padding: 20px; 
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
    }
    .status-item { font-size: 14px; }
    .status-label { 
      font-size: 11px; 
      color: #bf7e81;
      margin-bottom: 5px;
    }
    .status-value { 
      font-size: 18px; 
      font-weight: bold;
    }
    .footer { 
      text-align: center; 
      margin-top: 30px; 
      padding-top: 20px;
      border-top: 2px solid #E5DDD3;
      font-size: 11px;
      color: #bf7e81;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>SATI THREADS</h1>
    <div class="subtitle">Order Receipt</div>
    <div class="gstin">GSTIN: 09AAPCS8677L1Z6</div>
    
    <div class="divider"></div>
    
    <div class="order-info">
      <div class="info-item">
        <span class="label">Order ID:</span>
        <span class="value">#${order._id}</span>
      </div>
      <div class="info-item">
        <span class="label">Date:</span>
        <span class="value">${new Date(order.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })}</span>
      </div>
    </div>

    <div class="grid">
      <div class="box">
        <div class="box-title">Billing To</div>
        <div class="box-content">
          <div style="font-weight: bold; margin-bottom: 5px;">${order.user?.name || "Guest"}</div>
          <div>${order.user?.email || "N/A"}</div>
        </div>
      </div>
      
      <div class="box">
        <div class="box-title">Shipping Address</div>
        <div class="box-content">
          ${typeof order.shippingAddress === 'string' ?
                order.shippingAddress :
                order.shippingAddress ?
                    `<div style="font-weight: bold;">${order.shippingAddress.name || ''}</div>
               <div>${order.shippingAddress.address || ''}</div>
               <div>${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''}</div>
               <div>PIN: ${order.shippingAddress.pincode || ''}</div>
               <div style="margin-top: 5px;">Phone: ${order.shippingAddress.phone || ''}</div>`
                    : 'Address not available'
            }
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Items Ordered</div>
      ${order.items?.map((item: any) => `
        <div class="item">
          <div class="item-info">
            <div class="item-name">${item.name || item.product?.name || "Product Name"}</div>
            <div class="item-details">
              ${item.size ? `Size: ${item.size} | ` : ''}
              ${item.color ? `Color: ${item.color} | ` : ''}
              Qty: ${item.quantity}
              ${item.sku ? ` | SKU: ${item.sku}` : ''}
            </div>
          </div>
          <div class="item-price">₹${item.price}</div>
        </div>
      `).join('')}
    </div>

    <div class="summary">
      <div class="summary-title">Order Summary</div>
      <div class="summary-row">
        <span>Subtotal</span>
        <span style="font-weight: 600;">₹${order.totalAmount}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span style="font-weight: 600; color: green;">FREE</span>
      </div>
      <div class="summary-row">
        <span>Tax (GST)</span>
        <span style="font-weight: 600;">Included</span>
      </div>
      <div class="summary-total">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="total-label">Total Paid</span>
          <span class="total-value">₹${order.totalAmount}</span>
        </div>
        <div style="text-align: center; margin-top: 10px;">
          <span style="background: ${order.paymentStatus === "Paid" ? "#d1fae5" : "#fed7aa"}; 
                       color: ${order.paymentStatus === "Paid" ? "#065f46" : "#c2410c"}; 
                       padding: 5px 15px; border-radius: 20px; font-size: 11px; font-weight: bold;">
            Payment: ${order.paymentStatus}
          </span>
        </div>
      </div>
    </div>

    <div class="status-bar">
      <div class="status-item">
        <div class="status-label">Order Status</div>
        <div class="status-value">${order.orderStatus}</div>
      </div>
      <div class="status-item" style="text-align: right;">
        <div class="status-label">Payment Method</div>
        <div class="status-value">${order.paymentMethod || "Online"}</div>
      </div>
    </div>

    <div class="footer">
      <div style="margin-bottom: 5px;">Thank you for shopping with Sati Threads!</div>
      <div>For any queries, contact us at support@satithreads.com</div>
    </div>
  </div>
</body>
</html>
    `;

        // Create a Blob with the HTML content
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `Receipt-${order._id}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-[#bf7e81]/70 z-[9998] print:hidden"
                onClick={onClose}
            />

            {/* Modal - CENTERED */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none print:static print:p-0">
                <div className="bg-[#ffe4e1] w-full max-w-4xl max-h-[95vh] flex flex-col rounded-2xl shadow-2xl pointer-events-auto print:max-w-none print:max-h-none print:shadow-none print:rounded-none">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#bf7e81] to-[#bf7e81] text-[#ffe4e1] p-4 rounded-t-2xl flex items-center justify-between flex-shrink-0 print:hidden">
                        <div>
                            <h2 className="text-xl font-bold font-['Vanger']">Order Receipt</h2>
                            <p className="text-xs text-[#bf7e81] mt-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-full bg-[#ffe4e1]/10 hover:bg-[#ffe4e1]/20 transition-colors flex items-center justify-center"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 print:overflow-visible print:p-8" id="receipt-content">
                        {/* Company Header */}
                        <div className="text-center border-b-2 border-[#bf7e81] pb-4 mb-6">
                            <h1 className="text-3xl font-['Vanger'] font-bold text-[#bf7e81] mb-1">SATI THREADS</h1>
                            <p className="text-xs text-[#bf7e81] uppercase tracking-widest">Order Receipt</p>
                            <p className="text-xs text-[#bf7e81] mt-1">GSTIN: 09AAPCS8677L1Z6</p>

                            {/* Order Info */}
                            <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-[#ffe4e1] p-3 rounded-lg">
                                <div className="text-left">
                                    <span className="text-[#bf7e81]">Order ID:</span>
                                    <span className="ml-2 font-mono font-bold text-[#bf7e81]">#{order._id}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[#bf7e81]">Date:</span>
                                    <span className="ml-2 font-semibold text-[#bf7e81]">
                                        {new Date(order.createdAt).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Customer & Shipping Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {/* Billing */}
                            <div className="bg-[#ffe4e1] p-4 rounded-lg border border-[#E5DDD3]">
                                <h3 className="font-bold text-[#bf7e81] text-sm mb-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Billing To
                                </h3>
                                <p className="font-bold text-[#bf7e81] text-sm">{order.user?.name || "Guest"}</p>
                                <p className="text-[#bf7e81] text-xs mt-1">{order.user?.email || "N/A"}</p>
                            </div>

                            {/* Shipping */}
                            <div className="bg-[#ffe4e1] p-4 rounded-lg border border-[#E5DDD3]">
                                <h3 className="font-bold text-[#bf7e81] text-sm mb-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    Shipping Address
                                </h3>
                                <div className="text-[#bf7e81] text-xs leading-relaxed">
                                    {typeof order.shippingAddress === 'string' ? (
                                        <p>{order.shippingAddress}</p>
                                    ) : order.shippingAddress ? (
                                        <>
                                            <p className="font-semibold text-[#bf7e81]">{order.shippingAddress.name}</p>
                                            <p>{order.shippingAddress.address}</p>
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                            <p>PIN: {order.shippingAddress.pincode}</p>
                                            <p className="mt-1">📱 {order.shippingAddress.phone}</p>
                                        </>
                                    ) : (
                                        <p className="text-[#bf7e81]">Not available</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="mb-6">
                            <h3 className="font-bold text-[#bf7e81] text-base mb-3 pb-1 border-b-2 border-[#bf7e81]">
                                Items Ordered
                            </h3>

                            <div className="space-y-2">
                                {order.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-[#ffe4e1] rounded-lg border border-[#E5DDD3]">
                                        <div className="flex items-center gap-3 flex-1">
                                            {(item.image || item.product?.mainImage) && (
                                                <div className="w-14 h-14 relative rounded-lg overflow-hidden flex-shrink-0 border border-[#E5DDD3]">
                                                    <Image
                                                        src={item.image || item.product?.mainImage}
                                                        alt="Product"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex-1">
                                                <p className="font-bold text-[#bf7e81] text-sm">
                                                    {item.name || item.product?.name || "Product"}
                                                </p>
                                                <div className="flex gap-3 mt-1 text-xs text-[#bf7e81]">
                                                    {item.size && <span>Size: <b>{item.size}</b></span>}
                                                    {item.color && <span>Color: <b>{item.color}</b></span>}
                                                    <span>Qty: <b>{item.quantity}</b></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right ml-3">
                                            <p className="font-bold text-lg text-[#bf7e81]">₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="flex justify-end mb-6">
                            <div className="w-full max-w-sm bg-[#ffe4e1] p-4 rounded-lg border-2 border-[#bf7e81]">
                                <h3 className="font-bold text-[#bf7e81] text-sm mb-3">Order Summary</h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#bf7e81]">Subtotal</span>
                                        <span className="font-semibold">₹{order.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#bf7e81]">Shipping</span>
                                        <span className="font-semibold text-green-600">FREE</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#bf7e81]">Tax (GST)</span>
                                        <span className="font-semibold">Included</span>
                                    </div>

                                    <div className="border-t-2 border-[#bf7e81] pt-2 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-sm">Total Paid</span>
                                            <span className="font-bold text-xl text-[#bf7e81]">₹{order.totalAmount}</span>
                                        </div>
                                    </div>

                                    <div className="text-center pt-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                            }`}>
                                            Payment: {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="bg-gradient-to-r from-[#bf7e81] to-[#bf7e81] text-[#ffe4e1] p-4 rounded-lg mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="text-xs text-[#bf7e81] mb-1">Order Status</p>
                                    <p className="text-lg font-bold">{order.orderStatus}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-[#bf7e81] mb-1">Payment Method</p>
                                    <p className="font-semibold">{order.paymentMethod || "Online"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center pt-3 border-t-2 border-[#E5DDD3]">
                            <p className="text-xs text-[#bf7e81] mb-1">Thank you for shopping with Sati Threads!</p>
                            <p className="text-xs text-[#bf7e81]">For queries: support@satithreads.com</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="bg-[#ffe4e1] border-t-2 border-[#E5DDD3] p-4 rounded-b-2xl flex gap-3 justify-center flex-shrink-0 print:hidden">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 bg-[#bf7e81] text-[#ffe4e1] px-5 py-2.5 rounded-full font-bold hover:bg-[#bf7e81] transition-all shadow-lg text-sm"
                        >
                            <Download size={16} />
                            Download
                        </button>

                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-[#bf7e81] text-[#ffe4e1] px-5 py-2.5 rounded-full font-bold hover:bg-[#bf7e81] transition-all shadow-lg text-sm"
                        >
                            <Printer size={16} />
                            Print
                        </button>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-content, #receipt-content * { visibility: visible; }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
        </>
    );
}