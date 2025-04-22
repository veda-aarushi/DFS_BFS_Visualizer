function generateEdgeInputs() {
    const nodeCount = +document.getElementById("nodeCount").value;
    const container = document.getElementById("edgeInputs");
    container.innerHTML = "";
  
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const row = document.createElement("div");
        row.className = "flex gap-4 items-center";
  
        const label = document.createElement("span");
        label.className = "w-28";
        label.textContent = `Edge ${i} → ${j}:`;
  
        const input = document.createElement("input");
        input.type = "checkbox";
        input.setAttribute("data-edge", `${i}-${j}`);
  
        row.append(label, input);
        container.appendChild(row);
      }
    }
  
    drawGraph(nodeCount, []);
  }
  
  function parseEdges() {
    const nodeCount = +document.getElementById("nodeCount").value;
    const inputs = document.querySelectorAll("[data-edge]");
    const adj = Array.from({ length: nodeCount }, () => []);
    const edges = [];
  
    inputs.forEach(input => {
      if (input.checked) {
        const [u, v] = input.dataset.edge.split("-").map(Number);
        adj[u].push(v);
        adj[v].push(u);
        edges.push({ from: u, to: v });
      }
    });
  
    return { adj, edges };
  }
  
  function runDFS() {
    const start = +document.getElementById("startNode").value;
    const { adj, edges } = parseEdges();
    const visited = Array(adj.length).fill(false);
    const order = [];
  
    function dfs(u) {
      visited[u] = true;
      order.push(u);
      highlightNode(u, "#8b5cf6");
      for (let v of adj[u]) {
        if (!visited[v]) dfs(v);
      }
    }
  
    dfs(start);
    document.getElementById("output").textContent = order.join(" → ");
    drawGraph(adj.length, edges, order);
  }
  
  function runBFS() {
    const start = +document.getElementById("startNode").value;
    const { adj, edges } = parseEdges();
    const visited = Array(adj.length).fill(false);
    const queue = [start];
    const order = [];
  
    visited[start] = true;
  
    while (queue.length) {
      const u = queue.shift();
      order.push(u);
      highlightNode(u, "#ec4899");
      for (let v of adj[u]) {
        if (!visited[v]) {
          visited[v] = true;
          queue.push(v);
        }
      }
    }
  
    document.getElementById("output").textContent = order.join(" → ");
    drawGraph(adj.length, edges, order);
  }
  
  function drawGraph(nodeCount, edges, highlightOrder = []) {
    const svg = document.getElementById("graphCanvas");
    svg.innerHTML = "";
  
    const radius = 200;
    const centerX = 250;
    const centerY = 250;
    const pos = Array.from({ length: nodeCount }, (_, i) => {
      const angle = (2 * Math.PI * i) / nodeCount;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
  
    edges.forEach(({ from, to }) => {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", pos[from].x);
      line.setAttribute("y1", pos[from].y);
      line.setAttribute("x2", pos[to].x);
      line.setAttribute("y2", pos[to].y);
      line.setAttribute("stroke", "#aaa");
      line.setAttribute("stroke-width", "2");
      svg.appendChild(line);
    });
  
    pos.forEach(({ x, y }, i) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", 20);
      circle.setAttribute("fill", highlightOrder.includes(i) ? "#a78bfa" : "#6b21a8");
      svg.appendChild(circle);
  
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y + 6);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "white");
      text.setAttribute("font-size", "16");
      text.textContent = i;
      svg.appendChild(text);
    });
  }
  
  function highlightNode(node, color) {
    const svg = document.getElementById("graphCanvas");
    const circles = svg.querySelectorAll("circle");
    if (circles[node]) {
      circles[node].setAttribute("fill", color);
    }
  }
  