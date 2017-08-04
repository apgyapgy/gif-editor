
let curVal=0;
export const updateIframe=(val)=> {
    if (curVal==val) return
    curVal=val;
//  let ifr_el = document.getElementById("iframe");
//  if (ifr_el)
//      ifr_el['src'] = ifr_el['src'].replace(/#\d+/g, "") + '#' + val;
    parent.window.postMessage(val,"*");
}

export const isSafari=()=> navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") < 1 ;
