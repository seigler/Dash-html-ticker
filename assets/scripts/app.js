(function () {
    "use strict";

    function init() {
        var css = '[data-dash-price-widget],[data-dash-price-widget] *,[data-dash-price-widget] :after,[data-dash-price-widget] :before{box-sizing:inherit;vertical-align:baseline;font-weight:inherit;font-family:inherit;font-style:inherit;font-size:100%;border:0;outline:0;padding:0;margin:0;line-height:1}[data-dash-price-widget]{display:block;max-width:18em;margin:.5em auto;border-radius:.5em;background-color:#1D76BC;box-sizing:border-box;color:#fff;padding:.5em;font-family:serif}[data-dash-price-widget] .dash-ticker--title{font-size:3em;float:left;height:1em;width:1em;overflow:hidden;text-indent:-999px;background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iMjI2Ljc3N3B4IiBoZWlnaHQ9IjIyNi43NzdweCIgdmlld0JveD0iMCAwIDIyNi43NzcgMjI2Ljc3NyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjI2Ljc3NyAyMjYuNzc3IgoJIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTEzLjM4OCwwQzUwLjc2NiwwLDAsNTAuNzY2LDAsMTEzLjM4OGMwLDYyLjYyMyw1MC43NjYsMTEzLjM4OSwxMTMuMzg5LDExMy4zODkKCWM2Mi42MjMsMCwxMTMuMzg5LTUwLjc2NiwxMTMuMzg5LTExMy4zODlDMjI2Ljc3Nyw1MC43NjYsMTc2LjAxMSwwLDExMy4zODgsMHogTTU2LjU2MiwxMDQuODAyaDQ1LjI2NmwtNS4yMzgsMTcuMDI0SDUxLjMyNgoJTDU2LjU2MiwxMDQuODAyeiBNMTczLjgzLDk2Ljc3M2MtMS44MDEsNi41MDYtNy42NTYsMjYuMDIzLTEwLjA1OSwzMi45NDVjLTIuNCw2LjkyMi02LjgyOSwxMi43MzQtMTIuNTA2LDE2LjA1NwoJYy01LjY3NiwzLjMyMy03Ljc5Nyw0LjcxMi0xNS43MzEsNC43MTJINTQuMzAzbDUuNzIxLTE4LjU0Mmg3Ni4zOTVsMTEuNDE0LTM3LjEwOWgtNzUuNzlsNS43MjItMTguNTQxYzAsMCw4My42OTgsMCw4NC41NzcsMAoJYzMuODc1LDAsOC45OTYsMS43OTIsMTEuNDg4LDYuNjM5QzE3Ni4zMjEsODcuNzc1LDE3NS42MjksOTAuMjY3LDE3My44Myw5Ni43NzN6Ii8+Cjwvc3ZnPgo=);background-size:100% 100%}[data-dash-price-widget] .dash-ticker--wrapper{margin-left:3.5em}[data-dash-price-widget] .dash-ticker--usd{font-size:2em;text-align:center}[data-dash-price-widget] .dash-ticker--usd-change{text-align:right}[data-dash-price-widget] .dash-ticker--btc{text-align:left;margin-top:-1em}',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);

        updatePrices(); // update prices now
        setInterval(updatePrices, 5 * 60 * 1000); // ...and every five minutes after this
    }

    function fetchJSONFile(path, callback) {
        var httpRequest = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (callback) {
                        callback(data);
                    }
                }
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    }

    function makeCurrencyString(number) {
        // return 3 significant figures or two decimal places, whichever is longer.
        return (number.toPrecision(3).length > number.toFixed(2) ? number.toPrecision(3) : number.toFixed(2));
    }

    function updatePrices() {
        // this requests the Dash price JSON and executes a callback with the parsed result once it is available
        fetchJSONFile('https://coinmarketcap-nexuist.rhcloud.com/api/dash/', function (data) {
            var markup = '<div class="dash-ticker--title">Dash Price</div><div class="dash-ticker--wrapper"><div class="dash-ticker--usd">!price_usd</div><div class="dash-ticker--usd-change">!percent_change_24h</div><div class="dash-ticker--btc">!price_btc</div></div>';

            if (data && data.price && data.price.usd && data.price.btc && data.change) {
                markup = markup.replace(/!price_usd/g, makeCurrencyString(data.price.usd) + " USD");
                markup = markup.replace(/!percent_change_24h/g, data.change + "%");
                markup = markup.replace(/!price_btc/g, makeCurrencyString(data.price.btc) + " BTC");
                document.querySelector('[data-dash-price-widget]').innerHTML = markup;
            }
        });
    }

    init();
}());
