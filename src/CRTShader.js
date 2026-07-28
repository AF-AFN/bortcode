export const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const fragmentShaderSource = `
  precision highp float;

  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  uniform float u_time;

  const float PI = 3.14159265;
  const vec3 LUMA = vec3(0.299, 0.587, 0.114);

  vec2 curveRemapUV(vec2 uv, float curvature) {
    vec2 coords = uv * 2.0 - 1.0;
    float curveAmount = curvature * 0.25;
    float dist = dot(coords, coords);
    coords = coords * (1.0 + dist * curveAmount);
    return coords * 0.5 + 0.5;
  }

  vec4 sampleBloom(sampler2D tex, vec2 uv, float radius, vec4 centerSample) {
    vec2 o = vec2(radius);
    vec4 c = centerSample * 0.4;
    vec4 cross = (
      texture2D(tex, uv + vec2(o.x, 0.0)) +
      texture2D(tex, uv - vec2(o.x, 0.0)) +
      texture2D(tex, uv + vec2(0.0, o.y)) +
      texture2D(tex, uv - vec2(0.0, o.y))
    ) * 0.15;
    return c + cross;
  }

  float vignetteApprox(vec2 uv, float strength) {
    vec2 vigCoord = uv * 2.0 - 1.0;
    float dist = max(abs(vigCoord.x), abs(vigCoord.y));
    return 1.0 - dist * dist * strength;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.y = 1.0 - uv.y;
    float curvature = 0.08;
    float scanlineIntensity = 0.18;
    float scanlineCount = 120.0;
    float yOffset = 0.0;
    float brightness = 1.15;
    float contrast = 1.1;
    float saturation = 1.15;
    float bloomIntensity = 0.25;
    float bloomThreshold = 0.4;
    float rgbShift = 0.002;
    float adaptiveIntensity = 0.3;
    float vignetteStrength = 0.35;
    float flickerStrength = 0.008;

    if (curvature > 0.001) {
      uv = curveRemapUV(uv, curvature);
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0);
        return;
      }
    }

    vec4 pixel = texture2D(u_texture, uv);

    if (bloomIntensity > 0.001) {
      float pixelLum = dot(pixel.rgb, LUMA);
      float bloomThresholdHalf = bloomThreshold * 0.5;
      if (pixelLum > bloomThresholdHalf) {
        vec4 bloomSample = sampleBloom(u_texture, uv, 0.005, pixel);
        bloomSample.rgb *= brightness;
        float bloomLum = dot(bloomSample.rgb, LUMA);
        float bloomFactor = bloomIntensity * max(0.0, (bloomLum - bloomThreshold) * 1.5);
        pixel.rgb += bloomSample.rgb * bloomFactor;
      }
    }

    if (rgbShift > 0.005) {
      float shift = rgbShift * 0.005;
      pixel.r += texture2D(u_texture, vec2(uv.x + shift, uv.y)).r * 0.08;
      pixel.b += texture2D(u_texture, vec2(uv.x - shift, uv.y)).b * 0.08;
    }

    pixel.rgb *= brightness;

    float luminance = dot(pixel.rgb, LUMA);
    pixel.rgb = (pixel.rgb - 0.5) * contrast + 0.5;
    pixel.rgb = mix(vec3(luminance), pixel.rgb, saturation);

    float mask = 1.0;

    if (scanlineIntensity > 0.001) {
      float scanY = (uv.y + yOffset) * scanlineCount;
      float scanPat = abs(sin(scanY * PI));
      float adaptiveFactor = 1.0;
      if (adaptiveIntensity > 0.001) {
        float yPat = sin(uv.y * 30.0) * 0.5 + 0.5;
        adaptiveFactor = 1.0 - yPat * adaptiveIntensity * 0.2;
      }
      mask *= 1.0 - scanPat * scanlineIntensity * adaptiveFactor;
    }

    if (flickerStrength > 0.001) {
      mask *= 1.0 + sin(u_time * 110.0) * flickerStrength;
    }

    if (vignetteStrength > 0.001) {
      mask *= vignetteApprox(uv, vignetteStrength);
    }

    pixel.rgb *= mask;

    gl_FragColor = pixel;
  }
`;

export function initShader(canvas) {
  let gl = canvas.getContext('webgl', { alpha: false, premultipliedAlpha: false });
  if (!gl) return null;

  function compileShader(src, type) {
    let s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  let program = gl.createProgram();
  gl.attachShader(program, compileShader(vertexShaderSource, gl.VERTEX_SHADER));
  gl.attachShader(program, compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }

  gl.useProgram(program);

  let positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
  let buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  let loc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  let startTime = performance.now();
  let offCanvas = document.createElement('canvas');
  let offCtx = offCanvas.getContext('2d');

  let prevText = null;
  let prevW = 0;
  let prevH = 0;

  function renderText(text, w, h, dpr) {
    let bw = Math.round(w * dpr);
    let bh = Math.round(h * dpr);

    if (offCanvas.width !== bw || offCanvas.height !== bh) {
      offCanvas.width = bw;
      offCanvas.height = bh;
    }

    if (prevText === text && prevW === bw && prevH === bh) return;

    offCtx.fillStyle = '#0c0c0c';
    offCtx.fillRect(0, 0, bw, bh);

    offCtx.fillStyle = '#00ff66';
    offCtx.font = '16px IBMFont';
    offCtx.textBaseline = 'top';
    offCtx.textContent = '';

    let lines = text.split('\n');
    let lineH = 16 * 1.2;
    let pad = 15 * dpr;
    for (let i = 0; i < lines.length; i++) {
      offCtx.fillText(lines[i], pad, pad + i * lineH * dpr);
    }

    prevText = text;
    prevW = bw;
    prevH = bh;
  }

  return {
    gl,
    program,
    resize(w, h, dpr) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    draw(text) {
      let w = canvas.width;
      let h = canvas.height;
      if (w === 0 || h === 0) return;

      let dpr = window.devicePixelRatio || 1;
      renderText(text, canvas.clientWidth, canvas.clientHeight, dpr);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offCanvas);
      gl.uniform1i(gl.getUniformLocation(program, 'u_texture'), 0);
      gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), w, h);
      gl.uniform1f(gl.getUniformLocation(program, 'u_time'), (performance.now() - startTime) / 1000.0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  };
}
