import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

// ✅ IMPORT CHUẨN: Để không bị Deprecated, hãy dùng provideAnimationsAsync từ /animations/async
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Ng-Zorro imports
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';

// Ngx-Echarts imports
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Project imports
import { routes } from './app.routes';
import { ApiInterceptor } from '../shared';

registerLocaleData(en);

// Register ECharts components
echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer]);

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Tối ưu hiệu suất xử lý sự kiện
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 2. Định tuyến ứng dụng
    provideRouter(routes),

    // 3. ✅ FIX DEPRECATED: Cung cấp Animation theo cơ chế Async hiện đại
    // Giúp giảm dung lượng file main.js ban đầu
    provideAnimationsAsync(),

    // 4. ✅ HTTP CLIENT DUY NHẤT: Đã gộp các provideHttpClient thừa
    provideHttpClient(withInterceptors([ApiInterceptor])),

    // 5. Cấu hình đa ngôn ngữ cho Ng-Zorro
    provideNzI18n(en_US),

    // 6. Cấu hình Echarts
    provideEchartsCore({ echarts }),
  ],
};
