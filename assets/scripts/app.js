(function () {
    "use strict";

    function fetchJSONFile(path, callback) {
        var httpRequest = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (callback) { callback(data); }
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

/*
{
    "symbol":"dash",
    "position":"5",
    "name":"Dash",
    "market_cap":{
        "usd":42443061.2936,
        "eur":37214670.34508659,
        "cny":275818610.627892,
        "gbp":29413847.89462938,
        "cad":54771497.307551995,
        "rub":2800409354.958081,
        "hkd":329415538.6572049,
        "jpy":4545448180.293412,
        "aud":57612508.5013617,
        "btc":92474.6576981
    },
    "price":{
        "usd":6.59801,
        "eur":5.78522754014,
        "cny":42.87753747356,
        "gbp":4.572546292190001,
        "cad":8.5145339647,
        "rub":435.33921364181,
        "hkd":51.20947810952,
        "jpy":706.6152071500101,
        "aud":8.95618496007,
        "btc":0.0143757
    },
    "supply":"6432706",
    "volume":{
        "usd":300399,
        "eur":263394.048786,
        "cny":1952159.723844,
        "gbp":208182.21458100004,
        "cad":387655.89753,
        "rub":19820440.472018998,
        "hkd":2331502.379448,
        "jpy":32171291.285198998,
        "aud":407763.70539300004,
        "btc":654.506
    },
    "change":"-3.01",
    "timestamp":"1462626382.036"
}
*/

            console.log(data);
            if (data) {
                markup = markup.replace(/!price_usd/g, makeCurrencyString(data.price.usd) + " USD");
                markup = markup.replace(/!percent_change_24h/g, data.change + "%");
                markup = markup.replace(/!price_btc/g, makeCurrencyString(data.price.btc) + " BTC");
                document.querySelector('[data-dash-price-widget]').innerHTML = markup;
            }
        });
    }

    updatePrices(); // update prices now
    setInterval(updatePrices, 5 * 60 * 1000); // ...and every five minutes after this
}());
