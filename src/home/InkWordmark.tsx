import { useEffect, useRef } from 'react';

/**
 * INK INDEX — the ENIGMA wordmark as printed matter under solvent.
 *
 * A GPU pass feeds the page's own serif wordmark into a shader. Near the
 * pointer the letterforms are displaced by a slow noise field, eaten by an
 * ink-solvent mask and briefly replaced by monospaced archive fragments.
 *
 * Two textures keep the pass honest. `uText` is a raster of the live glyphs
 * and `uMask` is the same glyphs dilated into a soft envelope, so the pass can
 * only paint on and just around the type. The page underneath is therefore
 * never washed over — the terrain, rules and background stay untouched.
 *
 * Away from the pointer the pass discards itself, so the untouched DOM
 * typography underneath is always the true, selectable, accessible text.
 *
 * The field is fed by a lagging pointer plus a handful of decaying "wakes",
 * so a stroke leaves a wake and an exit dissolves rather than switching off.
 */

const WORD = 'ENIGMA';
const TRAIL = 6;
const REACH = 0.26;
const CELL_ATLAS = 8;
const INK = [0.937, 0.91, 0.863] as const;

const GLYPHS = [
  '#', '.', '/', 'X', '+', ':', '*', '0',
  '1', '2', '3', '7', '[', ']', '{', '}',
  '<', '>', '=', '~', '%', '?', '!', ';',
  '$', '&', '@', '|', '_', '-', '\\', '^',
];

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;

void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uText;
uniform sampler2D uMask;
uniform sampler2D uAtlas;
uniform vec2 uRes;
uniform vec4 uTrail[${TRAIL}];
uniform vec2 uVel;
uniform float uTime;
uniform float uCell;
uniform float uReach;
uniform vec3 uInk;
uniform float uExit;

