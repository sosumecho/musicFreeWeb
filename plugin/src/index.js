const path = require('path')
const Plugin = require('./plugin')
const axios = require('axios')
const fs = require('fs')
const {compare} = require("compare-versions")
const {rimraf} = require('rimraf')
let plugins= []


let _pluginBasePath;
function getPluginBasePath() {
  if (_pluginBasePath) {
    return _pluginBasePath;
  }
  _pluginBasePath = path.resolve(
      "./plugins"
  );
  return _pluginBasePath;
}

async function installPluginFromRemote(urlLike) {
  try {
    const url = urlLike.trim();
    if (url.endsWith(".js")) {
      await installPluginFromUrl(addRandomHash(url));
    } else if (url.endsWith(".json")) {
      const jsonFile = (await axios.get(addRandomHash(url))).data;

      for (const cfg of jsonFile?.plugins ?? []) {
        await installPluginFromUrl(addRandomHash(cfg.url));
      }
    }
  } catch (e) {
    throw e;
  }
}

async function deletePlugin(hash) {
  const plugin = plugins.find(p => p.hash === hash)
  if (plugin) {
    await rimraf(plugin.path)
  }
}

async function installPluginFromUrl(url) {
  try {
    const funcCode = (await axios.get(url)).data
    if (funcCode) {
      await installPluginFromRawCode(funcCode)
    }
  } catch (e) {
    throw new Error(e?.message ?? '')
  }
}

async function installPluginFromRawCode(funcCode) {
  const pluginBasePath = getPluginBasePath()
  const plugin = new Plugin(funcCode, '')
  const _pluginIndex = plugins.findIndex((p) => p.hash === plugin.hash)
  if (_pluginIndex !== -1) {
    // 静默忽略
    return
  }
  const oldVersionPlugin = plugins.find((p) => p.name === plugin.name)
  if (oldVersionPlugin) {
    if (compare(oldVersionPlugin.instance.version ?? '', plugin.instance.version ?? '', '>')) {
      throw new Error('已安装更新版本的插件')
    }
  }

  if (plugin.hash !== '') {
    const fn = plugin.hash
    const _pluginPath = path.resolve(pluginBasePath, `${fn}.js`)
    fs.writeFileSync(_pluginPath, funcCode, 'utf8')
    plugin.path = _pluginPath
    let newPlugins = plugins.concat(plugin)
    if (oldVersionPlugin) {
      newPlugins = newPlugins.filter((_) => _.hash !== oldVersionPlugin.hash)
      try {
        await rimraf(oldVersionPlugin.path)
      } catch {}
    }
    return
  }
  throw new Error('插件无法解析!')
}

function addRandomHash(url) {
  if (url.indexOf("#") === -1) {
    return `${url}#${Date.now()}`;
  }
  return url;
}


