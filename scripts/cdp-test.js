const http = require("http");
function getJSON(url, m) {
  return new Promise((res, rej) => {
    const r = http.request(url, { method: m || "GET" }, (x) => {
      let d = "";
      x.on("data", (c) => (d += c));
      x.on("end", () => res(JSON.parse(d)));
    });
    r.on("error", rej);
    r.end();
  });
}
(async () => {
  const t = await getJSON("http://localhost:9222/json/new?http://localhost:3000", "PUT");
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  let id = 0;
  const p = new Map();
  const send = (m, pa = {}) =>
    new Promise((res) => {
      const i = ++id;
      p.set(i, res);
      ws.send(JSON.stringify({ id: i, method: m, params: pa }));
    });
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && p.has(m.id)) {
      p.get(m.id)(m.result);
      p.delete(m.id);
    }
  };
  await new Promise((r) => (ws.onopen = r));
  await send("Runtime.enable");
  await new Promise((r) => setTimeout(r, 4000));

  const report = await send("Runtime.evaluate", {
    expression: `(()=>{
      const bodyText = document.body.innerText;
      const pritanjan = /pritanjan/i.test(bodyText);
      const praxen = (bodyText.match(/praxen/gi)||[]).length;
      const title = document.title;
      const hero = document.getElementById('hero');
      const svgs = [...hero.querySelectorAll('svg')];
      const graph = svgs.find(s => s.getAttribute('viewBox') === '0 0 420 440');
      let nodes = [];
      if (graph) {
        nodes = [...graph.querySelectorAll('text')].map(t => t.textContent.trim()).filter(Boolean);
      }
      return JSON.stringify({ pritanjan, praxen, title, graphFound: !!graph, firstNode: nodes[0] || null, lastNode: nodes[nodes.length-1] || null });
    })()`,
    returnByValue: true,
  });
  console.log("REPORT:", report.result.value);

  await send("Page.close");
  ws.close();
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });