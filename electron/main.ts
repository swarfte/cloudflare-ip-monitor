import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: "Cloudflare Ip Monitor",
    icon: path.join(__dirname, "../public/icon.png"),
  });
  win.loadURL(`${process.env.VITE_DEV_SERVER_URL as string}`);
});
