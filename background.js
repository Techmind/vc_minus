// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

// todo
// collect all user ids from curren page if page = VC
// load user ids
// replace page content
/*
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  let url = tabs[0].url;
  // use `url` here inside the callback because it's asynchronous!
});*/


/*
chrome.alarms.onAlarm.addListener(() => {
  chrome.action.setBadgeText({ text: '' });
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'stay_hydrated.png',
    title: 'Time to Hydrate',
    message: "Everyday I'm Guzzlin'!",
    buttons: [{ title: 'Keep it Flowing.' }],
    priority: 0
  });
});

chrome.notifications.onButtonClicked.addListener(async () => {
  const item = await chrome.storage.sync.get(['minutes']);
  chrome.action.setBadgeText({ text: 'ON' });
  chrome.alarms.create({ delayInMinutes: item.minutes });
});
*/

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setPopup({popup: ''});
});

// A function to use as callback
function doStuffWithDom(domContent) {
  console.log('I received the following DOM content:\n' + domContent);
}

function testScript() {
  async function addMinus(doc, url, doms) {
    const res = await fetch(url);
    var text = await res.text();

    //var doc = new DOMParser().parseFromString(text, "text/html");
    //var rating = doc.getElementsByClassName('v-number-change')[0].text;

    var rating = text.match("karma[^0-9]*:(\-?[0-9]+),")[1];
    var date = decodeURIComponent(JSON.parse('"' + text.match("stats[^l]*label[^:]*:([^}]*)}")[1] + '"'));
    date = date.replace(new RegExp("&quot;", "g"), '').replace('"', '');
    var intRating = rating.replace('+', '') * 1;
    //console.log(intRating, url);
    for (var i = 0; i < doms.length; i++)
    {
      if (intRating < 0)
      {
        doms[i].innerHTML = "<span style='color: red; font-size: 20px;'>" + intRating + ";" + date + "</span>" + doms[i].innerHTML;
      }
      else
      {
        doms[i].innerHTML = "<span style='color: green'>  " + intRating + ";" + date + "</span>" + doms[i].innerHTML;
      }
    }
  }

//  console.log('testScript', document);

  var minuses = [];
  var authors = [];
  var doms = document.getElementsByClassName('comment__author');
  for (var i = 0; i < doms.length; i++)
  {
    authors.push({el : doms[i], href: doms[i].href});
  }

  // group by href
  var urls = [];
  var grouped = {};

  for (var i = 0; i < authors.length; i++)
  {
    var row = authors[i];
    if (typeof grouped[row.href] == 'undefined')
    {
      grouped[row.href] = {'doms': [] , 'href' : row.href};
      urls.push(row.href);
    }

    grouped[row.href].doms.push(row.el);
  }

  for (var i = 0; i < urls.length; i++)
  {
    var href = urls[i];
    addMinus(document, grouped[href].href, grouped[href].doms);
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  //console.log('changeINFO', changeInfo, tabId);
  if ((changeInfo.status != 'string' && changeInfo.status == 'complete')) {
    // считываем активную вкладку
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      let currentTab = tabs[0];
      //console.log('TAB', currentTab);
      if (typeof currentTab.url != 'undegined' && currentTab.url && currentTab.url.indexOf("vc.ru") !== -1) {
        // хз как это работает, наговнокодю)
        //chrome.tabs.sendMessage(currentTab.id, {text: 'report_back'}, doStuffWithDom);

        // хз, как отслеживать перезагрзку вкладки, просто таймаут добавлю (ебаный vue :/)
        setTimeout(function () {
            chrome.scripting.executeScript({
              target: { tabId: currentTab.id },
              function: testScript
            });
        }, 3000);

        //chrome.action.setPopup({popup: "popup.html"});
      }
    });
  }
});