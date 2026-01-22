# ShipradarUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.13.

## 📚 Documentation

- **[ROUTES_SIDEBAR_SYNC.md](ROUTES_SIDEBAR_SYNC.md)** - ⚠️ **BẮT BUỘC ĐỌC**: Đảm bảo routes và sidebar khớp nhau
- **[SIDEBAR_GUIDE.md](SIDEBAR_GUIDE.md)** - ⭐ Hướng dẫn thêm menu vào sidebar khi tạo page mới
- **[README_CRUD_IMPLEMENTATION.md](README_CRUD_IMPLEMENTATION.md)** - Tổng quan về các CRUD pages đã implement
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Template code để tạo các model còn lại

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## ⚠️ Important: Adding New Pages

**Whenever you create a new page/module, you MUST add it to the sidebar!**

See [SIDEBAR_GUIDE.md](SIDEBAR_GUIDE.md) for detailed instructions.

Quick steps:
1. Open `src/app/components/layouts/dashboard/dashboard-layout.module.ts`
2. Add your menu item to the `menus` array
3. Test the navigation

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
