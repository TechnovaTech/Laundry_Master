import jsPDF from 'jspdf';
import acsLogo from '@/assets/ACS Logo.jpg';
import usLogo from '@/assets/US Logo.jpg';

export const generateInvoicePDF = async (order: any) => {
  if (!order) return;

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  let hubAddress = {
    name: 'Urban Steam',
    address: '#7/4B, 1st Cross, 5th Main Road,',
    address2: 'Manjunatha Layout, R T Nagar Post, near',
    address3: 'Mamtha School, Bengaluru - 560032',
    email: 'support@urbansteam.in',
    gst: '29ACLFAA519M1ZW'
  };
  
  try {
    const response = await fetch(`http://localhost:3000/api/check-serviceable?pincode=${order.pickupAddress?.pincode}`);
    const data = await response.json();
    if (data.serviceable && data.hub) {
      hubAddress = {
        name: data.hub.name || 'Urban Steam',
        address: data.hub.address || hubAddress.address,
        address2: data.hub.address2 || hubAddress.address2,
        address3: data.hub.city ? `${data.hub.city} - ${data.hub.pincode}` : hubAddress.address3,
        email: data.hub.email || hubAddress.email,
        gst: data.hub.gstNumber || hubAddress.gst
      };
    }
  } catch (error) {
    console.log('Using default hub address');
  }
  
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'F');
  
  // Add logos with better quality
  doc.addImage(acsLogo, 'JPEG', 15, 15, 35, 15);
  doc.addImage(usLogo, 'JPEG', pageWidth - 55, 15, 40, 15);
  doc.setTextColor(0, 0, 0);
  
  // Invoice header section with border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.rect(15, 35, pageWidth - 30, 25);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('ORIGINAL FOR RECIPIENT', 17, 41);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', 17, 51);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`#${order.orderId || 'N/A'}`, 17, 57);
  doc.setTextColor(0, 0, 0);
  
  // Date, Billed to, From section with borders
  const sectionY = 65;
  const sectionHeight = 45;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.rect(15, sectionY, 50, sectionHeight);
  doc.rect(70, sectionY, 65, sectionHeight);
  doc.rect(140, sectionY, pageWidth - 155, sectionHeight);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Issued', 17, sectionY + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 17, sectionY + 13);
  doc.setFont('helvetica', 'bold');
  doc.text('Due', 17, sectionY + 23);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 17, sectionY + 29);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Billed to', 72, sectionY + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(order.customer?.name || 'Customer Name', 72, sectionY + 13);
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  const address = doc.splitTextToSize(order.pickupAddress?.street || 'Customer address', 60);
  doc.text(address, 72, sectionY + 18);
  doc.text(`${order.pickupAddress?.city || 'City'}, ${order.pickupAddress?.state || 'Country'} - ${order.pickupAddress?.pincode || '000000'}`, 72, sectionY + 23);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text('Contact Number', 72, sectionY + 33);
  doc.text('Order Id', 72, sectionY + 38);
  
  doc.setFont('helvetica', 'bold');
  doc.text('From', 142, sectionY + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(hubAddress.name, 142, sectionY + 13);
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text('Address', 142, sectionY + 18);
  const hubAddr = doc.splitTextToSize(`${hubAddress.address} ${hubAddress.address2} ${hubAddress.address3}`, 55);
  doc.text(hubAddr, 142, sectionY + 22);
  doc.setFontSize(9);
  doc.text(`Email Id :${hubAddress.email}`, 142, sectionY + 34);
  doc.text(`GST No: ${hubAddress.gst}`, 142, sectionY + 39);
  doc.setTextColor(0, 0, 0);
  
  let yPos = 115;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.setFillColor(240, 240, 240);
  doc.rect(15, yPos, pageWidth - 30, 8, 'FD');
  yPos += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Service', 17, yPos);
  doc.text('Qty', 130, yPos);
  doc.text('Rate', 155, yPos);
  doc.text('Total', 180, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  let subtotal = 0;
  
  if (order.items && order.items.length > 0) {
    order.items.forEach((item: any) => {
      const itemTotal = (item.quantity || 0) * (item.price || 0);
      subtotal += itemTotal;
      doc.setFont('helvetica', 'bold');
      doc.text(item.name || 'Service name', 17, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text(item.description || 'Description', 17, yPos + 4);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.text(String(item.quantity || 0), 130, yPos);
      doc.text(`Rs${(item.price || 0).toFixed(2)}`, 155, yPos);
      doc.text(`Rs${itemTotal.toFixed(2)}`, 180, yPos);
      yPos += 12;
    });
  }
  
  yPos += 15;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal', 140, yPos);
  doc.text(`Rs${subtotal.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
  yPos += 7;
  doc.text('Tax (0%)', 140, yPos);
  doc.text('Rs0.00', pageWidth - 20, yPos, { align: 'right' });
  yPos += 7;
  const discountPercent = order.discount || 0;
  if (discountPercent > 0) {
    doc.text('Discount/Coupon code', 140, yPos);
    doc.text(`${discountPercent}%`, pageWidth - 20, yPos, { align: 'right' });
    yPos += 7;
  }
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Total', 140, yPos);
  doc.text(`Rs${(order.totalAmount || subtotal).toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 200);
  doc.text('Amount due', 140, yPos);
  doc.text(`Rs${(order.totalAmount || subtotal).toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  
  yPos += 20;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for choosing Urban Steam', 20, yPos);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Incase of any issues contact support@urbansteam.in within 24 hours of delivery', 20, yPos + 5);
  
  doc.save(`Invoice-${order.orderId || 'order'}.pdf`);
};
