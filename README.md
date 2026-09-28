# UC Merced Transit Planner 🚌⌚

A responsive, dynamic web application designed to optimize student transit planning at UC Merced. This project shifts away from generic static scheduling layouts, featuring a production-grade calendar-aware filtering engine built from scratch with native Vanilla JavaScript modules, a relational JSON schedule architecture, and a dynamic DOM engine.

## 🚀 Core Features & Architectural Engineering Highlights

*   **Single-Source-of-Truth Data Pipeline:** Implemented an optimized 3-Tier data model where global transit lines, stop definitions, and operational runtime sheets are fetched exactly once on initialization via asynchronous network requests (`fetch` / `async-await`), preventing resource-heavy redundant requests.
*   **Contextual Dynamic State Filtering:** Features calendar-date interception algorithms (`new Date()`) that actively evaluate current client dates (mapping weekend vs. weekday schedules) to dynamically compute unique active route nodes via a duplicate-proof JavaScript `Set` layout class.
*   **Time-Sensitive Departure Algorithm:** Sweeps through multidimensional array entries natively using customized math helpers to convert real-time clock minutes into standardized "minutes past midnight," parsing upcoming active bus departures while automatically pruning outdated schedules.
*   **Automated Micro-Interval Re-rendering:** Engineered an architectural background ticker engine utilizing browser thread loops (`setInterval`) that updates a live digital dashboard clock header and self-triggers real-time array evaluations every 10 seconds to maintain high-precision user tracking.
*   **Highly Responsive Fluid UI Layout:** Built using an elegant mobile-first design strategy relying on CSS Flexbox formatting boundaries to dynamically isolate and float structural component elements (`<span>` containers nestled within parent tracking rows).

---

## 🛠️ Technical Stack & System Blueprints

*   **Data Model Architecture:** Relational `JSON` database modeling transit lines, stops, and schedules.
*   **Frontend Engine:** Responsive Semantic HTML5 structure with specialized custom modular elements.
*   **Layout Framework:** Modern, fluid CSS3 styling rules utilizing Flexbox layout components and modern user dashboard parameters.
*   **Core Systems Controller:** Native ES6 JavaScript Modules leveraging a centralized initialization pipeline pattern.

```javascript
// A conceptual look at our system's dynamic event pipeline model:
async function initApp() {
    const response = await fetch("../data/transit_schedules.json");
    appData = await response.json();

    updateDropdown(); // Programmatically builds active stop choice arrays
    startLiveClock();  // Triggers self-perpetuating arrival recalculations
}
```

---

## 💡 Engineering Insights & Growth

Transitioning from structured game loop scripts to front-end browser system frameworks revealed deep structural parallels between **Roblox Luau execution stacks (`game.Workspace:FindFirstChild()`)** and **JavaScript's web-document object tree (`document.getElementById()`)**. Managing the lifecycle of asynchronous data state buckets across isolated function scopes cemented foundational paradigms of data encapsulation, parameter propagation, and modern single-responsibility modular software engineering.
