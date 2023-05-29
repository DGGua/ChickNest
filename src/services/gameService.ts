/**
 * @important 这个文件是一坨大便，比别的代码还答辩
 */


import * as dayjs from 'dayjs';
declare global {
    interface Window {
        chrome: any;
    }
}

let globalConfig: Record<string, any> = {}

const defaultConfig: Record<string, any> = {
    theme: 0,
    score: 0,
    lastTime: dayjs.default('2019-01-25').toISOString(),
    keys: [],
    birds: Array(30).fill(false).map(() => Math.ceil(Math.random() * 16))
}

export const THEME = ["Red", "Green", "Yellow", "Blue"]

function fetchGlobalConfig(): Promise<{ data: { data: Record<string, any> } }> {
    window.chrome.webview?.postMessage({ action: "FetchData", filename: "config.json" })
    if (window.chrome.webview) {
        return new Promise((resolve) => {
            window.chrome.webview?.addEventListener("message", resolve, { once: true });
        });
    } else {
        return Promise.resolve({ data: { data: globalConfig } })
    }
}
function putGlobalConfig() {
    window.chrome.webview?.postMessage({ action: "WriteData", filename: "config.json", data: globalConfig })
    if (window.chrome.webview) {
        return new Promise((resolve) => {
            window.chrome.webview?.addEventListener("message", resolve, { once: true });
        });
    } else {
        return Promise.resolve()
    }
}
async function getDuration(time: string) {
    window.chrome.webview?.postMessage({ action: "FocusDuration", from: await getGLobalData("lastTime"), to: time })
    if (window.chrome.webview) {
        return new Promise<{ data: { data: any[] } }>((resolve) => {
            window.chrome.webview?.addEventListener("message", resolve, { once: true });
        });
    } else {
        return Promise.resolve({ data: { data: [{ name: "超级马里奥", duration: 3000 }, { name: "超级玛丽苏", duration: 200 }] } })
    }
}
async function getGLobalData(key: string) {
    if (Object.keys(globalConfig).length === 0) {
        globalConfig = (await fetchGlobalConfig()).data.data as Record<string, any>;
    }
    let ret = globalConfig[key]
    if (!!!globalConfig[key]) {
        await setGlobalData(key, defaultConfig[key])
        ret = defaultConfig[key]
    }
    return ret
}

async function setGlobalData(key: string, value: any) {
    globalConfig[key] = value;
    await putGlobalConfig();

}

export const gameService = {
    getBackGround: () => {
        return getGLobalData("theme")
    },
    setBackGround: (index: number) => {
        setGlobalData("theme", index)
    },
    getbirds: () => {
        return getGLobalData("birds")
    },
    addbird: (bird: number) => {
        gameService.getbirds().then((birds) =>
            setGlobalData("birds", [...birds, bird]));
    },
    updateDuration: async () => {
        console.log("updateDuration start ")
        const time = dayjs.default().toISOString()
        const rawdata = (await getDuration(time))
        await setGlobalData("lastTime", time)
        const data = rawdata.data.data
        const oldData = await getGLobalData("keys")
        console.log(data)
        console.log(rawdata)

        console.log("data")
        console.log(data)
        data.forEach(({ duration, name }) => {
            let find = false;
            for (let i = 0; i < oldData.length; i++) {
                if (oldData[i].name == name) {
                    oldData[i].duration += duration;
                    find = true;
                    break;
                }
            }
            if (!find) {
                oldData.push({ name, duration, checked: false })
            }
        })
        setGlobalData("keys", oldData)
        console.log("updateDuration enf")
    },
    getkeys: async () => {
        await gameService.updateDuration()
        return await getGLobalData("keys")
    },
    getScore: async () => {
        await gameService.updateDuration()
        return await getGLobalData("score")
    },
    setChecked: (cats: any[]) => {
        setGlobalData("keys", cats)
    }
}