function loadAllPlugins() {
  const pluginBasePath = getPluginBasePath();
  const rawPluginNames =  fs.readdirSync(pluginBasePath);
  const pluginHashSet = new Set();
  const _plugins= [];
  for (let i = 0; i < rawPluginNames.length; ++i) {
    try {
      const pluginPath = path.resolve(pluginBasePath, rawPluginNames[i]);
      const filestat =  fs.statSync(pluginPath);
      if (filestat.isFile() && path.extname(pluginPath) === ".js") {
        const funcCode =  fs.readFileSync(pluginPath, "utf-8");
        const plugin = new Plugin(funcCode, pluginPath);
        if (pluginHashSet.has(plugin.hash)) {
          continue;
        }
        if (plugin.hash !== "") {
          pluginHashSet.add(plugin.hash);
          _plugins.push(plugin);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  plugins = _plugins
}



// const url  = "https://raw.niuma666bet.buzz/Huibq/keep-alive/master/Music_Free/myPlugins.json"



loadAllPlugins()


// console.log(process.argv)
const search = () => {
  const [,,, hash, keyword, page, type] = process.argv
  const plugin = plugins.find((p) => p.hash === hash)
  if(plugin) {
    plugin.instance.search(keyword, page, type).then((result) => {

      if (Array.isArray(result.data)) {
        result.data = result.data.map(m => {
          return {
            ...m,
            platform: plugin.name,
          }
        })
        if(result.isEnd !== false) {
          result.isEnd = true;
        }
      }

      console.log(JSON.stringify(result))
    })
  }
}

const getTopLists = (hash) => {
  const plugin = plugins.find(plugin => hash === plugin.hash)
  if(plugin) {
    plugin.instance.getTopLists().then(
      (result) => {
        console.log(JSON.stringify(result))
      })
    }
}

const getTopListDetail = () => {
  const [,,, name, item] = process.argv
  const topListItem = JSON.parse(item)

  const plugin = plugins.find(p => p.name === name)

  if (plugin) {
    plugin.instance.getTopListDetail(topListItem).then((result) => {

      result.musicList = result.musicList.map(m => {
        return {
          ...m,
          platform: plugin.name,
        }
      })
      if(result.isEnd !== false) {
        result.isEnd = true;
      }
      console.log(JSON.stringify(result))
    })
  }
}



const getMediaSource = () => {
  const data = JSON.parse(process.argv[3])
  const quality = process.argv[4]

  const plugin = plugins.find(p => p.name === data.platform)

  if (plugin) {
    plugin.instance.getMediaSource({id: data.id}, quality).then((result) => {
      console.log(JSON.stringify(result))
    })
  }
}

const getRecommendSheetTags = () => {
  const plugin = plugins.find(plugin => plugin.hash === process.argv[3])
  if(plugin) {
    if(plugin.instance.getRecommendSheetTags) {
      plugin.instance.getRecommendSheetTags().then(data => {
      console.log(JSON.stringify(data))
    })
    } else {
      console.log(JSON.stringify({"data": []}))
    }

  }
}

const getRecommendSheetByTag = () => {
  const plugin = plugins.find(plugin => plugin.hash === process.argv[3])
  const tag = JSON.parse(process.argv[4])
  const page = process.argv[5]
  if(plugin) {
    if(plugin.instance.getRecommendSheetsByTag) {
      plugin.instance.getRecommendSheetsByTag(tag, page).then(result => {


        result.data = result.data.map(m => {
          return {
            ...m,
            platform: plugin.name,
          }
        })
        if(result.isEnd !== false) {
          result.isEnd = true;
        }
        console.log(JSON.stringify(result))
    })
    } else {
      console.log(JSON.stringify({
        isEnd: true,
        data: [],
      }))
    }

  }
}


const getMusicSheetInfo = () => {
  const sheet = JSON.parse(process.argv[3])
  const page = process.argv[4]
  const plugin = plugins.find(plugin => plugin.name === sheet.platform)
  if(plugin) {
    plugin.instance.getMusicSheetInfo(sheet,page).then(result => {
      result.musicList = result.musicList.map(m => {
        return {
          ...m,
          platform: plugin.name,
        }
      })
      if(result.isEnd !== false) {
        result.isEnd = true;
      }
      console.log(JSON.stringify(result))
    })
  }
}

if (process.argv.length < 3) {
  process.exit(-1)
}

switch (process.argv[2]) {
  case 'search':
    search()
    break;
  case 'plugins':
    console.log(JSON.stringify(plugins))
    break;
  case 'installPlugins':
    installPluginFromRemote(process.argv[3]).then(()=> {
      console.log(JSON.stringify({"data": "success"}))
    })
    break;
  case 'deletePlugin':
      deletePlugin(process.argv[3]).then(() => {
        console.log(JSON.stringify({"data": "success"}))
      })
      break;
  case 'getPlugin':
    const plugin = plugins.filter(plugin => plugin.hash === process.argv[3])
    console.log(JSON.stringify(plugin))
    break
  case 'supportPlugins':
    const supportPlugins = plugins.filter(plugin => plugin.instance[process.argv[3]])
    console.log(JSON.stringify(supportPlugins))
    break;
  case "searchablePlugins":
    const searchablePlugins = plugins.filter(plugin => plugin.instance["search"] && plugin.instance.supportedSearchType.indexOf(process.argv[3]) > -1)
    console.log(JSON.stringify(searchablePlugins))
    break;
  case 'getAlbumInfo':
      break;
  case 'getTopLists':
    getTopLists(process.argv[3])
    break;
  case 'getTopListDetail':
    getTopListDetail()
    break;
  case 'getRecommendSheetTags':
    getRecommendSheetTags()
    break;
  case 'getRecommendSheetByTag':
    getRecommendSheetByTag()
    break;
  case 'getLyric':
    break;
  case 'getMediaSource':
    getMediaSource()
    break;
  case 'getMusicSheetInfo':
    getMusicSheetInfo()
    break;
  default:
    process.exit(-1)
}

