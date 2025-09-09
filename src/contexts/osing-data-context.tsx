import React, { createContext, useContext, type ReactNode } from 'react'
import { useOsintData, type UseOsintDataReturn } from '../hooks/useOsintData'

// Create context with the same interface as the hook
const OsintDataContext = createContext<UseOsintDataReturn | null>(null)

// Provider component that loads data once at the app level
export function OsintDataProvider({ children }: { children: ReactNode }) {
	const dataState = useOsintData()

	return (
		<OsintDataContext.Provider value={dataState}>
			{children}
		</OsintDataContext.Provider>
	)
}

// Hook to use the context in components
export function useOsintDataContext() {
	const context = useContext(OsintDataContext)
	if (!context) {
		throw new Error('useOsintDataContext must be used within OsintDataProvider')
	}
	return context
}
