export interface ProbeResult {
  gated: boolean
  price: number
  payTo: string
  requestId: string
  contentId: string
}

export interface AccessToken {
  token: string
  expiresAt: number
}

export const X402Client = {
  probe: async (url: string): Promise<ProbeResult> => {
    console.log('[x402:stub] X402Client.probe', url)
    return {
      gated: true,
      price: 0.02,
      payTo: '0xSTUB_SELLER',
      requestId: `req_${Date.now()}`,
      contentId: `content_stub_${url.split('/').pop()}`,
    }
  },

  getToken: async (requestId: string, txHash: string): Promise<AccessToken> => {
    console.log('[x402:stub] X402Client.getToken', { requestId, txHash })
    return {
      token: `tok_stub_${requestId}`,
      expiresAt: Date.now() + 3_600_000,
    }
  },

  fetch: async (url: string, token: string): Promise<string> => {
    console.log('[x402:stub] X402Client.fetch', url, token.slice(0, 8))
    return `[STUB CONTENT from ${url}]\n\nThis is placeholder content that will be replaced when x402 SDK is wired in.`
  },
}
