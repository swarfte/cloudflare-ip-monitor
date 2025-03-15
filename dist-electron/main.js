import { app as n, BrowserWindow as i } from "electron";
import o from "path";
import { fileURLToPath as e } from "url";
const r = e(import.meta.url), t = o.dirname(r);
n.whenReady().then(() => {
  new i({
    title: "Cloudflare Ip Monitor",
    icon: o.join(t, "../public/icon.png")
  }).loadURL(`${process.env.VITE_DEV_SERVER_URL}`);
});
