import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardLayout } from '../../../components/layouts/dashboard/dashboard-layout.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { RevenueSummary } from '../../../models/revenue.model';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    DashboardLayout,
    RouterLink,
    NzCardModule,
    NzStatisticModule,
    NzGridModule,
    NgxEchartsModule,
  ],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHomePage implements OnInit {
  summary: RevenueSummary = {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
    totalOrders: 0,
  };

  dailyChartOptions: EChartsOption = {};
  monthlyChartOptions: EChartsOption = {};

  ngOnInit() {
    this.loadSummary();
    this.loadDailyRevenueChart();
    this.loadMonthlyRevenueChart();
  }

  loadSummary() {
    // Mock data - tổng quan doanh thu
    this.summary = {
      today: 15000000,
      thisWeek: 85000000,
      thisMonth: 320000000,
      thisYear: 2500000000,
      totalOrders: 1250,
    };
  }

  loadDailyRevenueChart() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const today = currentDate.getDate();

    // Mock data - doanh thu theo ngày của tháng hiện tại
    const labels: string[] = [];
    const data: number[] = [];

    for (let day = 1; day <= today; day++) {
      labels.push(`Ngày ${day}`);
      // Random revenue từ 5 triệu đến 20 triệu
      const revenue = Math.floor(Math.random() * 15000000) + 5000000;
      data.push(revenue);
    }

    this.dailyChartOptions = {
      title: {
        text: `Doanh thu theo ngày - Tháng ${currentMonth + 1}/${currentYear}`,
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const value = params[0].value;
          return `${params[0].name}<br/>Doanh thu: ${this.formatCurrency(value)}`;
        },
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: {
          rotate: 45,
          interval: Math.floor(today / 10),
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => this.formatCurrencyShort(value),
        },
      },
      series: [
        {
          name: 'Doanh thu',
          type: 'line',
          data: data,
          smooth: true,
          itemStyle: {
            color: '#1890ff',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
              ],
            },
          },
        },
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
    };
  }

  loadMonthlyRevenueChart() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();

    // ============================================================
    // LOGIC GỐC - ĐÚNG YÊU CẦU (Comment tạm để test 3 tháng)
    // ============================================================
    // const labels: string[] = [];
    // const data: number[] = [];
    //
    // for (let month = 1; month <= currentMonth; month++) {
    //   labels.push(`Tháng ${month}`);
    //   // Random revenue từ 200 triệu đến 400 triệu
    //   const revenue = Math.floor(Math.random() * 200000000) + 200000000;
    //   data.push(revenue);
    // }

    // ============================================================
    // MOCK DATA TẠM - CHỈ 3 THÁNG ĐỂ TEST
    // ============================================================
    const labels = ['Tháng 11', 'Tháng 12', 'Tháng 1'];
    const data = [280000000, 350000000, 320000000]; // Doanh thu: 280M, 350M, 320M

    this.monthlyChartOptions = {
      title: {
        text: `Doanh thu theo tháng - Năm ${currentYear}`,
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const value = params[0].value;
          return `${params[0].name}<br/>Doanh thu: ${this.formatCurrency(value)}`;
        },
      },
      xAxis: {
        type: 'category',
        data: labels,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => this.formatCurrencyShort(value),
        },
      },
      series: [
        {
          name: 'Doanh thu',
          type: 'bar',
          data: data,
          itemStyle: {
            color: '#52c41a',
          },
          barWidth: '60%',
        },
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }

  formatCurrencyShort(value: number): string {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B';
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(0) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K';
    }
    return value.toString();
  }
}
