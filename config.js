window.TNA_CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwIzIV-OK_dvWCgmuzNy850M4eV4k11fMN6c_B8XKbXIcOTTeMj7OMPTWReATu6td6A3Q/exec"
};
(function () {
  var URL0 = window.TNA_CONFIG.SCRIPT_URL, nativeFetch = window.fetch.bind(window);
  function sendForm(body) {
    return new Promise(function (resolve) {
      var name = "tna_sink_" + Date.now(), ifr = document.createElement("iframe"), f = document.createElement("form"), inp = document.createElement("input");
      ifr.name = name; ifr.style.display = "none"; f.method = "POST"; f.action = URL0; f.target = name; f.style.display = "none";
      inp.type = "hidden"; inp.name = "payload"; inp.value = body; f.appendChild(inp);
      document.body.appendChild(ifr); document.body.appendChild(f);
      var done = false; function fin() { if (done) return; done = true; setTimeout(function () { ifr.remove(); f.remove(); }, 2000); resolve(); }
      ifr.addEventListener("load", fin); setTimeout(fin, 15000); f.submit();
    });
  }
  async function isSaved(id) {
    for (var k = 0; k < 4; k++) {
      try { var r = await nativeFetch(URL0 + "?action=check&id=" + encodeURIComponent(id) + "&t=" + Date.now()); var j = await r.json(); if (j.found) return true; } catch (e) {}
      await new Promise(function (res) { setTimeout(res, 1500); });
    }
    return false;
  }
  window.fetch = async function (url, opts) {
    if (opts && opts.method === "POST" && String(url) === URL0) {
      if (opts.mode === "no-cors") return new Response("{}");
      var id = ""; try { id = JSON.parse(opts.body).data.respId; } catch (e) {}
      await sendForm(opts.body);
      var ok = await isSaved(id);
      return new Response(JSON.stringify(ok ? { ok: true } : { ok: false, error: "not saved" }), { headers: { "Content-Type": "application/json" } });
    }
    return nativeFetch(url, opts);
  };
})();
 
