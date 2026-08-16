import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { PHYSICS_TECH_CHIPS } from '../data/portfolioData';
import { RefreshCw, Sparkles, HandMetal } from 'lucide-react';

interface PhysicsTechStackProps {
  isDark?: boolean;
}

export const PhysicsTechStack: React.FC<PhysicsTechStackProps> = ({ isDark = true }) => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [interactiveCount, setInteractiveCount] = useState(0);

  const initPhysics = () => {
    if (!sceneRef.current) return;

    // Clean up any existing instances
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current);
      if (renderRef.current.canvas) {
        renderRef.current.canvas.remove();
      }
    }
    if (runnerRef.current) {
      Matter.Runner.stop(runnerRef.current);
    }
    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
    }

    const container = sceneRef.current;
    const width = container.clientWidth || 800;
    const height = Math.max(380, container.clientHeight || 420);

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    // Create engine with standard gravity
    const engine = Engine.create({
      gravity: { x: 0, y: 0.9, scale: 0.001 },
    });
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio || 1,
      },
    });
    renderRef.current = render;

    // Boundaries (Ground, Walls, Roof)
    const wallThickness = 60;
    const ground = Bodies.rectangle(width / 2, height + wallThickness / 2 - 4, width * 2, wallThickness, {
      isStatic: true,
      render: { fillStyle: 'transparent' },
    });
    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
      isStatic: true,
      render: { fillStyle: 'transparent' },
    });
    const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, {
      isStatic: true,
      render: { fillStyle: 'transparent' },
    });
    const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2 - 80, width * 2, wallThickness, {
      isStatic: true,
      render: { fillStyle: 'transparent' },
    });

    Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    // Create tech chip bodies
    const bodies = PHYSICS_TECH_CHIPS.map((chip, index) => {
      const chipWidth = Math.max(100, chip.text.length * 10 + 36);
      const chipHeight = 38;
      const startX = (width / (PHYSICS_TECH_CHIPS.length + 1)) * (index + 0.5) + (Math.random() * 40 - 20);
      const startY = -40 - index * 24;

      const body = Bodies.rectangle(startX, startY, chipWidth, chipHeight, {
        chamfer: { radius: 19 },
        restitution: 0.65,
        friction: 0.15,
        frictionAir: 0.02,
        density: 0.002,
        render: {
          fillStyle: isDark ? '#18181b' : '#ffffff',
          strokeStyle: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
          lineWidth: 1.5,
        },
      });

      // Attach custom metadata for custom render loop
      (body as any).chipData = chip;
      (body as any).chipWidth = chipWidth;
      (body as any).chipHeight = chipHeight;

      return body;
    });

    Composite.add(engine.world, bodies);

    // Mouse interaction constraint
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Custom drawing for sleek chips with text and colored accent badges
    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      const allBodies = Composite.allBodies(engine.world);

      allBodies.forEach((body) => {
        const chipData = (body as any).chipData;
        if (!chipData) return;

        const { x, y } = body.position;
        const angle = body.angle;
        const w = (body as any).chipWidth || 100;
        const h = (body as any).chipHeight || 38;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Chip body background & border
        ctx.beginPath();
        const r = h / 2;
        ctx.moveTo(-w / 2 + r, -h / 2);
        ctx.lineTo(w / 2 - r, -h / 2);
        ctx.arc(w / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(-w / 2 + r, h / 2);
        ctx.arc(-w / 2 + r, 0, r, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();

        ctx.fillStyle = isDark ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Accent indicator dot
        ctx.beginPath();
        ctx.arc(-w / 2 + 16, 0, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = chipData.color || '#3b82f6';
        ctx.fill();

        // Label text
        ctx.font = '600 12.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillStyle = isDark ? '#f4f4f5' : '#18181b';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(chipData.text, -w / 2 + 27, 0);

        ctx.restore();
      });
    });

    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
  };

  useEffect(() => {
    initPhysics();

    const handleResize = () => {
      initPhysics();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
      }
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
    };
  }, [isDark, interactiveCount]);

  const handleExplode = () => {
    if (!engineRef.current) return;
    const allBodies = Matter.Composite.allBodies(engineRef.current.world);
    allBodies.forEach((body) => {
      if (!body.isStatic) {
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.08,
          y: -0.06 - Math.random() * 0.06,
        });
      }
    });
  };

  const handleReset = () => {
    setInteractiveCount((c) => c + 1);
  };

  return (
    <div
      id="physics-tech-stack-wrapper"
      className={`relative w-full rounded-3xl overflow-hidden p-6 transition-all duration-300 ${
        isDark ? 'bg-zinc-900/40 border border-zinc-800/60' : 'bg-zinc-100/70 border border-zinc-200/80'
      } backdrop-blur-md`}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 z-20 relative">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className={`text-lg font-bold font-display tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Interactive Physics Tech Stack
            </h3>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Built with Matter.js physics engine. Drag, grab, and toss the skill chips around!
          </p>
        </div>

        {/* Physics Controls */}
        <div className="flex items-center gap-2">
          <button
            id="shake-physics-button"
            onClick={handleExplode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                : 'bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 shadow-sm'
            }`}
          >
            <HandMetal className="w-3.5 h-3.5 text-amber-400" />
            <span>Fling Stack</span>
          </button>

          <button
            id="reset-physics-button"
            onClick={handleReset}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                : 'bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 shadow-sm'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Respawn</span>
          </button>
        </div>
      </div>

      {/* Physics Canvas Target Area */}
      <div
        id="physics-canvas-stage"
        ref={sceneRef}
        className="relative w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden touch-none"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.04) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
