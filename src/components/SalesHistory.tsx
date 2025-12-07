import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar, TrendingUp, Receipt, Clock, ShoppingBag, FileSpreadsheet, FileText, Download } from "lucide-react";
import * as XLSX from 'xlsx';

export interface Transaction {
  id: string;
  date: string;
  time: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  tax: number;
  total: number;
}

interface SalesHistoryProps {
  transactions: Transaction[];
}

export function SalesHistory({ transactions }: SalesHistoryProps) {
  const today = new Date().toLocaleDateString('id-ID');
  
  const todayTransactions = transactions.filter(t => t.date === today);
  const todayTotal = todayTransactions.reduce((sum, t) => sum + t.total, 0);
  
  const allTimeTotal = transactions.reduce((sum, t) => sum + t.total, 0);

  const groupByDate = (txns: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    txns.forEach(txn => {
      if (!groups[txn.date]) {
        groups[txn.date] = [];
      }
      groups[txn.date].push(txn);
    });
    return groups;
  };

  const dailyGroups = groupByDate(transactions);

  // Export to Excel function
  const handleExportToExcel = (txns: Transaction[]) => {
    if (txns.length === 0) {
      alert('Tidak ada data untuk di-export!');
      return;
    }

    const excelData = txns.flatMap(transaction => 
      transaction.items.map((item, idx) => ({
        'ID Transaksi': idx === 0 ? transaction.id : '',
        'Tanggal': idx === 0 ? transaction.date : '',
        'Waktu': idx === 0 ? transaction.time : '',
        'Nama Item': item.name,
        'Jumlah': item.quantity,
        'Harga Satuan': item.price,
        'Subtotal Item': item.quantity * item.price,
        'Subtotal Transaksi': idx === 0 ? transaction.subtotal : '',
        'Pajak': idx === 0 ? transaction.tax : '',
        'Total': idx === 0 ? transaction.total : ''
      }))
    );

    const summaryRow = {
      'ID Transaksi': '', 'Tanggal': '', 'Waktu': '', 'Nama Item': '',
      'Jumlah': '', 'Harga Satuan': '', 'Subtotal Item': '',
      'Subtotal Transaksi': '', 'Pajak': '', 'Total': ''
    };
    
    const totalSales = txns.reduce((sum, t) => sum + t.total, 0);
    const totalRow = {
      'ID Transaksi': 'TOTAL PENJUALAN', 'Tanggal': '', 'Waktu': '',
      'Nama Item': '', 'Jumlah': '', 'Harga Satuan': '', 'Subtotal Item': '',
      'Subtotal Transaksi': '', 'Pajak': '', 'Total': totalSales
    };

    const finalData = [...excelData, summaryRow, totalRow];
    const ws = XLSX.utils.json_to_sheet(finalData);
    
    ws['!cols'] = [
      { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 25 }, { wch: 8 },
      { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 12 }, { wch: 15 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Riwayat Penjualan');
    
    const fileName = `Riwayat_Penjualan_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Export to PDF function
  const handleExportToPDF = (txns: Transaction[]) => {
    if (txns.length === 0) {
      alert('Tidak ada data untuk di-export!');
      return;
    }

    const totalSales = txns.reduce((sum, t) => sum + t.total, 0);
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Pop-up diblokir! Mohon izinkan pop-up untuk print PDF.');
      return;
    }

    const groupedByDate = txns.reduce((groups: { [key: string]: Transaction[] }, txn) => {
      if (!groups[txn.date]) groups[txn.date] = [];
      groups[txn.date].push(txn);
      return groups;
    }, {});

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Riwayat Penjualan</title>
        <style>
          @media print {
            @page { size: A4; margin: 15mm; }
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #f97316;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #ea580c;
            margin: 0 0 10px 0;
            font-size: 28px;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
            gap: 20px;
          }
          .summary-card {
            flex: 1;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
          }
          .summary-card.total {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
          }
          .summary-card.count {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
          }
          .summary-card h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .summary-card .value {
            font-size: 24px;
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          thead {
            background: #f97316;
            color: white;
          }
          th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
          }
          th.right { text-align: right; }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 12px;
          }
          td.right { text-align: right; }
          tbody tr:hover { background-color: #fff7ed; }
          .transaction-group {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .date-header {
            background: linear-gradient(to right, #fff7ed, #ffedd5);
            padding: 12px 15px;
            border-radius: 6px;
            margin: 20px 0 10px 0;
            border-left: 4px solid #f97316;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .date-header .date {
            font-weight: bold;
            color: #ea580c;
            font-size: 14px;
          }
          .date-header .daily-total {
            background: #f97316;
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 13px;
          }
          .item-badge {
            background: #e5e7eb;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin-right: 6px;
            display: inline-block;
          }
          .item-row { margin: 4px 0; }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 11px;
          }
          .total-footer {
            background: #f97316;
            color: white;
            padding: 15px;
            border-radius: 6px;
            text-align: right;
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
          }
          @media print {
            body { padding: 0; }
            .transaction-group { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 RIWAYAT PENJUALAN</h1>
          <p>Laporan dicetak pada: ${new Date().toLocaleString('id-ID', { 
            dateStyle: 'full', 
            timeStyle: 'short' 
          })}</p>
        </div>
        <div class="summary">
          <div class="summary-card count">
            <h3>Total Transaksi</h3>
            <div class="value">${txns.length}</div>
          </div>
          <div class="summary-card total">
            <h3>Total Penjualan</h3>
            <div class="value">Rp ${totalSales.toLocaleString('id-ID')}</div>
          </div>
        </div>
        ${Object.entries(groupedByDate).reverse().map(([date, dateTxns]) => {
          const dailyTotal = dateTxns.reduce((sum, t) => sum + t.total, 0);
          return `
            <div class="transaction-group">
              <div class="date-header">
                <span class="date">📅 ${date}</span>
                <span class="daily-total">Rp ${dailyTotal.toLocaleString('id-ID')}</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 10%">Waktu</th>
                    <th style="width: 15%">ID</th>
                    <th style="width: 50%">Item</th>
                    <th class="right" style="width: 25%">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${dateTxns.map(transaction => `
                    <tr>
                      <td>🕐 ${transaction.time}</td>
                      <td>${transaction.id}</td>
                      <td>
                        ${transaction.items.map(item => `
                          <div class="item-row">
                            <span class="item-badge">${item.quantity}x</span>
                            ${item.name} - Rp ${(item.quantity * item.price).toLocaleString('id-ID')}
                          </div>
                        `).join('')}
                      </td>
                      <td class="right" style="font-weight: bold; color: #f97316;">
                        Rp ${transaction.total.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
        }).join('')}
        <div class="total-footer">
          GRAND TOTAL: Rp ${totalSales.toLocaleString('id-ID')}
        </div>
        <div class="footer">
          <p>Dokumen ini dicetak secara otomatis dari Sistem POS</p>
          <p>© ${new Date().getFullYear()} - Semua Hak Dilindungi</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-500 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700">Penjualan Hari Ini</p>
              <p className="text-xs text-blue-600">{todayTransactions.length} transaksi</p>
            </div>
          </div>
          <p className="text-3xl text-blue-900 font-semibold">
            Rp {todayTotal.toLocaleString('id-ID')}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-500 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700">Total Penjualan</p>
              <p className="text-xs text-green-600">{transactions.length} transaksi</p>
            </div>
          </div>
          <p className="text-3xl text-green-900 font-semibold">
            Rp {allTimeTotal.toLocaleString('id-ID')}
          </p>
        </Card>
      </div>

      <Card className="p-6 bg-white border-2 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-xl">
              <Receipt className="h-5 w-5 text-orange-600" />
            </div>
            <h3>Riwayat Transaksi</h3>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="bg-gray-50 p-1 rounded-lg border-2 border-gray-200">
              <Download className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">Export:</span>
          </div>
        </div>
        
        <Tabs defaultValue="today">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList className="bg-gray-100 border w-full sm:w-auto">
              <TabsTrigger 
                value="today"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Hari Ini
              </TabsTrigger>
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Semua
              </TabsTrigger>
            </TabsList>

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button 
                onClick={() => handleExportToExcel(todayTransactions)}
                className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-3 py-2"
                size="sm"
                disabled={todayTransactions.length === 0}
              >
                <FileSpreadsheet className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                Excel Hari Ini
              </Button>
              
              <Button 
                onClick={() => handleExportToPDF(todayTransactions)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-3 py-2"
                size="sm"
                disabled={todayTransactions.length === 0}
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                PDF Hari Ini
              </Button>

              <Button 
                onClick={() => handleExportToExcel(transactions)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm px-3 py-2"
                size="sm"
                disabled={transactions.length === 0}
              >
                <FileSpreadsheet className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                Excel Semua
              </Button>
              
              <Button 
                onClick={() => handleExportToPDF(transactions)}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm px-3 py-2"
                size="sm"
                disabled={transactions.length === 0}
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                PDF Semua
              </Button>
            </div>
          </div>

          <TabsContent value="today" className="mt-6">
            {todayTransactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-orange-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-12 w-12 text-orange-300" />
                </div>
                <h4 className="text-gray-700 mb-2">Belum Ada Transaksi</h4>
                <p className="text-sm text-gray-500">Transaksi hari ini akan muncul di sini</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border-2">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Waktu</TableHead>
                      <TableHead className="font-semibold">Item</TableHead>
                      <TableHead className="text-right font-semibold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayTransactions.map(transaction => (
                      <TableRow key={transaction.id} className="hover:bg-orange-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {transaction.time}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {transaction.items.map((item, idx) => (
                              <div key={idx} className="text-sm">
                                <Badge variant="secondary" className="mr-2">
                                  {item.quantity}x
                                </Badge>
                                {item.name}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-orange-600">
                          Rp {transaction.total.toLocaleString('id-ID')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            {transactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-orange-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <Receipt className="h-12 w-12 text-orange-300" />
                </div>
                <h4 className="text-gray-700 mb-2">Belum Ada Transaksi</h4>
                <p className="text-sm text-gray-500">Semua transaksi akan muncul di sini</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(dailyGroups).reverse().map(([date, txns]) => {
                  const dailyTotal = txns.reduce((sum, t) => sum + t.total, 0);
                  return (
                    <div key={date}>
                      <div className="flex justify-between items-center mb-3 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border-2 border-orange-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-orange-600" />
                          <h4 className="text-orange-900">{date}</h4>
                        </div>
                        <Badge className="bg-orange-500 text-white">
                          Rp {dailyTotal.toLocaleString('id-ID')}
                        </Badge>
                      </div>
                      <div className="overflow-x-auto rounded-xl border-2">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="font-semibold">Waktu</TableHead>
                              <TableHead className="font-semibold">Item</TableHead>
                              <TableHead className="text-right font-semibold">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {txns.map(transaction => (
                              <TableRow key={transaction.id} className="hover:bg-orange-50">
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    {transaction.time}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    {transaction.items.map((item, idx) => (
                                      <div key={idx} className="text-sm">
                                        <Badge variant="secondary" className="mr-2">
                                          {item.quantity}x
                                        </Badge>
                                        {item.name}
                                      </div>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-semibold text-orange-600">
                                  Rp {transaction.total.toLocaleString('id-ID')}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}