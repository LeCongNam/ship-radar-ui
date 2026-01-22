/**
 * Model cho dữ liệu doanh thu
 */

/**
 * Doanh thu theo ngày
 */
export interface DailyRevenue {
  date: string; // Format: YYYY-MM-DD
  revenue: number; // Doanh thu (VND)
  orders: number; // Số đơn hàng
}

/**
 * Doanh thu theo tháng
 */
export interface MonthlyRevenue {
  month: number; // Tháng (1-12)
  year: number; // Năm
  revenue: number; // Doanh thu (VND)
  orders: number; // Số đơn hàng
  growth: number; // Tăng trưởng so với tháng trước (%)
}

/**
 * Tổng quan doanh thu
 */
export interface RevenueSummary {
  today: number; // Doanh thu hôm nay
  thisWeek: number; // Doanh thu tuần này
  thisMonth: number; // Doanh thu tháng này
  thisYear: number; // Doanh thu năm nay
  totalOrders: number; // Tổng số đơn hàng
}

/**
 * Dữ liệu cho chart doanh thu theo ngày
 */
export interface DailyRevenueChartData {
  labels: string[]; // Danh sách ngày (1, 2, 3, ...)
  data: number[]; // Doanh thu tương ứng
  orders: number[]; // Số đơn hàng tương ứng
}

/**
 * Dữ liệu cho chart doanh thu theo tháng
 */
export interface MonthlyRevenueChartData {
  labels: string[]; // Danh sách tháng (T1, T2, ...)
  data: number[]; // Doanh thu tương ứng
  orders: number[]; // Số đơn hàng tương ứng
  growth: number[]; // Tăng trưởng tương ứng (%)
}
