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
  RefreshCw,
  HelpCircle,
  X,
  CheckCheck,
  AlertOctagon
} from 'lucide-react';

// Constants
const POINT_CONVERSION_RATE = 2500; // 1 Point = 2500 IDR

export default function App() {
  const [totalTransaction, setTotalTransaction] = useState<number>(0);
  const [memberPoints, setMemberPoints] = useState<number>(0);
  const [voucherValue, setVoucherValue] = useState<number>(0);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  
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
        <div className="bg-[#0f4372] p-6 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center space-x-3">
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
          <button 
            onClick={() => setShowHelp(true)}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            title="Panduan & Komparasi"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
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

      {/* HELP MODAL */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f4372]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col relative">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#f8fafc] border-b border-gray-200 flex justify-between items-center sticky top-0 z-10 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-[#0f4372] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#e55541]" />
                  Kenapa Pakai App Ini?
                </h2>
                <p className="text-sm text-[#648aa3]">Komparasi Cara Manual vs Smart Split</p>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-[#e55541]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              
              {/* Case 1 */}
              <div className="border rounded-xl p-5 bg-white shadow-sm">
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-[#e55541]/10 text-[#e55541] text-xs font-bold rounded mb-2">CASE 1: HUMAN ERROR</div>
                  <h3 className="font-bold text-lg text-[#0f4372]">Belanja 3 Juta, Poin Banyak, Voucher 700rb</h3>
                  <p className="text-sm text-gray-500">Total: 3.015.000 | Poin: 3.000 (7.5 Juta) | Voucher: 700.000</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Manual */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="flex items-center gap-2 mb-3 text-red-700 font-bold border-b border-red-200 pb-2">
                      <AlertOctagon className="w-4 h-4" /> Cara Manual (Berisiko)
                    </div>
                    <ul className="space-y-2 text-sm text-red-800/80">
                      <li className="flex gap-2">
                        <span className="font-bold">1.</span> 
                        <span>Kasir harus hitung: (3.015.000 - 700.000) / 2500.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">2.</span> 
                        <span>Rawan salah ketik di kalkulator (misal lupa bagi 2500).</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">3.</span> 
                        <span>Jika salah input poin full (3000), sisa tagihan 0. <span className="font-bold underline">Voucher 700rb HANGUS.</span></span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* App */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 mb-3 text-green-700 font-bold border-b border-green-200 pb-2">
                      <CheckCheck className="w-4 h-4" /> Cara Smart Split
                    </div>
                    <ul className="space-y-2 text-sm text-green-800/80">
                      <li className="flex gap-2">
                        <span className="font-bold">1.</span> 
                        <span>Input angka saja. App otomatis hitung sisa ruang.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">2.</span> 
                        <span>Langsung muncul perintah: <span className="font-bold bg-white px-1 rounded">"Input 926 Poin"</span>.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">3.</span> 
                        <span>Dijamin sisa tagihan tepat 700.000 untuk voucher.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Case 2 */}
              <div className="border rounded-xl p-5 bg-white shadow-sm">
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-[#f6b742]/10 text-[#f6b742] text-xs font-bold rounded mb-2">CASE 2: JEBAKAN LOGIKA</div>
                  <h3 className="font-bold text-lg text-[#0f4372]">Belanja 500rb, Poin Pas-pasan, Voucher 200rb</h3>
                  <p className="text-sm text-gray-500">Total: 500.000 | Poin: 182 (455rb) | Voucher: 200.000</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Manual */}
                   <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="flex items-center gap-2 mb-3 text-red-700 font-bold border-b border-red-200 pb-2">
                      <AlertOctagon className="w-4 h-4" /> Cara Manual (Rugi)
                    </div>
                    <p className="text-sm text-red-800/80 mb-2">
                      Kasir lihat poin (455rb) hampir cukup lunasin 500rb.
                    </p>
                    <div className="text-sm bg-white/50 p-2 rounded text-red-900 font-mono">
                      Bayar Poin 455rb &rarr; Sisa 45rb.<br/>
                      Voucher 200rb cuma kepakai 45rb.<br/>
                      <span className="font-bold text-red-600">CUSTOMER RUGI 155.000!</span>
                    </div>
                  </div>

                  {/* App */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 mb-3 text-green-700 font-bold border-b border-green-200 pb-2">
                      <CheckCheck className="w-4 h-4" /> Cara Smart Split
                    </div>
                    <p className="text-sm text-green-800/80 mb-2">
                      App "menahan" penggunaan poin agar voucher masuk dulu.
                    </p>
                     <div className="text-sm bg-white/50 p-2 rounded text-green-900 font-mono">
                      App perintah: "Input 120 Poin (300rb) saja".<br/>
                      Sisa tagihan jadi 200rb.<br/>
                      Voucher 200rb masuk <span className="font-bold">FULL 100%</span>.
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-6 bg-gray-50 border-t rounded-b-2xl text-center">
               <button 
                onClick={() => setShowHelp(false)}
                className="px-8 py-3 bg-[#0f4372] text-white font-bold rounded-xl hover:bg-[#0a2e4f] transition-colors"
               >
                 Mengerti, Tutup Panduan
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}