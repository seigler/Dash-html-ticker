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

    function updatePrices() {
        // this requests the Dash price JSON and executes a callback with the parsed result once it is available
        fetchJSONFile('https://coinmarketcap-nexuist.rhcloud.com/api/dash/price', function (data) {
            var keys = Object.keys(data),
                currencyListHTML = "";
            for (var i = 0; i < keys.length; i++) {
                var thisCurrency = keys[i];
                var nextCurrency = keys[(i < keys.length - 1 ? i + 1 : 0)];
                var currencyValue = data[keys[i]];
                var currencyString = (currencyValue.toPrecision(3).length > currencyValue.toFixed(2) ? currencyValue.toPrecision(3) : currencyValue.toFixed(2));
                currencyListHTML += '<input type="radio" name="currency" id="dash-ticker-currencies-' + thisCurrency + '"' + (i === 0 ? ' checked' : '') + ' /><label for="dash-ticker-currencies-' + nextCurrency + '"><span class="dash-ticker--price">' + currencyString + '</span> <span class="dash-ticker--currency">' + thisCurrency.toUpperCase() + '</span></label>';
            }
            document.getElementById('dash-ticker--price-container').innerHTML = currencyListHTML;
        });
    }

    updatePrices(); // update prices now
    setInterval(updatePrices, 5 * 60 * 1000); // ...and every five minutes after this
})();
