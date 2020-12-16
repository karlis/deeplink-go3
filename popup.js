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

function parseDeeplink(string) {
  let obj = expresions.filter(exp => exp.regex.test(string))[0]
  if (obj == null) {
    return "Link not recognized…"
  }
  return obj.template(...obj.regex.exec(string))
}

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}

//let field = document.getElementById("pastery");
//field.addEventListener(
//  "input",
//  function() {
//    let area = document.getElementById("result")
//    area.innerHTML = parseDeeplink(field.value);
//
//    prepareMonitoringData(field.value)
//  },
//  false
//);

function prepareMonitoringData(link) {
  let monitor = document.getElementById("monitoring")
  monitor.innerHTML = '{"externalMonitoringLink":"' + link + '"}'
}

function loadImage(link) {
  // Fetch someting later
}

document.addEventListener('DOMContentLoaded', function() {

  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {
    chrome.tabs.getSelected(null, function(tab) {
      let area = document.getElementById("result");
      let monitor = document.getElementById("monitoring")
      area.innerHTML = parseDeeplink(tab.url);
      monitor.innerHTML = '{"externalMonitoringLink":"' + tab.url + '"}'
    });
  }, false);
}, false);
