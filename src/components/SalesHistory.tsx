import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar, TrendingUp, Receipt, Clock, ShoppingBag } from "lucide-react";

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
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-2 rounded-xl">
            <Receipt className="h-5 w-5 text-orange-600" />
          </div>
          <h3>Riwayat Transaksi</h3>
        </div>
        
        <Tabs defaultValue="today">
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
