import React, { useState, useMemo } from 'react';
import { NumberInput } from './components/NumberInput';
import { formatPoints, formatRupiah } from './utils/currency';
import { 
  Calculator, 
  CreditCard, 
  Ticket, 
  Coins, 
  ArrowDown, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  RefreshCw
} from 'lucide-react';

// Constants
const POINT_CONVERSION_RATE = 2500; // 1 Point = 2500 IDR

export default function App() {
  const [totalTransaction, setTotalTransaction] = useState<number>(0);
  const [memberPoints, setMemberPoints] = useState<number>(0);
  const [voucherValue, setVoucherValue] = useState<number>(0);
  
  // Calculation Logic
  const calculation = useMemo(() => {
    // 1. Determine max points we CAN use without making the voucher useless
    // We want (Total - PointsValue) >= VoucherValue
    // So, PointsValue <= Total - VoucherValue
    const maxPointValueToKeepVoucherSpace = Math.max(0, totalTransaction - voucherValue);
    
    // Convert that Rupiah value to Points (rounding down to be safe)
    const maxPointsUsable = Math.floor(maxPointValueToKeepVoucherSpace / POINT_CONVERSION_RATE);

    // 2. Actual points to input (Min of what customer has vs what we calculated)
    const pointsToRedeem = Math.min(memberPoints, maxPointsUsable);
    
    // 3. Convert back to Rupiah to see impact
    const pointsRupiahValue = pointsToRedeem * POINT_CONVERSION_RATE;

    // 4. Remaining Balance
    const remainingAfterPoints = totalTransaction - pointsRupiahValue;

    // 5. Voucher Application
    // If remaining is still less than voucher (shouldn't happen with logic above unless total < voucher), cap it
    const voucherUsedAmount = Math.min(remainingAfterPoints, voucherValue);
    
    // 6. Final Pay
    const finalToPay = remainingAfterPoints - voucherUsedAmount;

    // Warnings
    const unusedVoucherValue = voucherValue - voucherUsedAmount;
    const leftOverPoints = memberPoints - pointsToRedeem;

    return {
      pointsToRedeem,
      pointsRupiahValue,
      remainingAfterPoints,
      voucherUsedAmount,
      finalToPay,
      unusedVoucherValue,
      leftOverPoints
    };
  }, [totalTransaction, memberPoints, voucherValue]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col md:flex-row font-sans text-[#0f4372]">
      {/* Left Panel: Inputs */}
      <div className="w-full md:w-5/12 lg:w-4/12 bg-white shadow-xl z-20 overflow-y-auto h-auto md:h-screen flex flex-col border-r border-[#e5e7eb]">
        {/* Header / Logo - Informa Blue Background */}
        <div className="bg-[#0f4372] p-6 flex items-center space-x-3 shadow-md z-10">
          {/* Simple SVG Logo Representation - White bg for contrast */}
          <div className="bg-white text-[#e55541] p-2 rounded-lg shadow-sm shrink-0">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Informa POS Helper</h1>
            <p className="text-xs text-blue-100/80 font-medium">Kalkulator Split Payment Poin & Voucher</p>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-6 flex-grow">
            <NumberInput
              label="1. Total Transaksi"
              value={totalTransaction}
              onChange={setTotalTransaction}
              icon={<CreditCard className="w-5 h-5" />}
              helperText="Total nominal di struk"
            />

            <div className="p-5 bg-[#f0f9f6] rounded-xl border border-[#83baa3]/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-12 h-12 bg-[#83baa3]/20 rounded-full blur-lg"></div>
              <NumberInput
                label="2. Saldo Poin Member"
                value={memberPoints}
                onChange={setMemberPoints}
                isCurrency={false}
                icon={<Coins className="w-5 h-5" />}
                helperText={`Nilai Tunai: ${formatRupiah(memberPoints * POINT_CONVERSION_RATE)}`}
              />
              <div className="flex items-center text-xs text-[#0f4372]/70 mt-[-12px] mb-1 italic bg-white/60 w-fit px-2 py-1 rounded">
                 <Sparkles className="w-3 h-3 mr-1 text-[#f6b742]" />
                 1 Poin = Rp 2.500
              </div>
            </div>

            <NumberInput
              label="3. Total Nilai Voucher"
              value={voucherValue}
              onChange={setVoucherValue}
              icon={<Ticket className="w-5 h-5" />}
              helperText="Voucher fisik/digital"
            />
          </div>

          {/* Footer Actions Left */}
          <div className="mt-8 pt-6 border-t border-gray-100">
             <button 
              onClick={() => {
                setTotalTransaction(0);
                setMemberPoints(0);
                setVoucherValue(0);
              }}
              className="w-full group flex items-center justify-center py-3 text-[#648aa3] hover:text-[#e55541] font-semibold text-sm transition-all border border-dashed border-gray-300 hover:border-[#e55541] rounded-xl hover:bg-[#e55541]/5"
            >
              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Reset Kalkulator
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Results */}
      <div className="w-full md:w-7/12 lg:w-8/12 p-4 md:p-10 overflow-y-auto h-auto md:h-screen bg-[#f8fafc] flex flex-col relative">
        <div className="max-w-3xl mx-auto w-full flex-grow">
          
          {totalTransaction > 0 ? (
            <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#83baa3] rounded-full shadow-sm text-white">
                   <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0f4372]">Strategi Pembayaran</h2>
                  <p className="text-[#648aa3] text-sm">Ikuti urutan prioritas di bawah ini</p>
                </div>
              </div>

              {/* Timeline/Steps Container */}
              <div className="relative space-y-4">
                {/* Step 1: Points */}
                <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-l-[#e55541] ring-1 ring-black/5 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#e55541] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Langkah 1</span>
                          <h3 className="text-lg font-bold text-[#0f4372]">Prioritas 1: Poin yang Harus Di-Input</h3>
                        </div>
                        <p className="text-sm text-[#648aa3]">
                          Input jumlah poin ini terlebih dahulu.
                        </p>
                      </div>
                      <div className="text-right bg-[#fff5f3] px-4 py-2 rounded-lg border border-[#e55541]/10">
                        <div className="text-3xl font-bold text-[#e55541] font-mono">
                          {formatPoints(calculation.pointsToRedeem)}
                        </div>
                        <div className="text-xs font-semibold text-[#e55541]/70 uppercase tracking-wide">Poin</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between bg-[#f9fafb] -mx-6 -mb-6 px-6 py-3 border-t border-gray-100">
                      <span className="text-sm font-medium text-[#648aa3]">Konversi Rupiah Poin</span>
                      <span className="font-bold text-[#0f4372]">{formatRupiah(calculation.pointsRupiahValue)}</span>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center">
                  <ArrowDown className="w-5 h-5 text-[#83baa3]" />
                </div>

                {/* Intermediate */}
                <div className="text-center">
                   <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#83baa3]/10 text-[#83baa3] text-xs font-bold border border-[#83baa3]/20">
                     Sisa Tagihan (Setelah Poin): {formatRupiah(calculation.remainingAfterPoints)}
                   </span>
                </div>

                {/* Arrow Connector */}
                 <div className="flex justify-center">
                  <ArrowDown className="w-5 h-5 text-[#83baa3]" />
                </div>

                {/* Step 2: Voucher */}
                <div className={`bg-white rounded-2xl shadow-sm border-l-[6px] ${calculation.voucherUsedAmount > 0 ? 'border-l-[#f6b742]' : 'border-l-gray-300'} ring-1 ring-black/5 overflow-hidden hover:shadow-md transition-shadow`}>
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#f6b742] text-[#0f4372] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Langkah 2</span>
                          <h3 className="text-lg font-bold text-[#0f4372]">Prioritas 2: Voucher</h3>
                        </div>
                        {calculation.unusedVoucherValue > 0 ? (
                           <div className="flex items-center mt-1 text-[#e55541] text-sm font-medium bg-[#e55541]/5 px-2 py-1 rounded w-fit">
                             <AlertTriangle className="w-4 h-4 mr-1.5" />
                             Sisa voucher {formatPoints(calculation.unusedVoucherValue)} tidak terpakai
                           </div>
                        ) : (
                          <p className="text-sm text-[#648aa3]">Gunakan voucher setelah poin.</p>
                        )}
                      </div>
                      <div className="text-right bg-[#fffbf2] px-4 py-2 rounded-lg border border-[#f6b742]/20">
                        <div className="text-2xl font-bold text-[#0f4372] font-mono">
                          {formatRupiah(calculation.voucherUsedAmount)}
                        </div>
                        <div className="text-xs font-semibold text-[#f6b742] uppercase tracking-wide">Nilai Voucher</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center">
                  <ArrowDown className="w-5 h-5 text-[#0f4372]" />
                </div>

                {/* Step 3: Final Payment */}
                <div className="bg-[#0f4372] rounded-2xl shadow-lg text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-[#648aa3] opacity-20 rounded-full blur-3xl"></div>
                  <div className="p-6 relative z-10">
                     <div className="flex justify-between items-center mb-4">
                        <div className="text-xs font-bold text-[#83baa3] uppercase tracking-widest border border-[#83baa3] px-2 py-1 rounded">Langkah 3</div>
                        <div className="text-xs text-gray-300 font-medium flex items-center">
                          <CreditCard className="w-3 h-3 mr-1" /> Cash / Debit / QRIS
                        </div>
                     </div>
                     <div className="flex flex-col sm:flex-row justify-between items-end gap-2">
                        <div className="text-sm text-gray-300 max-w-xs leading-relaxed">
                           Sisa Akhir (Pelunasan)
                        </div>
                        <div className="text-4xl font-bold text-white font-mono tracking-tight">
                          {formatRupiah(calculation.finalToPay)}
                        </div>
                     </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            // Empty State
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 mt-10 md:mt-0">
              <div className="bg-white p-8 rounded-full shadow-sm mb-6 ring-1 ring-gray-100">
                <Calculator className="w-16 h-16 text-[#83baa3]" />
              </div>
              <h3 className="text-xl font-bold text-[#0f4372] mb-2">Siap Menghitung</h3>
              <p className="max-w-xs mx-auto text-[#648aa3] leading-relaxed">
                Masukkan data transaksi di panel kiri. Aplikasi akan otomatis menghitung split payment paling efisien.
              </p>
            </div>
          )}
        </div>

        {/* Copyright Footer */}
        <div className="mt-10 pb-2 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs font-medium text-[#648aa3]">
            © {new Date().getFullYear()} Ulfah D Hikmah - OMT HCI 17 <span className="mx-1 text-[#e55541]">•</span> Internal Use Only
          </p>
        </div>
      </div>
    </div>
  );
}