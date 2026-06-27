import type { WalletBalance, WalletTransaction } from '@riven/types'

export interface CreatedWallet {
  walletId: string
  address: string
  privateKey: string
}

export interface ConnectedWallet {
  address: string
  balance: WalletBalance
}

export const WalletClient = {
  create: async (): Promise<CreatedWallet> => {
    console.log('[arc-client:stub] WalletClient.create')
    return {
      walletId: `wallet_stub_${Date.now()}`,
      address: `0xSTUB_${Math.random().toString(36).slice(2)}`,
      privateKey: 'STUB_PRIVATE_KEY',
    }
  },

  connect: async (walletId: string): Promise<ConnectedWallet> => {
    console.log('[arc-client:stub] WalletClient.connect', walletId)
    return {
      address: `0xSTUB_${walletId}`,
      balance: { available: 100, locked: 0, total: 100 },
    }
  },

  balance: async (walletId: string): Promise<WalletBalance> => {
    console.log('[arc-client:stub] WalletClient.balance', walletId)
    return { available: 100, locked: 0, total: 100 }
  },

  history: async (walletId: string): Promise<WalletTransaction[]> => {
    console.log('[arc-client:stub] WalletClient.history', walletId)
    return []
  },
}
