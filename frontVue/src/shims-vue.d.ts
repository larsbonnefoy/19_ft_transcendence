declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }
//   https://stackoverflow.com/questions/70895690/ts2307-cannot-find-module-app-vue-or-its-corresponding-type-declarations
//   https://stackoverflow.com/questions/54622621/what-does-the-shims-tsx-d-ts-file-do-in-a-vue-typescript-project/59788563#59788563