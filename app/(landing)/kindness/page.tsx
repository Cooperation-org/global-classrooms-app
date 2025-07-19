'use client'
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, TreePine, GraduationCap, Heart, ArrowRight } from 'lucide-react';
// NOTE: If you see a type error for 'three', run: npm install --save-dev @types/three
import * as THREE from 'three';

const KindnessLanding = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [scrollY, setScrollY] = useState(0);
  const globeRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef3D = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number>();
  
  // File upload handler for textures
  const handleTextureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    console.log('Uploaded texture files:', fileArray.map(f => f.name));
    
    // Here you would process the uploaded texture files
    // For now, we'll just log them and set the flag
    // setTexturesUploaded(true); // This line was removed as per the edit hint
    
    // You can create object URLs for the files and use them in the texture loader
    fileArray.forEach(file => {
      const url = URL.createObjectURL(file);
      console.log(`Texture available at: ${url}`);
      // Store these URLs in state or use them directly in the texture loader
    });
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observeElement = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setIsVisible(prev => ({ ...prev, [id]: entry.isIntersecting }));
          },
          { threshold: 0.1 }
        );
        observer.observe(element);
      }
    };

    ['hero', 'mission', 'stats', 'voice'].forEach(observeElement);
  }, []);

  // 3D Globe Setup with Texture Loading
  useEffect(() => {
    if (!globeRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(400, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    globeRef.current.appendChild(renderer.domElement);
    
    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const loadingManager = new THREE.LoadingManager();
    
    // Loading progress tracking
    // let texturesLoaded = false; // This line was removed as per the edit hint
    loadingManager.onLoad = () => {
      // texturesLoaded = true; // This line was removed as per the edit hint
      console.log('All textures loaded successfully!');
    };
    
    loadingManager.onError = (url: string) => {
      console.log('Error loading texture:', url);
      // Fallback to procedural texture
      createProceduralEarth();
    };

    // Create Earth geometry
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    
    // Function to create procedural texture as fallback
    const createProceduralEarth = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      
      // Create a gradient background (ocean)
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, '#1e40af');
      gradient.addColorStop(1, '#3b82f6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 256);
      
      // Add continents
      ctx.fillStyle = '#22c55e';
      // North America
      ctx.beginPath();
      ctx.ellipse(100, 80, 40, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // South America  
      ctx.beginPath();
      ctx.ellipse(120, 150, 25, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Europe/Africa
      ctx.beginPath();
      ctx.ellipse(250, 100, 35, 50, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Asia
      ctx.beginPath();
      ctx.ellipse(350, 80, 50, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Australia
      ctx.beginPath();
      ctx.ellipse(380, 180, 20, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      
      return new THREE.CanvasTexture(canvas);
    };

    // Try to load your custom textures
    // Replace these paths with your actual texture file paths
    const earthDiffuseTexture = textureLoader.load(
      '/textures/earthlandoceanmask.png', // Your earth diffuse map
      undefined,
      undefined,
      () => createProceduralEarth() // Fallback on error
    );
    
    const earthNormalTexture = textureLoader.load(
      '/textures/earthalbedo.jpg', // Your earth normal map
      undefined,
      undefined,
      () => null // Optional normal map
    );
    
    const earthSpecularTexture = textureLoader.load(
      '/textures/earthalbedo.jpg', // Your earth specular map
      undefined,
      undefined,
      () => null // Optional specular map
    );
    
    const cloudsTexture = textureLoader.load(
      '/textures/cloudearth.png', // Your clouds texture
      undefined,
      undefined,
      () => null // Optional clouds
    );
    
    // Configure texture settings for better quality
    [earthDiffuseTexture, earthNormalTexture, earthSpecularTexture, cloudsTexture].forEach(texture => {
      if (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
      }
    });

    // Create materials with loaded textures
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthDiffuseTexture || createProceduralEarth(),
      normalMap: earthNormalTexture,
      specularMap: earthSpecularTexture,
      shininess: 100,
      specular: new THREE.Color(0x1e40af),
      bumpScale: 0.05,
    });
    
    // Alternative: Use PBR material for more realistic rendering
    const earthMaterialPBR = new THREE.MeshStandardMaterial({
      map: earthDiffuseTexture || createProceduralEarth(),
      normalMap: earthNormalTexture,
      roughness: 0.7,
      metalness: 0.1,
      bumpScale: 0.05,
    });
    
    // Create atmosphere glow
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.9, 0.8, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    
    // Create Earth mesh with PBR material for better realism
    const earthMesh = new THREE.Mesh(geometry, earthMaterialPBR);
    earthMesh.castShadow = true;
    earthMesh.receiveShadow = true;
    scene.add(earthMesh);
    
    // Create atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(2.1, 64, 64);
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);
    
    // Add clouds layer with texture
    const cloudGeometry = new THREE.SphereGeometry(2.05, 32, 32);
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    
    // Fallback cloud texture if custom texture fails
    if (!cloudsTexture) {
      const cloudCanvas = document.createElement('canvas');
      cloudCanvas.width = 512;
      cloudCanvas.height = 256;
      const cloudCtx = cloudCanvas.getContext('2d')!;
      
      cloudCtx.fillStyle = 'transparent';
      cloudCtx.fillRect(0, 0, 512, 256);
      cloudCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      
      // Add random cloud patterns
      for (let i = 0; i < 50; i++) {
        cloudCtx.beginPath();
        cloudCtx.ellipse(
          Math.random() * 512,
          Math.random() * 256,
          Math.random() * 30 + 10,
          Math.random() * 15 + 5,
          0, 0, Math.PI * 2
        );
        cloudCtx.fill();
      }
      
      cloudMaterial.map = new THREE.CanvasTexture(cloudCanvas);
    }
    
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(cloudMesh);

    // Optional: Load your .blend file (requires additional setup)
    // You can use the GLTFLoader or FBXLoader for 3D models
    // For .blend files, you'd typically export to .gltf or .fbx first
    /*
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const gltfLoader = new GLTFLoader();
    
    gltfLoader.load('/models/earth.gltf', (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(2);
      scene.add(model);
      // You can replace the sphere with your custom model
    });
    */
    scene.add(cloudMesh);
    
    // Add orbiting satellites/particles
    const satellites: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const satGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const satMaterial = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        emissive: 0x10b981,
        emissiveIntensity: 0.5,
      });
      const satellite = new THREE.Mesh(satGeometry, satMaterial);
      
      const angle = (i / 8) * Math.PI * 2;
      const radius = 3 + Math.random() * 1;
      satellite.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * radius
      );
      
      satellites.push(satellite);
      scene.add(satellite);
    }
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x10b981, 0.5, 100);
    pointLight.position.set(-5, 0, 5);
    scene.add(pointLight);
    
    camera.position.z = 6;
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!globeRef.current) return;
      const rect = globeRef.current.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    
    globeRef.current.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      if (!earthMesh || !cloudMesh) return;
      
      // Rotate Earth
      earthMesh.rotation.y += 0.005;
      cloudMesh.rotation.y += 0.003;
      
      // Mouse interaction
      earthMesh.rotation.x = mouseY * 0.1;
      earthMesh.rotation.y += mouseX * 0.01;
      
      // Animate satellites
      satellites.forEach((satellite, i) => {
        const time = Date.now() * 0.001;
        const radius = 3 + Math.sin(time + i) * 0.5;
        const angle = time * 0.5 + (i / satellites.length) * Math.PI * 2;
        
        satellite.position.set(
          Math.cos(angle) * radius,
          Math.sin(time + i * 0.5) * 2,
          Math.sin(angle) * radius
        );
      });
      
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    globeRef3D.current = earthMesh;
    
    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (globeRef.current && renderer.domElement) {
        globeRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      earthMaterial.dispose();
      atmosphereMaterial.dispose();
    };
  }, []);

  const FloatingElement: React.FC<{ children: React.ReactNode; delay?: number; amplitude?: number }> = ({ children, delay = 0, amplitude = 20 }) => {
    const [offset, setOffset] = useState(0);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setOffset(prev => prev + 0.02);
      }, 16);
      return () => clearInterval(interval);
    }, []);

    return (
      <div 
        style={{
          transform: `translateY(${Math.sin(offset + delay) * amplitude}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {children}
      </div>
    );
  };

  const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{count}{suffix}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      {/* Navigation with Upload Option */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-emerald-500 flex items-center">
              <span className="text-emerald-500">▲▲</span>
              <span className="text-gray-800 ml-2">Kindness</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Texture Upload Button */}
            <label className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-300 cursor-pointer">
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.blend,.gltf,.fbx"
                onChange={handleTextureUpload}
                className="hidden"
              />
              Upload Textures
            </label>
            <button className="bg-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              SEND REQUEST
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Globe */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <FloatingElement delay={0} amplitude={30}>
              <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-200/30 to-teal-200/30 blur-3xl"></div>
            </FloatingElement>
            <FloatingElement delay={2} amplitude={25}>
              <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-200/20 to-emerald-200/20 blur-3xl"></div>
            </FloatingElement>
            <FloatingElement delay={4} amplitude={20}>
              <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-yellow-200/20 to-orange-200/20 blur-3xl"></div>
            </FloatingElement>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <FloatingElement key={i} delay={i * 0.3} amplitude={10 + (i % 5) * 3}>
              <div
                className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)'
                }}
              />
            </FloatingElement>
          ))}
        </div>

        {/* Left vertical mission text */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 z-10">
          <div className="transform -rotate-90 origin-left whitespace-nowrap">
            <span className="text-sm text-gray-400 tracking-widest font-medium">
              Together For A Better Tomorrow • Fostering Social Change • Inspiring Hope &amp; Resilience
            </span>
          </div>
        </div>

        {/* Right vertical stats */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8 z-10 flex flex-col items-end space-y-12">
          <div className="transform rotate-90 origin-right flex flex-col items-center">
            <span className="text-3xl font-bold text-emerald-500">15k+</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">World Wide Clients</span>
          </div>
          <div className="transform rotate-90 origin-right flex flex-col items-center">
            <span className="text-3xl font-bold text-emerald-500">25+</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Trusted Companies</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full relative z-20">
          {/* Left Content */}
          <div 
            className={`relative transform transition-all duration-1000 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          >
            <div className="relative">
              <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="text-gray-900">Empowering</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 animate-pulse">
                  MSMEs
                </span>
                <br />
                <span className="text-gray-900">to Succeed</span>
              </h1>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-emerald-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
            </div>
            
            <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              Access expert resources, connect with mentors, and join a thriving community focused on helping small and medium-sized businesses thrive in the digital age.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                Join the Community
              </button>
              <button className="bg-white border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Explore Resources
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="ml-3">1000+ Happy Clients</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400">★★★★★</span>
                <span className="ml-1">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Right Content - 3D Globe */}
          <div 
            className="flex justify-center items-center relative"
            style={{
              transform: `translateY(${scrollY * -0.1}px)`,
            }}
          >
            <div className="relative">
              {/* 3D Globe Container */}
              <div 
                ref={globeRef}
                className="w-[400px] h-[400px] relative z-10"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(16, 185, 129, 0.3))' }}
              />
              
              {/* Glow effect behind globe */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-20 blur-3xl scale-110 animate-pulse"></div>
              
              {/* Connection rings */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 border border-emerald-300 rounded-full opacity-30"
                    style={{
                      width: `${(i + 1) * 120}px`,
                      height: `${(i + 1) * 120}px`,
                      transform: 'translate(-50%, -50%)',
                      animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-8 flex flex-col items-center z-20">
          <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 mb-4">
            <ChevronDown className="w-6 h-6 text-white animate-bounce" />
          </div>
          <div className="flex space-x-3 mt-2">
            {['f', 't', '@', 'in'].map((social, i) => (
              <a 
                key={i}
                href="#" 
                className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-110"
              >
                <span className="text-sm font-bold">{social}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <FloatingElement amplitude={20}>
                <div className="w-full h-96 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-emerald-600/20 to-transparent flex items-center justify-center">
                    <div className="text-white text-center">
                      <TreePine className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Hope In Action</h3>
                      <p className="text-emerald-100">Making a difference together</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className={`transform transition-all duration-1000 delay-300 ${isVisible.mission ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                One World, One Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                &quot;One World, One Mission&quot; Encapsulates Our Commitment To A United, Sustainable Future. At Our NGO, We Believe That Everyone Deserves The Chance To Live A Healthy, Safe, And Supportive World. Our Mission Transcends Borders, Cultures, Bringing Together Individuals From All Walks Of Life To Tackle Global Challenges Like Poverty, Healthcare, And Environmental Sustainability Through Collaborative Efforts.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We Aim To Create A World Where Equality, Compassion, And Opportunity Are Accessible To All. Together, We&apos;re Building A Brighter Future, One Mission At A Time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <FloatingElement delay={0} amplitude={15}>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-center text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold mb-2">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <p className="text-yellow-100 font-semibold">Volunteers Worldwide</p>
              </div>
            </FloatingElement>

            <FloatingElement delay={0.5} amplitude={20}>
              <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-3xl p-8 text-center text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold mb-2">
                  <AnimatedCounter end={200} suffix="+" />
                </div>
                <p className="text-red-100 font-semibold">Community Projects</p>
              </div>
            </FloatingElement>

            <FloatingElement delay={1} amplitude={18}>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-center text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold mb-2">
                  <AnimatedCounter end={100} suffix="K+" />
                </div>
                <p className="text-emerald-100 font-semibold">Trees Planted</p>
                <TreePine className="w-8 h-8 mx-auto mt-2" />
              </div>
            </FloatingElement>

            <FloatingElement delay={1.5} amplitude={22}>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-center text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold mb-2">
                  <AnimatedCounter end={300} suffix="+" />
                </div>
                <p className="text-blue-100 font-semibold">Educational Programs</p>
                <GraduationCap className="w-8 h-8 mx-auto mt-2" />
              </div>
            </FloatingElement>
          </div>
        </div>
      </section>

      {/* Voice Section */}
      <section id="voice" className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <FloatingElement delay={0} amplitude={40}>
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          </FloatingElement>
          <FloatingElement delay={1} amplitude={35}>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          </FloatingElement>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <FloatingElement amplitude={25}>
                <div className="w-80 h-96 bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                  <div className="bg-white rounded-2xl p-4 mb-4">
                    <div className="text-gray-800 text-sm font-semibold mb-2">One World, One Mission</div>
                    <div className="text-gray-600 text-xs leading-relaxed">
                      Encapsulates Our Commitment To A United, Sustainable Future. At Our NGO, We Believe That Everyone Deserves The Chance To Live In A Healthy, Safe, And Supportive World...
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-emerald-100 font-semibold">Hope In Action</div>
                  </div>
                </div>
              </FloatingElement>
            </div>
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible.voice ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <h2 className="text-5xl font-bold mb-6">
                Your Voice Matters
                <br />
                In <span className="text-yellow-300">Our Mission</span>.
              </h2>
              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                Your Voice Matters In Our Mission To Protect And Preserve Nature. Together, We Can Make A Lasting Impact, Creating A Healthier, Greener World For Future Generations.
              </p>
              <button className="bg-yellow-400 text-gray-800 px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 flex items-center group">
                Join Our Mission
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="text-2xl font-bold text-emerald-500">
                <span className="text-emerald-500">▲▲</span>
                <span className="text-white ml-2">Kindness</span>
              </div>
            </div>
            <div className="flex space-x-8 text-sm">
              <span>©2021-2024. All rights reserved</span>
              <a href="#" className="hover:text-emerald-400 transition-colors">Cookies</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy & Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KindnessLanding;
