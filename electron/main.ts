import { app, BrowserWindow } from "electron"
import path from "path"

let win: BrowserWindow | null = null

const createWindow = () => {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false, // <-- ça peut être le souci
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // optionnel si t'en as pas
    },
  })

  win.loadFile(path.join(__dirname, "../dist/index.html"))

  // 👇 Assure-toi que ça existe
  win.once("ready-to-show", () => {
    win?.show()
  })
}

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
