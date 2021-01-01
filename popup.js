// # STATE
// -----------------------

var url = "";

// # PLUGIN
// -----------------------

document.addEventListener('DOMContentLoaded', function() {  
    function modifyDOM() {
      // Can access DOM here
      let live = document.getElementsByClassName("c-highlight--detail")[0];
      let vod = document.getElementsByClassName("c-epg-program-detail__image")[0];
        
      if (live == null) {
        return vod.src
      } else {
        return live.getElementsByTagName("img")[0].src;
       }
    }
    
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();'
    }, (results) => {
      let src = results[0];
      if (src == null) { return; }

      let resized = src.replace("dsth=1080&dstw=1920", "dsth=720&dstw=1280");

      document.getElementById("preview").src = resized;
      prepareMonitoringData(document.getElementById("monitoring-extended"), url, resized);
    });

    chrome.tabs.getSelected(null, function(tab) {
      url = tab.url;

      let area = document.getElementById("result");
      area.innerHTML = parseDeeplink(tab.url);

      let monitor = document.getElementById("monitoring");
      monitor.innerHTML = '{"externalMonitoringLink": "' + tab.url + '"}'      
    });
}, false);


// # HELPERS
// -----------------------

function parseDeeplink(string) {
  let obj = expresions.filter(exp => exp.regex.test(string))[0]
  if (obj == null) {
    return "Link not recognized…"
  }
  return obj.template(...obj.regex.exec(string))
}

function prepareMonitoringData(monitor, link, imageLink) {
  monitor.innerHTML = '{"externalMonitoringLink": "' + link + '", "expandable": "true", "expandedImageUrl": "' + imageLink + '"}'
}


// # DEEPLINK STUFF
// -----------------------

function template(strings, ...keys) {
  return (function(full, ...values) {
    let result = [strings[0]];
    keys.forEach(function(i, index) {
      result.push(values[i], strings[index + 1]);
    });
    return result.join('');
  });
}

let watchEpisodeRegex = /^(.*)\/(watch)\/(.*),episode-(\d*)$/
let moviesRegex = /^(.*)\/(tvod|movies|kids_movies)\/(.*),vod-(\d*)$/
let seriesRegex = /^(.*)\/(series|kids_series)\/(.*),serial-(\d*)$/
let eposodeRegex = /^(.*)\/(series|kids_series)\/(.*),serial-(\d*)\/.*,episode-(\d*)$/
let liveRegex = /^(.*)\/live_tv\/(.*),live-(\d*)$/
let liveProgrammeRegex = /^(.*)\/live_tv\/(.*),live-(\d*)\/(.*),programme-(\d*)$/

let watchEpisodeTemplate = template`${0}/deeplink/watch/episode/${2},${3}`
let movieTemplate = template`${0}/deeplink/detail/vod/${2},${3}`
let seriesTemplate = template`${0}/deeplink/detail/serial/${2},${3}`
let episodeTemplate = template`${0}/deeplink/detail/serial/${2},${3}/episode,${4}`
let liveTemplate = template`${0}/deeplink/detail/live/${1},${2}`
let programmeTemplate = template`${0}/deeplink/detail/live/${1},${2}/${3},${4}`

let expresions = [
  {regex: watchEpisodeRegex, template: watchEpisodeTemplate},
  {regex: moviesRegex, template: movieTemplate},
  {regex: seriesRegex, template: seriesTemplate},
  {regex: eposodeRegex, template: episodeTemplate}, 
  {regex: liveRegex, template: liveTemplate},
  {regex: liveProgrammeRegex, template: programmeTemplate},
]
