"use strict";

// timeAtUTCOffset Gets time in a timezone at offset
function timeAtUTCOffset(offsetHours) {
  const localTime = new Date();
  const utcDate = localTime.getTime() + localTime.getTimezoneOffset() * 60000;
  return  new Date(utcDate + offsetHours * 3600000); // 60 * 60 * 1000 ms
}

// radians is a convenience method to convert degrees to radians
function radians(degrees) {
  return degrees * Math.PI / 180
}

function polarToCartesian(h, deg) {
  return {
    x: h * Math.cos(radians(deg)),
    y: h * Math.sin(radians(deg)),
  }
}

// SVGWatch creates a watch in a viewport that covers 80% of viewport width
class SVGWatch {
  constructor(id, city, tzOffsetHours) {
    this.svgWidth = this.svgHeight = 100; // SVG Canvas size
    this.radius = this.svgWidth * 0.4; // 40% of canvas width
    this.hhLength = this.radius * 0.3;
    this.mmLength = this.radius * 0.7;
    this.ssLength = this.radius * 0.8;
    this.cx = this.svgWidth / 2; // Center of circle (cx, cy)
    this.cy = this.svgHeight / 2;
    this.clockid = id;
    this.clockhands = id + "-hands"; // ID for child svg "-hands", to be redrawn every second
    this.city = city;
    this.tz = tzOffsetHours;
  }

  // drawClock within a viewBox of 0, 0, 100, 100. Canvas height width ignored. Watch is always drawn in viewport.
  drawClock() {
    const svg = this.createClockSVG()
    const clockDoc = document.getElementById(this.clockid);
    clockDoc.innerHTML = svg;  // embed SVG HTML for a clock in element "id"
  }

  // createClockSVG creates SVG of 100x100 and draws on complete viewport
  createClockSVG() {
    // Draw out circle
    let clockSvg = `<svg class="clock-analog-draw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.svgWidth} ${this.svgHeight}">`;
    clockSvg += this.createMarkers("clock-marker-three-hour", 90, 0.9);
    clockSvg += this.createMarkers("clock-marker-hour", 30, 0.10);
    clockSvg += this.createMarkers("clock-marker-minute", 5, 0.08);
    clockSvg += `<svg id=${this.clockhands}>`;
    const {hh, mm, ss} = SVGWatch.getHandsDegrees(this.tz);
    clockSvg += this.createHand("clock-hand-hour", polarToCartesian(this.hhLength, hh));
    clockSvg += this.createHand("clock-hand-minutes", polarToCartesian(this.mmLength, mm));
    clockSvg += this.createHand("clock-hand-seconds", polarToCartesian(this.ssLength, ss));
    clockSvg += `</svg>`;
    clockSvg += this.putText("12", polarToCartesian(this.radius * 0.75, 90)); // Two digits "1" and "2"
    clockSvg += this.putText("3", polarToCartesian(this.radius * 0.84, 355));
    clockSvg += this.putText("6", polarToCartesian(this.radius * 0.89, 270));
    clockSvg += this.putText("9", polarToCartesian(this.radius * 0.84, 184));
    clockSvg += `<circle class="clock-perimeter clock-svg-elem" cx="${this.cx}" cy="${this.cy}" r="${this.radius}" fill="transparent" stroke="silver" stroke-width="3"/>`;
    return clockSvg;
  }

  /**
   * createMarkers: creates marker Lines radially across all radii after Δθ (delta)
   * @param name:  Name of <line class="$name clock-svg-elem"
   * @param delta: Draw marker at every delta from o to 360 in increments of Δθ
   * @param sz: how long to draw at tip of radii. eg from 0.9r to r
   * @returns {string}
   */
  createMarkers(name, delta, sz) {
    const size = (1 - sz) * this.radius;
    let markerLine = "";
    // Draw markers along a radii from (r1-Δ,θ ==> r1,θ)
    let pts = [];
    for (let deg = 0; deg <= 360; deg += delta) {
      const rads = radians(deg);
      pts.push({
        from: this.transform({x: size * Math.cos(rads), y: size * Math.sin(rads)}),
        to: this.transform({x: this.radius * Math.cos(rads), y: this.radius * Math.sin(rads)})
      })
    }

    // Create line
    for (let i = 0; i < pts.length; i++) {
      markerLine += `<line class="${name} clock-svg-elem" x1="${pts[i].from.x}" y1=${pts[i].from.y} x2="${pts[i].to.x}" y2="${pts[i].to.y}"/>`;
    }
    return markerLine;
  }

  // createHand is a line from (0,0) --> (to.x,to.y) in x/y plane
  createHand(name, to) {
    const fTo = this.transform(to);
    return `<line id="id-${name}" class="${name} clock-svg-elem" x1="${this.cx}" y1="${this.cy}" x2="${fTo.x}" y2="${fTo.y}""/>`;
  }

  // Places a text "t" at point pt.x, pt.y
  putText(t, pt) {
    const p = this.transform(pt);
    return `<text x="${p.x}" y="${p.y}" class="clock-svg-elem clock-marker-hour-text">${t}</text>`;
  }

  // transform a cartesian x-y to SVG x/y with origin as
  transform(pt) {
    return {x: pt.x + this.cx, y: -pt.y + this.cy};
  }

  // getHandsDegrees Gets cloak hands in  degrees angles relative to x-axis
  static getHandsDegrees(tz) {
    const t = timeAtUTCOffset(tz); // Get browsers local date and time.
    const ss = 90 - t.getSeconds() * 6;
    const mm = 90 - t.getMinutes() * 6 - 0.1 * t.getSeconds();
    const hh = 90 - 30 * t.getHours() - 0.5 * t.getMinutes();
    return {hh, mm, ss};
  }

  // redrawHands convenience handlers for drawing clock hands at local timezone
  redrawHands() {
    const {hh, mm, ss} = SVGWatch.getHandsDegrees(this.tz);
    let handsSvg = this.createHand("clock-hand-hour", polarToCartesian(this.hhLength, hh));
    handsSvg += this.createHand("clock-hand-minutes", polarToCartesian(this.mmLength, mm));
    handsSvg += this.createHand("clock-hand-seconds", polarToCartesian(this.ssLength, ss));
    const el = document.getElementById(this.clockhands);
    el.innerHTML = handsSvg;
  }
}
