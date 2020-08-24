!function(e){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e;var t=function(){this._listeners={}};t.prototype.on=function(e,t){(this._listeners[e]=this._listeners[e]||[]).push(t)},t.prototype.trigger=function(e,t){(this._listeners[e]||[]).forEach((function(e){return e(t)}))},t.prototype.off=function(e){delete this._listeners[e]};var n=new(function(e){function t(){e.call(this),this.defaultRPC=[{name:"ARIA2 RPC",url:"http://localhost:6800/jsonrpc"}],this.defaultUserAgent="netdisk;2.2.51.6;netdisk;10.0.63;PC;android-android",this.defaultReferer="https://pan.baidu.com/disk/home",this.defaultAppId=250528,this.defaultConfigData={rpcList:this.defaultRPC,configSync:!1,md5Check:!1,svip:!1,fold:0,interval:300,downloadPath:"",userAgent:this.defaultUserAgent,referer:this.defaultReferer,appId:this.defaultAppId,headers:""},this.configData={},this.on("initConfigData",this.init.bind(this)),this.on("setConfigData",this.set.bind(this)),this.on("clearConfigData",this.clear.bind(this))}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.init=function(){var e=this;chrome.storage.sync.get(null,(function(e){var t=function(t){chrome.storage.local.set({key:e[t]},(function(){console.log("chrome first local set: %s, %s",t,e[t])}))};for(var n in e)t(n)})),chrome.storage.local.get(null,(function(t){e.configData=Object.assign({},e.defaultConfigData,t),e.trigger("updateView",e.configData)}))},t.prototype.getConfigData=function(e){return void 0===e&&(e=null),e?this.configData[e]:this.configData},t.prototype.set=function(e){this.configData=e,this.save(e),this.trigger("updateView",e)},t.prototype.save=function(e){var t,n,i=function(i){chrome.storage.local.set(((t={})[i]=e[i],t),(function(){console.log("chrome local set: %s, %s",i,e[i])})),!0===e.configSync&&chrome.storage.sync.set(((n={})[i]=e[i],n),(function(){console.log("chrome sync set: %s, %s",i,e[i])}))};for(var o in e)i(o)},t.prototype.clear=function(){chrome.storage.sync.clear(),chrome.storage.local.clear(),this.configData=this.defaultConfigData,this.trigger("updateView",this.configData)},t}(t)),i=function(){this.cookies={}};i.prototype.httpSend=function(e,t,n){var i=e.url,o=e.options;fetch(i,o).then((function(e){e.ok?e.json().then((function(e){t(e)})):n(e)})).catch((function(e){n(e)}))},i.prototype.getConfigData=function(e){return void 0===e&&(e=null),n.getConfigData(e)},i.prototype.objectToQueryString=function(e){return Object.keys(e).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])})).join("&")},i.prototype.sendToBackground=function(e,t,n){chrome.runtime.sendMessage({method:e,data:t},n)},i.prototype.showToast=function(e,t){window.postMessage({type:"showToast",data:{message:e,type:t}},location.origin)},i.prototype.getHashParameter=function(e){var t=window.location.hash.substr(1);return new URLSearchParams(t).get(e)},i.prototype.formatCookies=function(){var e=[];for(var t in this.cookies)e.push(t+"="+this.cookies[t]);return e.join("; ")},i.prototype.getHeader=function(e){void 0===e&&(e="RPC");var t=[];t.push("User-Agent: "+this.getConfigData("userAgent")),t.push("Referer: "+this.getConfigData("referer")),Object.keys(this.cookies).length>0&&t.push("Cookie: "+this.formatCookies());var n=this.getConfigData("headers");return n&&n.split("\n").forEach((function(e){t.push(e)})),"RPC"===e?t:"aria2Cmd"===e?t.map((function(e){return"--header "+JSON.stringify(e)})).join(" "):"aria2c"===e?t.map((function(e){return" header="+e})).join("\n"):"idm"===e?t.map((function(e){var t=e.split(": ");return t[0].toLowerCase()+": "+t[1]})).join("\r\n"):void 0},i.prototype.parseURL=function(e){var t=new URL(e),n=t.username?t.username+":"+decodeURI(t.password):null;n&&(n.includes("token:")||(n="Basic "+btoa(n)));var i=t.hash.substr(1),o={},s=new URLSearchParams(i);for(var r of s)o[r[0]]=2===r.length?r[1]:"enabled";return{authStr:n,path:t.origin+t.pathname,options:o}},i.prototype.generateParameter=function(e,t,n){e&&e.startsWith("token")&&n.params.unshift(e);var i={url:t,options:{method:"POST",headers:{"Content-type":"application/x-www-form-urlencoded; charset=UTF-8"},body:JSON.stringify(n)}};return e&&e.startsWith("Basic")&&(i.options.headers.Authorization=e),i},i.prototype.getVersion=function(e,t){var n=this.parseURL(e),i=n.authStr,o=n.path;this.sendToBackground("rpcVersion",this.generateParameter(i,o,{jsonrpc:"2.0",method:"aria2.getVersion",id:1,params:[]}),(function(e){t.innerText=e?"Aria2版本为: "+e:"错误,请查看是否开启Aria2"}))},i.prototype.copyText=function(e){var t=document.createElement("textarea");document.body.appendChild(t),t.value=e,t.focus(),t.select();var n=document.execCommand("copy");t.remove(),n?this.showToast("拷贝成功~","success"):this.showToast("拷贝失败 QAQ","failure")},i.prototype.requestCookies=function(e){var t=this;this.sendToBackground("getCookies",e,(function(e){t.cookies=e}))},i.prototype.aria2RPCMode=function(e,t){var n=this,i=this.parseURL(e),o=i.authStr,s=i.path,r=i.options;t.forEach((function(e){var t=[];t=Array.isArray(e.link)?e.link:[e.link];var i={jsonrpc:"2.0",method:"aria2.addUri",id:(new Date).getTime(),params:[t,{out:e.name,header:n.getHeader()}]},a=n.getConfigData("md5Check"),c=i.params[1],l=n.getConfigData("downloadPath");if(l&&(c.dir=l),a&&(c.checksum="md5="+e.md5),r)for(var u in r)c[u]=r[u];n.sendToBackground("rpcData",n.generateParameter(o,s,i),(function(e){e?n.showToast("下载成功!赶紧去看看吧~","success"):n.showToast("下载失败!是不是没有开启Aria2?","failure")}))}))},i.prototype.aria2TXTMode=function(e){var t=this,n=[],i=[],o=[],s=[],r="data:text/plain;charset=utf-8,";e.forEach((function(e){var r="";r=Array.isArray(e.link)?e.link.join(" "):e.link;var a="aria2c -c -s10 -k1M -x16 --enable-rpc=false -o "+JSON.stringify(e.name)+" "+t.getHeader("aria2Cmd")+" "+JSON.stringify(r),c=[r,t.getHeader("aria2c")," out="+e.name].join("\n");t.getConfigData("md5Check")&&(a+=" --checksum=md5="+e.md5,c+="\n checksum=md5="+e.md5),n.push(a),i.push(c);var l=["<",r,t.getHeader("idm"),">"].join("\r\n");o.push(l),s.push(r)})),document.querySelector("#aria2CmdTxt").value=""+n.join("\n"),document.querySelector("#aria2Txt").href=""+r+encodeURIComponent(i.join("\n")),document.querySelector("#idmTxt").href=""+r+encodeURIComponent(o.join("\r\n")+"\r\n"),document.querySelector("#downloadLinkTxt").href=""+r+encodeURIComponent(s.join("\n")),document.querySelector("#copyDownloadLinkTxt").dataset.link=s.join("\n")};var o=new i,s=function(){var e=this;this.version="1.0.4",this.updateDate="2019/11/18",n.on("updateView",(function(t){e.updateSetting(t),e.updateMenu(t)}))};s.prototype.init=function(){this.addSettingUI(),this.addTextExport(),n.trigger("initConfigData")},s.prototype.addMenu=function(e,t){e.insertAdjacentHTML(t,'\n      <div id="exportMenu" class="g-dropdown-button">\n        <a class="g-button">\n          <span class="g-button-right">\n            <em class="icon icon-download"></em>\n            <span class="text">导出下载</span>\n          </span>\n        </a>\n        <div id="aria2List" class="menu" style="z-index:50;">\n          <a class="g-button-menu" id="aria2Text" href="javascript:void(0);">文本导出</a>\n          <a class="g-button-menu" id="settingButton" href="javascript:void(0);">设置</a>\n        </div>\n      </div>');var n=document.querySelector("#exportMenu");n.addEventListener("mouseenter",(function(){n.classList.add("button-open")})),n.addEventListener("mouseleave",(function(){n.classList.remove("button-open")}));var i=document.querySelector("#settingButton"),o=document.querySelector("#settingMenu");i.addEventListener("click",(function(){o.classList.add("open-o")}))},s.prototype.resetMenu=function(){Array.from(document.querySelectorAll(".rpc-button")).forEach((function(e){e.remove()}))},s.prototype.updateMenu=function(e){this.resetMenu();var t=e.rpcList,n="";t.forEach((function(e){var t='<a class="g-button-menu rpc-button" href="javascript:void(0);" data-url='+e.url+">"+e.name+"</a>";n+=t})),document.querySelector("#aria2List").insertAdjacentHTML("afterbegin",n)},s.prototype.addTextExport=function(){var e=this;document.body.insertAdjacentHTML("beforeend",'\n      <div id="textMenu" class="modal export-menu">\n        <div class="modal-inner">\n          <div class="modal-header">\n            <div class="modal-title">文本导出</div>\n            <div class="modal-close">×</div>\n          </div>\n          <div class="modal-body">\n            <div class="export-menu-row">\n              <a class="export-menu-button" href="javascript:void(0);" id="aria2Txt" download="aria2c.down">存为Aria2文件</a>\n              <a class="export-menu-button" href="javascript:void(0);" id="idmTxt" download="idm.ef2">存为IDM文件</a>\n              <a class="export-menu-button" href="javascript:void(0);" id="downloadLinkTxt" download="link.txt">保存下载链接</a>\n              <a class="export-menu-button" href="javascript:void(0);" id="copyDownloadLinkTxt">拷贝下载链接</a>\n            </div>\n            <div class="export-menu-row">\n              <textarea class="export-menu-textarea" type="textarea" wrap="off" spellcheck="false" id="aria2CmdTxt"></textarea>\n            </div>\n          </div>\n        </div>\n      </div>');var t=document.querySelector("#textMenu"),n=t.querySelector(".modal-close"),i=t.querySelector("#copyDownloadLinkTxt");i.addEventListener("click",(function(){o.copyText(i.dataset.link)})),n.addEventListener("click",(function(){t.classList.remove("open-o"),e.resetTextExport()}))},s.prototype.resetTextExport=function(){var e=document.querySelector("#textMenu");e.querySelector("#aria2Txt").href="",e.querySelector("#idmTxt").href="",e.querySelector("#downloadLinkTxt").href="",e.querySelector("#aria2CmdTxt").value="",e.querySelector("#copyDownloadLinkTxt").dataset.link=""},s.prototype.addSettingUI=function(){var e=this,t='\n      <div id="settingMenu" class="modal setting-menu">\n        <div class="modal-inner">\n          <div class="modal-header">\n            <div class="modal-title">导出设置</div>\n            <div class="modal-close">×</div>\n          </div>\n          <div class="modal-body">\n            <div class="setting-menu-message">\n              <label class="setting-menu-label orange-o" id="message"></label>\n            </div>\n            <div class="setting-menu-row rpc-s">\n              <div class="setting-menu-name">\n                <input class="setting-menu-input name-s" spellcheck="false">\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input url-s" spellcheck="false">\n                <a class="setting-menu-button" id="addRPC" href="javascript:void(0);">添加RPC地址</a>\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">配置同步</label>\n              </div>\n              <div class="setting-menu-value">\n                <input type="checkbox" class="setting-menu-checkbox configSync-s">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">MD5校验</label>\n              </div>\n              <div class="setting-menu-value">\n                <input type="checkbox" class="setting-menu-checkbox md5Check-s">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">我是SVIP</label>\n              </div>\n              <div class="setting-menu-value">\n                <input type="checkbox" class="setting-menu-checkbox svip-s">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n               <div class="setting-menu-name">\n                 <label class="setting-menu-label">文件夹层数</label>\n               </div>\n               <div class="setting-menu-value">\n                 <input class="setting-menu-input small-o fold-s" type="number" spellcheck="false">\n                 <label class="setting-menu-label">(默认0表示不保留,-1表示保留完整路径)</label>\n               </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">递归下载间隔</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input small-o interval-s" type="number" spellcheck="false">\n                <label class="setting-menu-label">(单位:毫秒)</label>\n                <a class="setting-menu-button version-s" id="testAria2" href="javascript:void(0);">测试连接，成功显示版本号</a>\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">下载路径</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input downloadPath-s" placeholder="只能设置为绝对路径" spellcheck="false">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">User-Agent</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input userAgent-s" spellcheck="false">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">Referer</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input referer-s" spellcheck="false">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">AppId</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input app_id-s" spellcheck="false">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">Headers</label>\n              </div>\n              <div class="setting-menu-value">\n                <textarea class="setting-menu-input textarea-o headers-s" type="textarea" spellcheck="false"></textarea>\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n          </div>\x3c!-- /.setting-menu-body --\x3e\n          <div class="modal-footer">\n            <div class="setting-menu-copyright">\n              <div class="setting-menu-item">\n                <label class="setting-menu-label">&copy; Copyright</label>\n                <a class="setting-menu-link" href="https://github.com/acgotaku/BaiduExporter" target="_blank">雪月秋水</a>\n              </div>\n              <div class="setting-menu-item">\n                <label class="setting-menu-label">Version: '+this.version+'</label>\n                <label class="setting-menu-label">Update date: '+this.updateDate+'</label>\n              </div>\n            </div>\x3c!-- /.setting-menu-copyright --\x3e\n            <div class="setting-menu-operate">\n              <a class="setting-menu-button large-o blue-o" id="apply" href="javascript:void(0);">应用</a>\n              <a class="setting-menu-button large-o" id="reset" href="javascript:void(0);">重置</a>\n            </div>\n          </div>\n        </div>\n      </div>';document.body.insertAdjacentHTML("beforeend",t);var i=document.querySelector("#settingMenu");i.querySelector(".modal-close").addEventListener("click",(function(){i.classList.remove("open-o"),e.resetSetting()})),document.querySelector("#addRPC").addEventListener("click",(function(){var e=document.querySelectorAll(".rpc-s");Array.from(e).pop().insertAdjacentHTML("afterend",'\n        <div class="setting-menu-row rpc-s">\n          <div class="setting-menu-name">\n            <input class="setting-menu-input name-s" spellcheck="false">\n          </div>\n          <div class="setting-menu-value">\n            <input class="setting-menu-input url-s" spellcheck="false">\n          </div>\n        </div>\x3c!-- /.setting-menu-row --\x3e')}));var s=document.querySelector("#apply"),r=document.querySelector("#message");s.addEventListener("click",(function(){e.saveSetting(),r.innerText="设置已保存"})),document.querySelector("#reset").addEventListener("click",(function(){n.trigger("clearConfigData"),r.innerText="设置已重置"}));var a=document.querySelector("#testAria2");a.addEventListener("click",(function(){o.getVersion(n.getConfigData("rpcList")[0].url,a)}))},s.prototype.resetSetting=function(){document.querySelector("#message").innerText="",document.querySelector("#testAria2").innerText="测试连接，成功显示版本号"},s.prototype.updateSetting=function(e){var t=e.rpcList,n=e.configSync,i=e.md5Check,o=e.svip,s=e.fold,r=e.interval,a=e.downloadPath,c=e.userAgent,l=e.referer,u=e.appId,d=e.headers;Array.from(document.querySelectorAll(".rpc-s")).forEach((function(e,t){0!==t&&e.remove()})),t.forEach((function(e,t){var n=document.querySelectorAll(".rpc-s");if(0===t)n[t].querySelector(".name-s").value=e.name,n[t].querySelector(".url-s").value=e.url;else{var i='\n          <div class="setting-menu-row rpc-s">\n            <div class="setting-menu-name">\n              <input class="setting-menu-input name-s" value="'+e.name+'" spellcheck="false">\n            </div>\n            <div class="setting-menu-value">\n              <input class="setting-menu-input url-s" value="'+e.url+'" spellcheck="false">\n            </div>\n          </div>\x3c!-- /.setting-menu-row --\x3e';Array.from(n).pop().insertAdjacentHTML("afterend",i)}})),document.querySelector(".configSync-s").checked=n,document.querySelector(".md5Check-s").checked=i,document.querySelector(".svip-s").checked=o,document.querySelector(".fold-s").value=s,document.querySelector(".interval-s").value=r,document.querySelector(".downloadPath-s").value=a,document.querySelector(".userAgent-s").value=c,document.querySelector(".referer-s").value=l,document.querySelector(".app_id-s").value=u,document.querySelector(".headers-s").value=d},s.prototype.saveSetting=function(){var e=document.querySelectorAll(".rpc-s"),t={rpcList:Array.from(e).map((function(e){var t=e.querySelector(".name-s").value,n=e.querySelector(".url-s").value;if(t&&n)return{name:t,url:n}})).filter((function(e){return e})),configSync:document.querySelector(".configSync-s").checked,md5Check:document.querySelector(".md5Check-s").checked,svip:document.querySelector(".svip-s").checked,fold:Number.parseInt(document.querySelector(".fold-s").value),interval:document.querySelector(".interval-s").value,downloadPath:document.querySelector(".downloadPath-s").value,userAgent:document.querySelector(".userAgent-s").value,referer:document.querySelector(".referer-s").value,appId:document.querySelector(".app_id-s").value,headers:document.querySelector(".headers-s").value};n.trigger("setConfigData",t)};var r=new s,a=function(e){this.listParameter=e,this.fileDownloadInfo=[],this.currentTaskId=0,this.completedCount=0,this.folders=[],this.files={}};a.prototype.start=function(e,t){void 0===e&&(e=300),this.interval=e,this.done=t,this.currentTaskId=(new Date).getTime(),this.getNextFile(this.currentTaskId)},a.prototype.reset=function(){this.fileDownloadInfo=[],this.currentTaskId=0,this.folders=[],this.files={},this.completedCount=0},a.prototype.addFolder=function(e){this.folders.push(e)},a.prototype.addFile=function(e){this.files[e.fs_id]=e},a.prototype.getNextFile=function(e){var t=this;if(e===this.currentTaskId)if(0!==this.folders.length){this.completedCount++,o.showToast("正在获取文件列表... "+this.completedCount+"/"+(this.completedCount+this.folders.length-1),"success");var n=this.folders.pop();this.listParameter.search.dir=n,fetch(""+window.location.origin+this.listParameter.url+o.objectToQueryString(this.listParameter.search),this.listParameter.options).then((function(n){n.ok?n.json().then((function(n){if(setTimeout((function(){return t.getNextFile(e)}),t.interval),0!==n.errno)return o.showToast("未知错误","failure"),void console.log(n);n.list.forEach((function(e){e.isdir?t.folders.push(e.path):t.files[e.fs_id]=e}))})):console.log(n)})).catch((function(n){o.showToast("网络请求失败","failure"),console.log(n),setTimeout((function(){return t.getNextFile(e)}),t.interval)}))}else 0!==this.files.length?(o.showToast("正在获取下载地址...","success"),this.getFiles(this.files).then((function(){t.done(t.fileDownloadInfo)}))):(o.showToast("一个文件都没有哦...","caution"),this.reset())},a.prototype.getFiles=function(e){throw new Error("subclass should implement this method!")};var c="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function l(e,t,n){return e(n={path:t,exports:{},require:function(e,t){return u(null==t&&n.path)}},n.exports),n.exports}function u(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}var d=l((function(t,n){var i;t.exports=(i=i||function(t,n){var i;if("undefined"!=typeof window&&window.crypto&&(i=window.crypto),!i&&"undefined"!=typeof window&&window.msCrypto&&(i=window.msCrypto),!i&&void 0!==c&&c.crypto&&(i=c.crypto),!i)try{i=e}catch(e){}var o=function(){if(i){if("function"==typeof i.getRandomValues)try{return i.getRandomValues(new Uint32Array(1))[0]}catch(e){}if("function"==typeof i.randomBytes)try{return i.randomBytes(4).readInt32LE()}catch(e){}}throw new Error("Native crypto module could not be used to get secure random number.")},s=Object.create||function(){function e(){}return function(t){var n;return e.prototype=t,n=new e,e.prototype=null,n}}(),r={},a=r.lib={},l=a.Base={extend:function(e){var t=s(this);return e&&t.mixIn(e),t.hasOwnProperty("init")&&this.init!==t.init||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}},u=a.WordArray=l.extend({init:function(e,t){e=this.words=e||[],this.sigBytes=t!=n?t:4*e.length},toString:function(e){return(e||p).stringify(this)},concat:function(e){var t=this.words,n=e.words,i=this.sigBytes,o=e.sigBytes;if(this.clamp(),i%4)for(var s=0;s<o;s++){var r=n[s>>>2]>>>24-s%4*8&255;t[i+s>>>2]|=r<<24-(i+s)%4*8}else for(s=0;s<o;s+=4)t[i+s>>>2]=n[s>>>2];return this.sigBytes+=o,this},clamp:function(){var e=this.words,n=this.sigBytes;e[n>>>2]&=4294967295<<32-n%4*8,e.length=t.ceil(n/4)},clone:function(){var e=l.clone.call(this);return e.words=this.words.slice(0),e},random:function(e){for(var t=[],n=0;n<e;n+=4)t.push(o());return new u.init(t,e)}}),d=r.enc={},p=d.Hex={stringify:function(e){for(var t=e.words,n=e.sigBytes,i=[],o=0;o<n;o++){var s=t[o>>>2]>>>24-o%4*8&255;i.push((s>>>4).toString(16)),i.push((15&s).toString(16))}return i.join("")},parse:function(e){for(var t=e.length,n=[],i=0;i<t;i+=2)n[i>>>3]|=parseInt(e.substr(i,2),16)<<24-i%8*4;return new u.init(n,t/2)}},h=d.Latin1={stringify:function(e){for(var t=e.words,n=e.sigBytes,i=[],o=0;o<n;o++){var s=t[o>>>2]>>>24-o%4*8&255;i.push(String.fromCharCode(s))}return i.join("")},parse:function(e){for(var t=e.length,n=[],i=0;i<t;i++)n[i>>>2]|=(255&e.charCodeAt(i))<<24-i%4*8;return new u.init(n,t)}},f=d.Utf8={stringify:function(e){try{return decodeURIComponent(escape(h.stringify(e)))}catch(e){throw new Error("Malformed UTF-8 data")}},parse:function(e){return h.parse(unescape(encodeURIComponent(e)))}},m=a.BufferedBlockAlgorithm=l.extend({reset:function(){this._data=new u.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=f.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(e){var n,i=this._data,o=i.words,s=i.sigBytes,r=this.blockSize,a=s/(4*r),c=(a=e?t.ceil(a):t.max((0|a)-this._minBufferSize,0))*r,l=t.min(4*c,s);if(c){for(var d=0;d<c;d+=r)this._doProcessBlock(o,d);n=o.splice(0,c),i.sigBytes-=l}return new u.init(n,l)},clone:function(){var e=l.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0}),v=(a.Hasher=m.extend({cfg:l.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){m.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(e){return function(t,n){return new e.init(n).finalize(t)}},_createHmacHelper:function(e){return function(t,n){return new v.HMAC.init(e,n).finalize(t)}}}),r.algo={});return r}(Math),i)})),p=l((function(e,t){var n,i,o,s,r,a,c,l;e.exports=(i=(n=l=d).lib,o=i.WordArray,s=i.Hasher,r=n.algo,a=[],c=r.SHA1=s.extend({_doReset:function(){this._hash=new o.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(e,t){for(var n=this._hash.words,i=n[0],o=n[1],s=n[2],r=n[3],c=n[4],l=0;l<80;l++){if(l<16)a[l]=0|e[t+l];else{var u=a[l-3]^a[l-8]^a[l-14]^a[l-16];a[l]=u<<1|u>>>31}var d=(i<<5|i>>>27)+c+a[l];d+=l<20?1518500249+(o&s|~o&r):l<40?1859775393+(o^s^r):l<60?(o&s|o&r|s&r)-1894007588:(o^s^r)-899497514,c=r,r=s,s=o<<30|o>>>2,o=i,i=d}n[0]=n[0]+i|0,n[1]=n[1]+o|0,n[2]=n[2]+s|0,n[3]=n[3]+r|0,n[4]=n[4]+c|0},_doFinalize:function(){var e=this._data,t=e.words,n=8*this._nDataBytes,i=8*e.sigBytes;return t[i>>>5]|=128<<24-i%32,t[14+(i+64>>>9<<4)]=Math.floor(n/4294967296),t[15+(i+64>>>9<<4)]=n,e.sigBytes=4*t.length,this._process(),this._hash},clone:function(){var e=s.clone.call(this);return e._hash=this._hash.clone(),e}}),n.SHA1=s._createHelper(c),n.HmacSHA1=s._createHmacHelper(c),l.SHA1)})),h=l((function(e,t){var n;e.exports=(n=d,function(e){var t=n,i=t.lib,o=i.WordArray,s=i.Hasher,r=t.algo,a=[];!function(){for(var t=0;t<64;t++)a[t]=4294967296*e.abs(e.sin(t+1))|0}();var c=r.MD5=s.extend({_doReset:function(){this._hash=new o.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(e,t){for(var n=0;n<16;n++){var i=t+n,o=e[i];e[i]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8)}var s=this._hash.words,r=e[t+0],c=e[t+1],h=e[t+2],f=e[t+3],m=e[t+4],v=e[t+5],g=e[t+6],y=e[t+7],w=e[t+8],b=e[t+9],x=e[t+10],S=e[t+11],k=e[t+12],T=e[t+13],C=e[t+14],_=e[t+15],q=s[0],D=s[1],A=s[2],L=s[3];q=l(q,D,A,L,r,7,a[0]),L=l(L,q,D,A,c,12,a[1]),A=l(A,L,q,D,h,17,a[2]),D=l(D,A,L,q,f,22,a[3]),q=l(q,D,A,L,m,7,a[4]),L=l(L,q,D,A,v,12,a[5]),A=l(A,L,q,D,g,17,a[6]),D=l(D,A,L,q,y,22,a[7]),q=l(q,D,A,L,w,7,a[8]),L=l(L,q,D,A,b,12,a[9]),A=l(A,L,q,D,x,17,a[10]),D=l(D,A,L,q,S,22,a[11]),q=l(q,D,A,L,k,7,a[12]),L=l(L,q,D,A,T,12,a[13]),A=l(A,L,q,D,C,17,a[14]),q=u(q,D=l(D,A,L,q,_,22,a[15]),A,L,c,5,a[16]),L=u(L,q,D,A,g,9,a[17]),A=u(A,L,q,D,S,14,a[18]),D=u(D,A,L,q,r,20,a[19]),q=u(q,D,A,L,v,5,a[20]),L=u(L,q,D,A,x,9,a[21]),A=u(A,L,q,D,_,14,a[22]),D=u(D,A,L,q,m,20,a[23]),q=u(q,D,A,L,b,5,a[24]),L=u(L,q,D,A,C,9,a[25]),A=u(A,L,q,D,f,14,a[26]),D=u(D,A,L,q,w,20,a[27]),q=u(q,D,A,L,T,5,a[28]),L=u(L,q,D,A,h,9,a[29]),A=u(A,L,q,D,y,14,a[30]),q=d(q,D=u(D,A,L,q,k,20,a[31]),A,L,v,4,a[32]),L=d(L,q,D,A,w,11,a[33]),A=d(A,L,q,D,S,16,a[34]),D=d(D,A,L,q,C,23,a[35]),q=d(q,D,A,L,c,4,a[36]),L=d(L,q,D,A,m,11,a[37]),A=d(A,L,q,D,y,16,a[38]),D=d(D,A,L,q,x,23,a[39]),q=d(q,D,A,L,T,4,a[40]),L=d(L,q,D,A,r,11,a[41]),A=d(A,L,q,D,f,16,a[42]),D=d(D,A,L,q,g,23,a[43]),q=d(q,D,A,L,b,4,a[44]),L=d(L,q,D,A,k,11,a[45]),A=d(A,L,q,D,_,16,a[46]),q=p(q,D=d(D,A,L,q,h,23,a[47]),A,L,r,6,a[48]),L=p(L,q,D,A,y,10,a[49]),A=p(A,L,q,D,C,15,a[50]),D=p(D,A,L,q,v,21,a[51]),q=p(q,D,A,L,k,6,a[52]),L=p(L,q,D,A,f,10,a[53]),A=p(A,L,q,D,x,15,a[54]),D=p(D,A,L,q,c,21,a[55]),q=p(q,D,A,L,w,6,a[56]),L=p(L,q,D,A,_,10,a[57]),A=p(A,L,q,D,g,15,a[58]),D=p(D,A,L,q,T,21,a[59]),q=p(q,D,A,L,m,6,a[60]),L=p(L,q,D,A,S,10,a[61]),A=p(A,L,q,D,h,15,a[62]),D=p(D,A,L,q,b,21,a[63]),s[0]=s[0]+q|0,s[1]=s[1]+D|0,s[2]=s[2]+A|0,s[3]=s[3]+L|0},_doFinalize:function(){var t=this._data,n=t.words,i=8*this._nDataBytes,o=8*t.sigBytes;n[o>>>5]|=128<<24-o%32;var s=e.floor(i/4294967296),r=i;n[15+(o+64>>>9<<4)]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),n[14+(o+64>>>9<<4)]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8),t.sigBytes=4*(n.length+1),this._process();for(var a=this._hash,c=a.words,l=0;l<4;l++){var u=c[l];c[l]=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8)}return a},clone:function(){var e=s.clone.call(this);return e._hash=this._hash.clone(),e}});function l(e,t,n,i,o,s,r){var a=e+(t&n|~t&i)+o+r;return(a<<s|a>>>32-s)+t}function u(e,t,n,i,o,s,r){var a=e+(t&i|n&~i)+o+r;return(a<<s|a>>>32-s)+t}function d(e,t,n,i,o,s,r){var a=e+(t^n^i)+o+r;return(a<<s|a>>>32-s)+t}function p(e,t,n,i,o,s,r){var a=e+(n^(t|~i))+o+r;return(a<<s|a>>>32-s)+t}t.MD5=s._createHelper(c),t.HmacMD5=s._createHmacHelper(c)}(Math),n.MD5)})),f={credentials:"include",method:"GET"};(new(function(e){function t(){var t=this,n={search:{dir:"",channel:"chunlei",clienttype:0,web:1},url:"/api/list?",options:{credentials:"include",method:"GET"}};e.call(this,n),r.init(),r.addMenu(document.querySelectorAll(".g-dropdown-button")[3],"afterend"),o.requestCookies([{url:"https://pan.baidu.com/",name:"BDUSS"},{url:"https://pcs.baidu.com/",name:"STOKEN"}]),o.sendToBackground("fetch",{url:location.protocol+"//tieba.baidu.com",options:f},(function(e){t.uid=e.match(/(?<=uid=)\d+/)[0]})),o.showToast("初始化成功!","success"),this.mode="RPC",this.rpcURL="http://localhost:6800/jsonrpc"}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.startListen=function(){var e=this;window.addEventListener("message",(function(t){if(t.source===window&&t.data.type&&"selected"===t.data.type){e.reset();var n=t.data.data;if(0===n.length)return void o.showToast("请选择一下你要保存的文件哦","failure");n.forEach((function(t){t.isdir?e.addFolder(t.path):e.addFile(t)})),e.start(o.getConfigData("interval"),(function(t){"RPC"===e.mode&&o.aria2RPCMode(e.rpcURL,t),"TXT"===e.mode&&(o.aria2TXTMode(t),document.querySelector("#textMenu").classList.add("open-o"))}))}})),document.querySelector("#aria2List").addEventListener("click",(function(t){var n=t.target.dataset.url;n&&(e.rpcURL=n,e.getSelected(),e.mode="RPC"),"aria2Text"===t.target.id&&(e.getSelected(),e.mode="TXT")}))},t.prototype.getSelected=function(){window.postMessage({type:"getSelected"},location.origin)},t.prototype.getPrefixLength=function(){var e=o.getHashParameter("/all?path")||o.getHashParameter("path"),t=o.getConfigData("fold");if(-1===t||"/"===e)return 1;if(o.getHashParameter("/search?key"))return 1;for(var n=e.split("/"),i=0,s=0;s<n.length-t;s++)i=i+n[s].length+1;return i},t.prototype.getFiles=async function(e){var t=this.getPrefixLength(),n=o.getConfigData("appId"),i=o.getConfigData("svip"),s=o.cookies.BDUSS,r=Number.parseInt(Date.now()/1e3,10);if(s&&this.uid){var a=this.getDevUID(),c=this.sign(r,a,this.uid,s);for(var l in e){var u="";if(i){var d=location.protocol+"//pcs.baidu.com/rest/2.0/pcs/file?method=locatedownload&ver=2&time="+r+"&rand="+c+"&devuid="+a+"&app_id="+n+"&path="+encodeURIComponent(e[l].path);u=await this.getFileLink(d)}else u=location.protocol+"//pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id="+n+"&path="+encodeURIComponent(e[l].path);this.fileDownloadInfo.push({name:e[l].path.substr(t),link:u,md5:e[l].md5})}}else o.showToast("还没获取到cookies哦，请稍等","failure");return Promise.resolve()},t.prototype.getFileLink=function(e){return new Promise((function(t,n){o.sendToBackground("fetch",{url:e,options:f},(function(e){var n=e.urls.map((function(e){return e.url}));t(n)}))}))},t.prototype.sign=function(e,t,n,i){var o=p(i);return p(o+n+"ebrcUYiuxaZv2XGu7KIYKxUrqfnOfpDF"+e+t).toString()},t.prototype.getDevUID=function(e){return"0|"+h(e).toString()},t}(a))).startListen()}(crypto);