"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

function DitherBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const vsSource = `
      attribute vec2 position;
      void main() { gl_Position = vec4(position, 0.0, 1.0); }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec2 p = uv * 3.0;

        float t = u_time * 0.15;
        float n1 = noise(p + t);
        float n2 = noise(p * 2.0 - t * 0.7);
        float n3 = noise(p * 0.5 + t * 0.3);

        float wave = sin(p.x * 2.0 + t + n1 * 1.5) * 0.5 + 0.5;
        wave *= sin(p.y * 1.5 - t * 0.8 + n2 * 1.2) * 0.5 + 0.5;
        wave += n3 * 0.15;

        // Mouse interaction - subtle drift
        vec2 mouseOffset = (u_mouse / u_resolution - 0.5) * 0.3;
        wave += noise(p + mouseOffset * 5.0) * 0.08;

        // Dither pattern
        float dither = hash(gl_FragCoord.xy + fract(u_time * 0.1)) * 0.08 - 0.04;
        wave += dither;

        // Green on black palette
        vec3 color1 = vec3(0.02, 0.02, 0.02); // near black
        vec3 color2 = vec3(0.05, 0.15, 0.10); // dark green
        vec3 color3 = vec3(0.10, 0.35, 0.25); // mid green #34D399-ish
        vec3 color4 = vec3(0.15, 0.55, 0.35); // brighter green

        vec3 col = mix(color1, color2, smoothstep(0.0, 0.25, wave));
        col = mix(col, color3, smoothstep(0.25, 0.55, wave));
        col = mix(col, color4, smoothstep(0.55, 0.85, wave));

        // Sparse spacing - threshold some areas to pure black
        float threshold = noise(p * 1.5 + t * 0.2);
        if (threshold > 0.72 && wave < 0.4) {
          col = color1;
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = window.innerHeight - e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    let raf = 0;
    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouseX * Math.min(window.devicePixelRatio, 2), mouseY * Math.min(window.devicePixelRatio, 2));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-20 bg-[#050505]">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-80"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
        }}
      />
    </div>
  );
}

export function HeroV4() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/v4/investigate?subject=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-8 sm:px-12 sm:pt-28">
      <DitherBackground />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1
            className="text-[clamp(2.5rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-white"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Investigate why startups{" "}
            <span className="inline-block text-[#34D399]">fail</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#D4D4D4]">
            Real-time parallel research, cross-agent debate, and forensic
            verdicts through a single investigation.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <Link
            href="/v4/investigate"
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-[#050505] transition-all hover:bg-[#34D399] hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]"
          >
            <span>Launch Investigation</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <circle cx="12" cy="12" r="11.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M14.85 11.42L12.05 8.62L12.79 7.89L16.9 12L12.79 16.11L12.05 15.37L14.85 12.58H7.1V11.42Z"
                fill="currentColor"
              />
            </svg>
          </Link>

          <Link
            href="#method"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#D4D4D4] transition-colors hover:text-white"
          >
            <span>See how it works</span>
            <svg width="14" height="13" viewBox="0 0 14 13" fill="none" className="transition-transform group-hover:translate-x-0.5">
              <path d="M11.18 5.78L7.36 1.96L8.37.98L13.97 6.58L8.37 12.18L7.36 11.17L11.17 7.37H.63V5.79H11.18Z" fill="currentColor" />
            </svg>
          </Link>
        </motion.div>

        {/* Glass Search Box with gradient border shell */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-12 max-w-2xl"
        >
          {/* Gradient border shell */}
          <div
            className="rounded-xl p-[1px]"
            style={{
              background: "linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))",
            }}
          >
            <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] shadow-[0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What startup do you want to investigate?"
                className="w-full bg-transparent px-6 pt-5 pb-2 text-lg text-white outline-none placeholder:text-[#737373]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              />

              <div className="flex items-center justify-between px-4 pb-3 pt-1">
                <div className="flex items-center gap-1">
                  {["postmortem", "premortem", "founder mode"].map((m) => (
                    <span
                      key={m}
                      className="rounded-md px-3 py-1 text-[11px] font-medium capitalize text-[#737373]"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleSearch}
                  aria-label="Submit"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#34D399] text-[#050505] shadow-sm transition-transform hover:scale-105"
                >
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                    <path d="M5.33 3.32L1.52 7.13L.53 6.13L6.13.53l5.6 5.6-1.01 1.01L6.92 3.32v10.55H5.33V3.32Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient card area */}
      <div className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-xl">
        <div className="relative h-56 w-full sm:h-72">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1F14] via-[#051A10] to-[#020A06]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1F14] to-[#020A06] opacity-60" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#050505] to-transparent" />
        </div>
      </div>
    </section>
  );
}
