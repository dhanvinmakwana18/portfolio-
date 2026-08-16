import React, { useEffect, useRef } from 'react';

interface WebGLFlowShaderProps {
  isDark?: boolean;
  intensity?: number;
  interactive?: boolean;
  className?: string;
}

export const WebGLFlowShader: React.FC<WebGLFlowShaderProps> = ({
  isDark = true,
  interactive = true,
  className = "fixed inset-0 pointer-events-none z-0"
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' });

    // Fallback to Canvas 2D if WebGL is unavailable
    if (!gl) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      let time = 0;
      const render2D = () => {
        time += 0.01;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = isDark ? 'rgba(9, 9, 11, 0.95)' : 'rgba(250, 250, 250, 0.95)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        animationFrameId = requestAnimationFrame(render2D);
      };
      render2D();
      return () => cancelAnimationFrame(animationFrameId);
    }

    // Vertex shader
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader: Fluid organic flow shader with simplex noise & mouse reaction
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_isDark;
      varying vec2 v_uv;

      // Simplex-like noise helper
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                           -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
              + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.y = 1.0 - st.y;
        
        // Mouse influence
        vec2 mouseDist = st - u_mouse;
        float dist = length(mouseDist);
        float mouseEffect = smoothstep(0.4, 0.0, dist) * 0.25;

        // Flow field layers
        float t = u_time * 0.08;
        vec2 q = vec2(0.0);
        q.x = snoise(st * 2.2 + vec2(t * 0.5, t * 0.3));
        q.y = snoise(st * 2.2 + vec2(t * 0.4, -t * 0.2));

        vec2 r = vec2(0.0);
        r.x = snoise(st * 3.0 + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t + mouseDist * mouseEffect);
        r.y = snoise(st * 3.0 + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

        float f = snoise(st * 2.5 + r * 1.5 + mouseEffect);
        f = (f + 1.0) * 0.5; // range 0..1

        // Color palettes
        vec3 bgDark = vec3(0.035, 0.035, 0.043); // Deep zinc/black
        vec3 midDark = vec3(0.08, 0.08, 0.11);
        vec3 glowDark = vec3(0.18, 0.18, 0.24);
        vec3 accentDark = vec3(0.22, 0.28, 0.38); // Subtle cyber/indigo AI accent

        vec3 bgLight = vec3(0.98, 0.98, 0.99); // Off-white
        vec3 midLight = vec3(0.92, 0.93, 0.95);
        vec3 glowLight = vec3(0.85, 0.88, 0.92);
        vec3 accentLight = vec3(0.78, 0.82, 0.88);

        vec3 col;
        if (u_isDark > 0.5) {
          col = mix(bgDark, midDark, smoothstep(0.1, 0.6, f));
          col = mix(col, glowDark, smoothstep(0.4, 0.85, f));
          col += accentDark * pow(f, 3.5) * 0.45;
          col += mouseEffect * 0.12;
        } else {
          col = mix(bgLight, midLight, smoothstep(0.1, 0.6, f));
          col = mix(col, glowLight, smoothstep(0.4, 0.85, f));
          col = mix(col, accentLight, pow(f, 3.0) * 0.35);
          col -= mouseEffect * 0.08;
        }

        // Add subtle scanline/grain texture
        float grain = fract(sin(dot(st.xy + fract(u_time), vec2(12.9898, 78.233))) * 43758.5453) * 0.02;
        col += (u_isDark > 0.5 ? grain : -grain);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const createShader = (glCtx: WebGLRenderingContext, type: number, source: string) => {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.warn('Shader compile error:', glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const isDarkLocation = gl.getUniformLocation(program, 'u_isDark');

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = e.clientY / window.innerHeight;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    let startTime = performance.now();

    const render = () => {
      const currentTime = (performance.now() - startTime) / 1000;
      
      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(timeLocation, currentTime);
      gl.uniform1f(isDarkLocation, isDark ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, interactive]);

  return (
    <canvas
      id="webgl-flow-shader-canvas"
      ref={canvasRef}
      className={className}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
