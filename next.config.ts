import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tắt ESLint trong quá trình build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Tắt TypeScript errors trong build nếu cần
  typescript: {
    ignoreBuildErrors: false, // Giữ true nếu muốn bỏ qua TypeScript errors
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  
  // Cấu hình static file serving
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/public/:path*',
      },
    ];
  },
  
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Faster builds in development
    swcMinify: false,
    // Faster recompilation
    experimental: {
      optimizePackageImports: [
        '@mui/material', 
        '@mui/icons-material', 
        'lucide-react',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-select'
      ],
      // Enable faster refresh
      esmExternals: 'loose',
      // Faster builds
      forceSwcTransforms: false,
    },
    // Disable source maps in dev for faster builds
    productionBrowserSourceMaps: false,
    // Faster CSS processing
    optimizeCss: false,
  }),
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      '@mui/material', 
      '@mui/icons-material', 
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select'
    ],
  },
  
  // Transpile packages that need it
  transpilePackages: ['@tanstack/react-table', '@tanstack/table-core'],
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Bundle analyzer and optimizations
  webpack: (config, { dev, isServer }) => {
    // Xử lý các module Node.js không tương thích với client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        child_process: false,
        util: false,
        buffer: false,
        events: false,
        querystring: false,
        punycode: false,
        string_decoder: false,
        constants: false,
        domain: false,
        dns: false,
        dgram: false,
        cluster: false,
        module: false,
        vm: false,
        inspector: false,
        async_hooks: false,
        'fs/promises': false,
        'node:fs': false,
        'node:path': false,
        'node:os': false,
        'node:crypto': false,
        'node:stream': false,
        'node:util': false,
        'node:buffer': false,
        'node:events': false,
        'node:querystring': false,
        'node:punycode': false,
        'node:string_decoder': false,
        'node:constants': false,
        'node:domain': false,
        'node:dns': false,
        'node:dgram': false,
        'node:cluster': false,
        'node:module': false,
        'node:vm': false,
        'node:inspector': false,
        'node:async_hooks': false,
        'node:child_process': false,
        'node:fs/promises': false,
      };
    }

    // Development optimizations
    if (dev) {
      // Faster development builds
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Separate vendor chunks for faster rebuilds
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // UI library chunks
          ui: {
            test: /[\\/]node_modules[\\/](@mui|@radix-ui|@headlessui)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 20,
          },
          // Table/Data components
          tables: {
            test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
            name: 'table-libs',
            chunks: 'all',
            priority: 15,
          },
        },
      };
      
      // Enable filesystem cache with better performance
      config.cache = {
        type: 'filesystem',
        cacheDirectory: '.next/cache/webpack',
        buildDependencies: {
          config: [__filename],
        },
      };
      
      // Faster rebuilds
      config.optimization.moduleIds = 'named';
      config.optimization.chunkIds = 'named';
    }
    
    // Enable tree shaking
    config.optimization.usedExports = true;
    
    // Production optimization
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    return config;
  },
  
  // Output configuration
  output: 'standalone',
  
  // Performance settings
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 10,
  },
};

export default nextConfig;
