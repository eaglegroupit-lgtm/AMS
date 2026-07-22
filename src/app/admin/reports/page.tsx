'use client';

import React, { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, Calendar, IndianRupee } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

interface Order {
  id: string;
  billNumber: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  discount: number;
  gstAmount: number;
  grandTotal: number;
  paymentMethod: string;
  createdAt: string;
}

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) setOrders(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const exportCSV = () => {
    const headers = 'Bill Number,Table,Customer,Phone,Subtotal,Discount,GST,Grand Total,Payment Method,Date\n';
    const rows = orders
      .map(
        (o) =>
          `"${o.billNumber}","${o.tableNumber}","${o.customerName}","${o.customerPhone}",${o.subtotal},${o.discount},${o.gstAmount},${o.grandTotal},"${o.paymentMethod}","${o.createdAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const exportExcel = () => {
    const wsData = orders.map((o) => ({
      'Bill Number': o.billNumber,
      Table: o.tableNumber,
      Customer: o.customerName,
      Phone: o.customerPhone,
      Subtotal: o.subtotal,
      Discount: o.discount,
      'GST Amount': o.gstAmount,
      'Grand Total': o.grandTotal,
      Payment: o.paymentMethod,
      Date: new Date(o.createdAt).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
    XLSX.writeFile(wb, `Sales_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('AMUTHA SURABI RESTAURANT - SALES REPORT', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    let y = 30;
    doc.text('Bill No | Table | Customer | Grand Total | Payment', 14, y);
    doc.line(14, y + 2, 195, y + 2);
    y += 8;

    orders.forEach((o) => {
      doc.text(
        `${o.billNumber} | ${o.tableNumber || 'N/A'} | ${o.customerName.slice(0, 12)} | Rs.${o.grandTotal} | ${o.paymentMethod}`,
        14,
        y
      );
      y += 6;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`Sales_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.grandTotal, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Sales & Revenue Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Export comprehensive sales history to CSV, Excel, or PDF.
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={exportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>CSV</span>
          </button>
          <button
            onClick={exportExcel}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 border border-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={exportPDF}
            className="bg-slate-800 hover:bg-slate-700 text-red-400 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 border border-slate-700"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Total Recorded Sales Revenue</p>
          <h2 className="text-3xl font-black text-amber-400 mt-1">₹{totalRevenue}</h2>
        </div>
        <span className="bg-emerald-500/10 text-emerald-400 font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/30">
          {orders.length} Total Bills
        </span>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-700/60 uppercase tracking-wider text-[10px]">
              <th className="p-4">Bill Number</th>
              <th className="p-4">Table</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Subtotal</th>
              <th className="p-4">GST</th>
              <th className="p-4">Grand Total</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-800/50">
                <td className="p-4 font-mono font-bold text-amber-400">{o.billNumber}</td>
                <td className="p-4 font-bold text-white">{o.tableNumber}</td>
                <td className="p-4">{o.customerName}</td>
                <td className="p-4">
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] font-bold text-slate-300 border border-slate-700">
                    {o.paymentMethod}
                  </span>
                </td>
                <td className="p-4">₹{o.subtotal}</td>
                <td className="p-4">₹{o.gstAmount}</td>
                <td className="p-4 font-black text-emerald-400">₹{o.grandTotal}</td>
                <td className="p-4 text-slate-400">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
