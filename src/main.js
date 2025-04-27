import { app, BrowserWindow, ipcMain } from 'electron'; // Add ipcMain import
import path from 'node:path';
import started from 'electron-squirrel-startup';
import fs from 'fs';
// 删除重复的path导入
// import path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// 添加全局配置对象（取消注释并修正路径）
const configPath = path.join(__dirname, '../../app.config.json');
try {
  global.appConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  console.log('配置加载成功:', global.appConfig);
} catch (e) {
  console.error('配置加载失败:', e.message);
  process.exit(1);
}

// 在创建窗口前确保配置加载完成
function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // 修改为false
      contextIsolation: true, // 启用上下文隔离
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // 开发模式加载vite服务
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    // 打开开发者工具
    // mainWindow.webContents.openDevTools();
  } else {
    // 生产模式加载打包文件
    mainWindow.loadFile('.vite/build/index.html')
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// Add IPC handler after app is ready
app.whenReady().then(() => {
  createWindow();

  // Keep this single handler registration
  ipcMain.handle('get-app-config', () => {
    return global.appConfig;
  });

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
  app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const getResourcePath = (relativePath) => {
  return process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '..', relativePath)
    : path.join(process.resourcesPath, relativePath);
};

// 使用示例
const pythonPath = process.platform === 'win32'
  ? path.join(getResourcePath('venv'), 'Scripts', 'python.exe')
  : path.join(getResourcePath('venv'), 'bin', 'python');