float hash21(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = p * 2.02 + vec2(11.7, 7.3);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 px = vUv * uRes;
  float tall = uRes.y;

  /* --- the disturbance field ------------------------------------------- */
  /* Exit: the whole word lets go at once instead of under a pointer. */
  float field = uExit * 1.45;
  for (int i = 0; i < ${TRAIL}; i++) {
    vec4 t = uTrail[i];
    if (t.z <= 0.001) continue;
    vec2 d = (px - t.xy) / tall;
    float r = length(d * vec2(0.86, 1.0));
    float reach = uReach * (0.74 + 0.42 * t.z);
    field = max(field, smoothstep(reach, reach * 0.1, r) * t.z);
  }
  if (field <= 0.004) discard;

  float wet = smoothstep(0.05, 0.4, field);

  float n1 = fbm(px / tall * 3.1 + vec2(uTime * 0.09, uTime * -0.06));
  float n2 = fbm(px / tall * 7.3 - vec2(uTime * 0.14, uTime * 0.1) + 21.0);

  /* Solvent strength: the front is irregular, not a clean disc. */
  float soak = wet * (0.52 + 0.8 * n1);

  /* --- fluid displacement ---------------------------------------------- */
  /* A liquid does not shear type apart, it runs through it. The stroke
     gradient gives the letterform's normal, and the warp is decomposed
     against it: displacement across a stem is damped at the edges while
     displacement along the stroke is amplified. Stems keep their weight and
     the ink visibly slides and turns inside the letter. */
  float ax = 2.0 / uRes.x;
  float ay = 2.0 / uRes.y;
  float aL = texture2D(uText, vUv - vec2(ax, 0.0)).a;
  float aR = texture2D(uText, vUv + vec2(ax, 0.0)).a;
  float aB = texture2D(uText, vUv - vec2(0.0, ay)).a;
  float aT = texture2D(uText, vUv + vec2(0.0, ay)).a;
  vec2 grad = vec2(aR - aL, aT - aB);
  float gLen = length(grad);
  vec2 normal = gLen > 0.001 ? grad / gLen : vec2(0.0, 1.0);
  vec2 tangent = vec2(-normal.y, normal.x);
  /* How confident we are that this pixel sits on a stroke edge. */
  float onEdge = smoothstep(0.03, 0.35, gLen);

  float wave = sin(px.y * 0.072 + uTime * 1.15 + n1 * 3.4) * 0.5
             + sin(px.y * 0.029 - uTime * 0.62 + n2 * 2.2) * 0.5;
  vec2 radial = px - uTrail[0].xy;
  float dist = max(20.0, length(radial));
  vec2 push = radial / dist;
  /* The ink also turns around the pointer instead of only being shoved. */
  vec2 swirl = vec2(-radial.y, radial.x) / dist;

  vec2 flowPx = vec2(wave * 0.017, (n2 - 0.5) * 0.013) * tall * soak;
  flowPx += (push * 0.008 + swirl * 0.010) * tall * soak;
  flowPx += uVel * tall * soak * 0.3;
  flowPx += (vec2(n1, n2) - 0.5) * 0.008 * tall * soak;

  vec2 warpPx = normal * dot(flowPx, normal) * mix(0.5, 0.18, onEdge)
              + tangent * dot(flowPx, tangent) * mix(0.5, 1.5, onEdge);

  /* Letting go: ink runs down in uneven rivulets, one rate per column. */
  float column = floor(px.x / max(8.0, uCell * 1.2));
  float rivulet = 0.35 + 0.65 * hash21(vec2(column, 5.3));
  warpPx.y += uExit * uExit * 0.34 * tall * rivulet;

  vec2 uv = vUv + warpPx / uRes;

  /* --- wordmark -------------------------------------------------------- */
  /* Thresholded rather than sampled raw: a soft read smears ink into grey
     mid-tones, while a crisp edge moves as liquid and stays legible. */
  float glyph = smoothstep(0.3, 0.7, texture2D(uText, uv).a);

  /* Solvent erosion: ink frays at the front of the wash and speckles a
     little through the wetted centre. Capped so the word stays legible. */
  /* The grain rides with the displaced ink, so the erosion looks carried by
     the flow rather than printed onto the letter. */
  float grain = fbm(px / tall * 26.0 + vec2(uTime * 0.42, -uTime * 0.33) + warpPx / tall * 3.0);
  float front = smoothstep(0.16, 0.6, soak) * (1.0 - smoothstep(0.78, 1.1, soak));
  float eat = smoothstep(0.56, 0.68, grain) * front;
  eat += smoothstep(0.74, 0.92, grain) * soak * 0.1;
  /* The drain keeps eating until almost nothing is left of the word. */
  eat = max(eat, smoothstep(0.0, 1.0, uExit) * (0.3 + 0.8 * grain));
  /* Ink is lifted, not dimmed: multiplying coverage would only tint the
     letter grey, so removal is thresholded to a crisp edge. */
  glyph *= 1.0 - smoothstep(0.3, 0.55, eat);

  /* --- archive fragments ------------------------------------------------ */
  vec2 cellIndex = floor(px / uCell);
  vec2 cellPx = (cellIndex + 0.5) * uCell;
  float cellCover = texture2D(uText, cellPx / uRes).a;
  float ch = hash21(cellIndex + 7.1);
  float cellClock = hash21(cellIndex + 11.3);

  /* Inside the wet ink the type is re-encoded: cells flip to monospaced
     archive characters on their own clocks, each settling with a slow roll,
     and a band of characters reads down the letterform a few times a second.
     Both stay inside the type, so they read as data leaving the ink. */
  float wetCell = smoothstep(0.5, 0.82, soak);
  float band = smoothstep(0.07, 0.0, abs(fract(vUv.y - uTime * (0.16 + uExit * 0.9)) - 0.5));
  float reading = clamp(step(0.74, ch) + band * 0.55 + uExit * 0.55 * step(0.45, ch), 0.0, 1.0);
  reading *= step(0.3, cellCover) * wetCell;

  float frag = 0.0;
  if (reading > 0.01) {
    float tick = floor(uTime * (1.4 + cellClock * 2.6) + cellClock * 24.0);
    float idx = floor(hash21(cellIndex + tick * 0.41) * 32.0);
    vec2 slot = vec2(mod(idx, ${CELL_ATLAS}.0), floor(idx / ${CELL_ATLAS}.0));
    vec2 local = fract(px / uCell);
    local.y = fract(local.y + sin(uTime * 1.7 + cellClock * 6.283) * 0.12);
    vec2 atlasUv = (slot + 0.18 + local * 0.64) / vec2(${CELL_ATLAS}.0, 4.0);
    atlasUv.y = 1.0 - atlasUv.y;

    float shape = texture2D(uAtlas, atlasUv).a;
    /* Hard on/off per cell: a terminal flickers, it does not fade. */
    float on = step(0.5, reading * (0.55 + 0.45 * sin(uTime * 2.6 + cellClock * 12.0)));
    frag = shape * on;
    glyph *= 1.0 - shape * on;
  }

  /* --- compose ---------------------------------------------------------- */
  /* The pass owns the type itself, so erosion can lift ink away cleanly
     instead of tinting the page grey, and may additionally carry displaced
     ink a few pixels past the letterform. Nothing else is ever painted, so
     the background and the ASCII terrain stay untouched. */
  float ink = clamp(glyph + frag, 0.0, 1.0);
  float own = smoothstep(0.02, 0.3, texture2D(uText, vUv).a);
  /* Displaced ink outside the letterform is drawn solid rather than faded:
     a soft alpha turns cream ink into grey smoke against the black page. */
  float outside = smoothstep(0.06, 0.22, texture2D(uMask, uv).a);
  float spilled = smoothstep(0.45, 0.7, ink) * outside;
  float presence = smoothstep(0.08, 0.38, wet);
  float alpha = max(own, spilled) * presence;
  if (alpha <= 0.002) discard;

  /* Wet ink catches a little more light at the front of the wash. The value
     is thresholded so the pass stays two-tone: ink or page, never grey. */
  vec3 tone = uInk * (0.9 + 0.16 * n2) * (1.0 + 0.12 * front);
  vec3 color = tone * smoothstep(0.4, 0.6, ink);

  gl_FragColor = vec4(color, alpha);
}
`;

type Engine = { dispose: () => void; rebuild: () => void };

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) console.warn('[ink]', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createInk(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  word: HTMLElement,
): Engine | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: 'low-power',
  });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniform = {
    text: gl.getUniformLocation(program, 'uText'),
    mask: gl.getUniformLocation(program, 'uMask'),
    atlas: gl.getUniformLocation(program, 'uAtlas'),
    res: gl.getUniformLocation(program, 'uRes'),
    trail: gl.getUniformLocation(program, 'uTrail[0]'),
    vel: gl.getUniformLocation(program, 'uVel'),
    time: gl.getUniformLocation(program, 'uTime'),
    cell: gl.getUniformLocation(program, 'uCell'),
    reach: gl.getUniformLocation(program, 'uReach'),
    ink: gl.getUniformLocation(program, 'uInk'),
    exit: gl.getUniformLocation(program, 'uExit'),
  };

  gl.useProgram(program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let textTexture: WebGLTexture | null = null;
  let maskTexture: WebGLTexture | null = null;
  let atlasTexture: WebGLTexture | null = null;
  let cellDevice = 16;
  let time = 0;
  let frame = 0;
  let last = 0;
  let hovering = false;
  let pointerType = 'mouse';
  let touchUntil = 0;
  let spawnedAt = 0;
  let lastSpawnX = 0;
  let lastSpawnY = 0;
  let wakeSlot = 1;
  let exit = 0;
  let exitTarget = 0;

  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const vel = { x: 0, y: 0 };
  const trail = new Float32Array(TRAIL * 4);

  const upload = (source: HTMLCanvasElement, previous: WebGLTexture | null) => {
    if (previous) gl.deleteTexture(previous);
    const texture = gl.createTexture();
    if (!texture) return null;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  };

  /**
   * Paints the live wordmark into a canvas registered to the page's own glyph
   * position, plus a dilated copy of it that becomes the shader's envelope.
   */
  const paintWordmark = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const surface = document.createElement('canvas');
    surface.width = canvas.width;
    surface.height = canvas.height;

    const ctx = surface.getContext('2d');
    if (!ctx) return null;

    const style = getComputedStyle(host);
    const size = parseFloat(style.fontSize);
    const italic = style.fontStyle === 'italic' ? 'italic ' : '';
    const font = `${italic}${style.fontWeight} ${size}px ${style.fontFamily}`;

    const canvasRect = canvas.getBoundingClientRect();
    const wordRect = word.getBoundingClientRect();
    const left = wordRect.left - canvasRect.left;
    const top = wordRect.top - canvasRect.top;

    const setup = (
      context: CanvasRenderingContext2D,
    ) => {
      context.scale(dpr, dpr);
      context.font = font;
      context.textAlign = 'left';
      context.textBaseline = 'alphabetic';
      context.fillStyle = '#ffffff';
      const spacing = style.letterSpacing;
      if (spacing && spacing !== 'normal') {
        (context as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing =
          spacing;
      }
      const ascent = context.measureText(WORD).fontBoundingBoxAscent || size * 0.8;
      const descent = context.measureText(WORD).fontBoundingBoxDescent || size * 0.2;
      const line = word.offsetHeight || size * 0.74;
      return { baseline: top + (line - (ascent + descent)) / 2 + ascent, left };
    };

    const { baseline } = setup(ctx);
    ctx.fillText(WORD, left, baseline);

    /* Dilated envelope: two rings of faint copies give a soft, wide bleed
       that follows the type exactly, so no wash can reach the background. */
    const mask = document.createElement('canvas');
    mask.width = canvas.width;
    mask.height = canvas.height;
    const maskCtx = mask.getContext('2d');
    if (maskCtx) {
      setup(maskCtx);
      const spread = Math.max(2, size * 0.013);
      maskCtx.fillText(WORD, left, baseline);
      maskCtx.globalAlpha = 0.12;
      for (let index = 0; index < 16; index += 1) {
        const angle = (index / 16) * Math.PI * 2;
        maskCtx.fillText(
          WORD,
          left + Math.cos(angle) * spread * 0.8,
          baseline + Math.sin(angle) * spread * 0.8,
        );
      }
      maskCtx.globalAlpha = 0.05;
      for (let index = 0; index < 12; index += 1) {
        const angle = (index / 12) * Math.PI * 2 + 0.2;
        maskCtx.fillText(
          WORD,
          left + Math.cos(angle) * spread * 1.7,
          baseline + Math.sin(angle) * spread * 1.7,
        );
      }
      maskCtx.globalAlpha = 1;
    }

    cellDevice = Math.round(Math.max(8, Math.min(16, size * 0.045)) * dpr);
    return { surface, mask };
  };

  const paintAtlas = (cell: number) => {
    const surface = document.createElement('canvas');
    surface.width = cell * CELL_ATLAS;
    surface.height = cell * 4;
    const ctx = surface.getContext('2d');
    if (!ctx) return null;

    ctx.font = `500 ${Math.round(cell * 0.78)}px "Geist Mono Variable", "Geist Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    GLYPHS.forEach((glyph, index) => {
      const column = index % CELL_ATLAS;
      const row = Math.floor(index / CELL_ATLAS);
      ctx.fillText(
        glyph,
        column * cell + cell / 2,
        row * cell + cell / 2 + cell * 0.04,
      );
    });
    return surface;
  };

  const build = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    const changed = width !== canvas.width || height !== canvas.height;

    if (changed) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);

    const painted = paintWordmark();
    if (painted) {
      textTexture = upload(painted.surface, textTexture);
      maskTexture = upload(painted.mask, maskTexture);
    }

    const atlas = paintAtlas(Math.max(8, cellDevice));
    if (atlas) atlasTexture = upload(atlas, atlasTexture);

    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textTexture);
    gl.uniform1i(uniform.text, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, maskTexture);
    gl.uniform1i(uniform.mask, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
    gl.uniform1i(uniform.atlas, 2);
    gl.uniform2f(uniform.res, width, height);
    gl.uniform3f(uniform.ink, INK[0], INK[1], INK[2]);
    gl.uniform1f(uniform.reach, REACH);
    gl.uniform1f(uniform.cell, Math.max(8, cellDevice));
  };

  const sample = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    target.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    target.y = ((rect.bottom - event.clientY) / rect.height) * canvas.height;
  };

  const spawnWake = () => {
    const index = wakeSlot;
    wakeSlot = 1 + (wakeSlot % (TRAIL - 1));
    trail[index * 4] = pointer.x;
    trail[index * 4 + 1] = pointer.y;
    trail[index * 4 + 2] = 0.9;
    trail[index * 4 + 3] = 0;
  };

  const resetTrail = () => {
    trail.fill(0);
    pointer.x = target.x;
    pointer.y = target.y;
    vel.x = 0;
    vel.y = 0;
    trail[0] = pointer.x;
    trail[1] = pointer.y;
    trail[2] = 0;
    trail[3] = 0;
    lastSpawnX = pointer.x;
    lastSpawnY = pointer.y;
    spawnedAt = 0;
  };

  const draw = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, maskTexture);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
    gl.uniform4fv(uniform.trail, trail);
    gl.uniform2f(uniform.vel, vel.x, vel.y);
    gl.uniform1f(uniform.time, time);
    gl.uniform1f(uniform.cell, Math.max(8, cellDevice));
    gl.uniform1f(uniform.exit, exit);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const tick = (now: number) => {
    frame = 0;
    const delta = last ? Math.min(3, (now - last) / 16.667) : 1;
    last = now;
    time += (delta * 16.667) / 1000;

    /* The drain ramps rather than snapping, so the ink lets go of the type. */
    exit += (exitTarget - exit) * 0.16 * delta;
    if (exit > 0.998) exit = 1;

    if (pointerType !== 'mouse' && hovering && now > touchUntil) hovering = false;

    const live = trail[2] || 0;
    trail[2] = live + (((hovering ? 1 : 0) - live) * 0.16 * delta);

    pointer.x += (target.x - pointer.x) * 0.22 * delta;
    pointer.y += (target.y - pointer.y) * 0.22 * delta;

    const driftX = (pointer.x - trail[0]) / Math.max(1, canvas.height);
    const driftY = (pointer.y - trail[1]) / Math.max(1, canvas.height);
    vel.x += (Math.max(-0.04, Math.min(0.04, driftX)) - vel.x) * 0.3 * delta;
    vel.y += (Math.max(-0.04, Math.min(0.04, driftY)) - vel.y) * 0.3 * delta;

    trail[0] = pointer.x;
    trail[1] = pointer.y;

    for (let index = 1; index < TRAIL; index += 1) {
      const weight = trail[index * 4 + 2];
      if (weight > 0) {
        trail[index * 4 + 2] = Math.max(0, weight * Math.pow(0.9, delta));
      }
    }

    if (hovering) {
      const dx = pointer.x - lastSpawnX;
      const dy = pointer.y - lastSpawnY;
      if (dx * dx + dy * dy > (canvas.height * 0.045) ** 2 && now - spawnedAt > 46) {
        spawnWake();
        lastSpawnX = pointer.x;
        lastSpawnY = pointer.y;
        spawnedAt = now;
      }
    }

    draw();

    let wakes = 0;
    for (let index = 1; index < TRAIL; index += 1) {
      wakes = Math.max(wakes, trail[index * 4 + 2]);
    }

    if (hovering || trail[2] > 0.004 || wakes > 0.01 || exitTarget > 0) {
      frame = window.requestAnimationFrame(tick);
    } else {
      trail[2] = 0;
      gl.clear(gl.COLOR_BUFFER_BIT);
      last = 0;
    }
  };

  const wake = () => {
    if (!frame) {
      last = 0;
      frame = window.requestAnimationFrame(tick);
    }
  };

  const onEnter = (event: PointerEvent) => {
    pointerType = event.pointerType;
    hovering = true;
    sample(event);
    resetTrail();
    wake();
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') {
      if (!hovering) return;
      touchUntil = performance.now() + 320;
    }
    hovering = true;
    sample(event);
    wake();
  };

  const onLeave = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    hovering = false;
    wake();
  };

  const onDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') return;
    pointerType = event.pointerType;
    hovering = true;
    touchUntil = performance.now() + 850;
    sample(event);
    resetTrail();
    wake();
  };

  const onDrain = () => {
    exitTarget = 1;
    wake();
  };
  host.addEventListener('ink:drain', onDrain);

  const observer = new ResizeObserver(() => {
    build();
    if (!frame) wake();
  });
  observer.observe(host);

  const onResize = () => build();
  window.addEventListener('resize', onResize, { passive: true });

  host.addEventListener('pointerenter', onEnter, { passive: true });
  host.addEventListener('pointermove', onMove, { passive: true });
  host.addEventListener('pointerleave', onLeave, { passive: true });
  host.addEventListener('pointerdown', onDown, { passive: true });

  build();
  gl.clear(gl.COLOR_BUFFER_BIT);

  return {
    rebuild: () => {
      build();
      if (!frame) wake();
    },
    dispose: () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      host.removeEventListener('pointerenter', onEnter);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
      host.removeEventListener('ink:drain', onDrain);
      if (textTexture) gl.deleteTexture(textTexture);
      if (maskTexture) gl.deleteTexture(maskTexture);
      if (atlasTexture) gl.deleteTexture(atlasTexture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
  };
}

export function InkWordmark() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.closest<HTMLElement>('.home-hero__wordmark');
    const word = host?.querySelector<HTMLElement>('.home-hero__wordmark-glyph');
    if (!canvas || !host || !word) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let engine: Engine | null = null;
    let cancelled = false;

    const start = () => {
      if (cancelled || engine || motion.matches) return;
      try {
        engine = createInk(canvas, host, word);
      } catch (error) {
        if (import.meta.env.DEV) console.warn('[ink] init failed', error);
        engine = null;
      }
    };

    const stop = () => {
      engine?.dispose();
      engine = null;
    };

    const sync = () => {
      if (motion.matches) stop();
      else start();
    };

    sync();
    document.fonts.ready.then(() => {
      if (cancelled) return;
      if (engine) engine.rebuild();
      else sync();
    });
    motion.addEventListener('change', sync);

    return () => {
      cancelled = true;
      motion.removeEventListener('change', sync);
      stop();
    };
  }, []);

  return <canvas ref={canvasRef} className="home-hero__ink" aria-hidden="true" />;
}
