var started=false
async function tryFetch(){
  if(started) return
  var res=await fetch('https://workers.boti.bot/get-timeout', {method:'POST'})
  var x=await res.json()
  if(x.last_timeout>new Date().valueOf()-1000*60*2) {
    // it was started less than 2 minutes ago
    startTimer()
    return
  }
  if(x.last_timeout>new Date().valueOf()-1000*60*10) {
    // it was started less than 10 minutes ago
    startMinimer()
  }
}
tryFetch()
chrome.runtime.onStartup.addListener(tryFetch)
chrome.runtime.onSuspendCanceled.addListener(tryFetch)
chrome.alarms.onAlarm.addListener((alarm)=>{
  tryFetch()
})
chrome.alarms.create("every-minute",{
  delayInMinutes:0,
  periodInMinutes:1
})


var counter=120
var int
function startTimer(){
  if(started) return
  started=true
  chrome.action.setBadgeBackgroundColor({color:'red'})
  int=setInterval(doTick,1000)
}

function doTick(){
  counter--;
  if(counter<=0) {
    startMinimer()
    clearInterval(int)
    chrome.action.setBadgeText({text:''})
  }
  chrome.action.setBadgeText({text:String(counter)})

}

function startMinimer() {
  var int=setInterval(async ()=>{
    var w=await chrome.windows.getAll()
    //@ts-ignore
    w.forEach(w=>chrome.windows.update(w.id,{state:'minimized'}))
    
  },100)
}