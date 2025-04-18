const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');


let mainWindow;
// 创建窗口
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, '/logo.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    });
    // 加载的文件
    mainWindow.loadFile('index.html');


    mainWindow.on('close', (event) => {
        if (app.isQuitting) {
            mainWindow = null;
        } else {
            event.preventDefault();
            mainWindow.hide();
        }
    });
}

// 监听应用准备完成事件
app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong');
    createWindow()

    tray = new Tray(path.join(__dirname, '/logo.ico'));

    const contextMenu = Menu.buildFromTemplate([
        { label: '打开应用', click: () => mainWindow.show() },
        { label: '退出应用', click: () => app.quit() }
    ])

    // 设置系统托盘图标和菜单
    tray.setToolTip('EDR');
    tray.setContextMenu(contextMenu);

    // 点击系统托盘图标显示窗口
    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });

    // macOS特有事件
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
});


// 监听窗口关闭事件
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});