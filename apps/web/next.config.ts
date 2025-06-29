import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Server Actionsのボディサイズ制限を10MBに設定
    },
  },
}

export default nextConfig
