// PaymentDialog.tsx
import { useState } from "react";
import { CreditCard, Wallet, Banknote, QrCode, AlertCircle, CheckCircle2 } from "lucide-react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onPaymentComplete: () => void;
}

type PaymentMethod = "cash" | "debit" | "qris" | "ewallet";

export function PaymentDialog({
  open,
  onOpenChange,
  items,
  onPaymentComplete,
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [cashAmount, setCashAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const cashAmountNum = parseFloat(cashAmount) || 0;
  const change = cashAmountNum - total;

  const handleQuickCash = (amount: number) => {
    setCashAmount(amount.toString());
  };

  const handlePayment = () => {
    if (paymentMethod === "cash" && cashAmountNum < total) {
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
      onOpenChange(false);
      
      setCashAmount("");
      setPaymentMethod("cash");
    }, 1500);
  };

  const quickCashAmounts = [
    50000, 100000, 150000, 200000, 500000
  ].filter(amount => amount >= total);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Pembayaran</h2>
          <p className="text-sm text-gray-600 mt-1">
            Pilih metode pembayaran dan selesaikan transaksi
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm text-gray-600 uppercase">Ringkasan Pesanan</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pajak (10%)</span>
                <span>Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-orange-600">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <label className="text-base font-semibold block">Metode Pembayaran</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "cash", icon: Banknote, label: "Tunai", color: "text-green-600" },
                { value: "debit", icon: CreditCard, label: "Kartu Debit", color: "text-blue-600" },
                { value: "qris", icon: QrCode, label: "QRIS", color: "text-purple-600" },
                { value: "ewallet", icon: Wallet, label: "E-Wallet", color: "text-orange-600" },
              ].map(({ value, icon: Icon, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPaymentMethod(value as PaymentMethod)}
                  className={`flex items-center gap-3 border-2 rounded-lg p-4 transition-all ${
                    paymentMethod === value
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === "cash" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="cash-amount" className="text-sm font-medium block">
                  Jumlah Uang Tunai
                </label>
                <input
                  id="cash-amount"
                  type="number"
                  placeholder="Masukkan jumlah uang"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {quickCashAmounts.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 block">Nominal Cepat</label>
                  <div className="flex flex-wrap gap-2">
                    {quickCashAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleQuickCash(amount)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-orange-50 hover:border-orange-500 transition-colors"
                      >
                        Rp {amount.toLocaleString('id-ID')}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleQuickCash(total)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-orange-50 hover:border-orange-500 transition-colors"
                    >
                      Uang Pas
                    </button>
                  </div>
                </div>
              )}

              {cashAmount && cashAmountNum >= total && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-800 font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Kembalian
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      Rp {change.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}

              {cashAmount && cashAmountNum < total && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">
                    Jumlah uang tidak cukup. Kurang Rp {(total - cashAmountNum).toLocaleString('id-ID')}
                  </p>
                </div>
              )}
            </div>
          )}

          {paymentMethod === "debit" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <p className="text-sm text-blue-800 font-medium">
                Masukkan kartu debit ke mesin EDC
              </p>
            </div>
          )}

          {paymentMethod === "qris" && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
              <QrCode className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <p className="text-sm text-purple-800 font-medium mb-4">
                Scan kode QR untuk melakukan pembayaran
              </p>
              <div className="w-48 h-48 bg-white border-2 border-purple-300 rounded-lg mx-auto flex items-center justify-center">
                <QrCode className="h-32 w-32 text-purple-300" />
              </div>
            </div>
          )}

          {paymentMethod === "ewallet" && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
              <Wallet className="h-12 w-12 text-orange-600 mx-auto mb-3" />
              <p className="text-sm text-orange-800 font-medium">
                Pilih aplikasi e-wallet (GoPay, OVO, Dana, ShopeePay)
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isProcessing}
          >
            Batal
          </button>
          <button
            onClick={handlePayment}
            className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center"
            disabled={
              isProcessing ||
              (paymentMethod === "cash" && cashAmountNum < total)
            }
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Memproses...
              </>
            ) : (
              `Bayar Rp ${total.toLocaleString('id-ID')}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}