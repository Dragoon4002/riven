export interface GateConfig {
  price: number
  currency: 'USDC'
  payTo: string
  contentId: string
  expiresIn: number
}

export interface GateResult {
  endpoint: string
  contentId: string
  price: number
}

export interface VerifyResult {
  valid: boolean
  contentId: string
  paidBy: string
  paidAt: number
}

export const X402Server = {
  gate: async (config: GateConfig): Promise<GateResult> => {
    console.log('[x402:stub] X402Server.gate', config)
    return {
      endpoint: `/api/sources/${config.contentId}`,
      contentId: config.contentId,
      price: config.price,
    }
  },

  verify: async (token: string): Promise<VerifyResult> => {
    console.log('[x402:stub] X402Server.verify token', token.slice(0, 8))
    return {
      valid: true,
      contentId: 'stub_content',
      paidBy: '0xSTUB_BUYER',
      paidAt: Date.now(),
    }
  },
}
