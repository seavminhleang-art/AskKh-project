import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;
uniform float uLightMode;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / max(d, 0.0001);
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / max(uResolution.y, 0.0001);

  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV + 0.0001) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / max(uResolution.y, 0.0001);
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV + 0.0001) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uLightMode > 0.5) {
    float energy = max(max(col.r, col.g), col.b);
    float coverage = clamp(smoothstep(0.0, 0.42, energy) * 0.92, 0.0, 0.92);
    vec3 ink = clamp(col * 0.48, 0.0, 0.82);
    gl_FragColor = vec4(mix(vec3(1.0), ink, coverage), 1.0);
  } else if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

export default function Galaxy({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.5,
  density = 1.0,
  hueShift = 140.0,
  disableAnimation = false,
  speed = 1.0,
  mouseInteraction = true,
  glowIntensity = 0.3,
  saturation = 0.0,
  mouseRepulsion = true,
  repulsionStrength = 2.0,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  autoCenterRepulsion = 0.0,
  transparent = true,
  lightMode = false,
  className = '',
  style = {},
  ...props
}) {
  const containerRef = useRef(null);
  const targetMouse = useRef({ x: 0.5, y: 0.5 });
  const currentMouse = useRef({ x: 0.5, y: 0.5 });
  const mouseActive = useRef(0);
  const smoothedMouseActive = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const gl =
      canvas.getContext('webgl', {
        alpha: transparent,
        premultipliedAlpha: false,
        antialias: true,
      }) ||
      canvas.getContext('experimental-webgl', {
        alpha: transparent,
        premultipliedAlpha: false,
      });

    if (!gl) {
      console.warn('WebGL not supported for Galaxy background.');
      return () => {
        if (container.contains(canvas)) container.removeChild(canvas);
      };
    }

    if (lightMode) {
      gl.clearColor(1, 1, 1, 1);
    } else if (transparent) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(0, 0, 0, 1);
    }

    // Shader compilation
    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vertShader || !fragShader) {
      return () => {
        if (container.contains(canvas)) container.removeChild(canvas);
      };
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return () => {
        if (container.contains(canvas)) container.removeChild(canvas);
      };
    }

    gl.useProgram(program);

    // Full-screen Quad buffer: 2 triangles (position: x, y, uv: u, v)
    // Coords: [x, y, u, v]
    const vertices = new Float32Array([
      -1, -1, 0, 0,
       1, -1, 1, 0,
      -1,  1, 0, 1,
      -1,  1, 0, 1,
       1, -1, 1, 0,
       1,  1, 1, 1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const FSIZE = vertices.BYTES_PER_ELEMENT;
    const aPosition = gl.getAttribLocation(program, 'position');
    const aUv = gl.getAttribLocation(program, 'uv');

    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 4, 0);

    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);

    // Uniform locations
    const uLocs = {
      uTime: gl.getUniformLocation(program, 'uTime'),
      uResolution: gl.getUniformLocation(program, 'uResolution'),
      uFocal: gl.getUniformLocation(program, 'uFocal'),
      uRotation: gl.getUniformLocation(program, 'uRotation'),
      uStarSpeed: gl.getUniformLocation(program, 'uStarSpeed'),
      uDensity: gl.getUniformLocation(program, 'uDensity'),
      uHueShift: gl.getUniformLocation(program, 'uHueShift'),
      uSpeed: gl.getUniformLocation(program, 'uSpeed'),
      uMouse: gl.getUniformLocation(program, 'uMouse'),
      uGlowIntensity: gl.getUniformLocation(program, 'uGlowIntensity'),
      uSaturation: gl.getUniformLocation(program, 'uSaturation'),
      uMouseRepulsion: gl.getUniformLocation(program, 'uMouseRepulsion'),
      uTwinkleIntensity: gl.getUniformLocation(program, 'uTwinkleIntensity'),
      uRotationSpeed: gl.getUniformLocation(program, 'uRotationSpeed'),
      uRepulsionStrength: gl.getUniformLocation(program, 'uRepulsionStrength'),
      uMouseActiveFactor: gl.getUniformLocation(program, 'uMouseActiveFactor'),
      uAutoCenterRepulsion: gl.getUniformLocation(program, 'uAutoCenterRepulsion'),
      uTransparent: gl.getUniformLocation(program, 'uTransparent'),
      uLightMode: gl.getUniformLocation(program, 'uLightMode'),
    };

    // Resize handler
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.useProgram(program);
      gl.uniform3f(uLocs.uResolution, canvas.width, canvas.height, canvas.width / canvas.height);
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    // Mouse handlers
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse.current = { x, y };
      mouseActive.current = 1.0;
    };

    const handleMouseLeave = () => {
      mouseActive.current = 0.0;
    };

    if (mouseInteraction) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation Loop
    let animationFrameId;
    let startTime = performance.now();

    const render = (currentTime) => {
      animationFrameId = requestAnimationFrame(render);

      const elapsed = (currentTime - startTime) * 0.001;

      // Lerp mouse
      const lerpFactor = 0.05;
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * lerpFactor;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * lerpFactor;
      smoothedMouseActive.current += (mouseActive.current - smoothedMouseActive.current) * lerpFactor;

      gl.useProgram(program);

      if (!disableAnimation) {
        gl.uniform1f(uLocs.uTime, elapsed);
        gl.uniform1f(uLocs.uStarSpeed, (elapsed * starSpeed) / 10.0);
      } else {
        gl.uniform1f(uLocs.uTime, 0);
        gl.uniform1f(uLocs.uStarSpeed, 0);
      }

      gl.uniform2f(uLocs.uFocal, focal[0], focal[1]);
      gl.uniform2f(uLocs.uRotation, rotation[0], rotation[1]);
      gl.uniform1f(uLocs.uDensity, density);
      gl.uniform1f(uLocs.uHueShift, hueShift);
      gl.uniform1f(uLocs.uSpeed, speed);
      gl.uniform2f(uLocs.uMouse, currentMouse.current.x, currentMouse.current.y);
      gl.uniform1f(uLocs.uGlowIntensity, glowIntensity);
      gl.uniform1f(uLocs.uSaturation, saturation);
      gl.uniform1i(uLocs.uMouseRepulsion, mouseRepulsion ? 1 : 0);
      gl.uniform1f(uLocs.uTwinkleIntensity, twinkleIntensity);
      gl.uniform1f(uLocs.uRotationSpeed, rotationSpeed);
      gl.uniform1f(uLocs.uRepulsionStrength, repulsionStrength);
      gl.uniform1f(uLocs.uMouseActiveFactor, smoothedMouseActive.current);
      gl.uniform1f(uLocs.uAutoCenterRepulsion, autoCenterRepulsion);
      gl.uniform1i(uLocs.uTransparent, transparent ? 1 : 0);
      gl.uniform1f(uLocs.uLightMode, lightMode ? 1.0 : 0.0);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
      if (mouseInteraction) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
      const loseContextExt = gl.getExtension('WEBGL_lose_context');
      if (loseContextExt) loseContextExt.loseContext();
    };
  }, [
    focal,
    rotation,
    starSpeed,
    density,
    hueShift,
    disableAnimation,
    speed,
    mouseInteraction,
    glowIntensity,
    saturation,
    mouseRepulsion,
    repulsionStrength,
    twinkleIntensity,
    rotationSpeed,
    autoCenterRepulsion,
    transparent,
    lightMode,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ minHeight: '100%', ...style }}
      {...props}
    />
  );
}
