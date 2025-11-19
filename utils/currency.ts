export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parseRupiahInput = (value: string): number => {
  return Number(value.replace(/[^0-9]/g, ''));
};

export const formatPoints = (points: number): string => {
  return new Intl.NumberFormat('id-ID').format(points);
};
