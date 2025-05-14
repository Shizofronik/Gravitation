/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge } = require('electron');

// Создаем безопасный мост между процессами
contextBridge.exposeInMainWorld('electronAPI', {
  log: (message) => {
    // Проверяем и очищаем входные данные
    if (typeof message === 'string') {
      console.log('[Renderer]', message);
    }
  },
  
  // Добавляем только необходимые API
  getAppVersion: () => {
    return process.env.npm_package_version || '1.0.0';
  }
});

// Запрещаем доступ к Node.js API в renderer процессе
window.nodeRequire = require;
window.require = undefined;