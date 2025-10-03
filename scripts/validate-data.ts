#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
	ArchivedWebFileSchema,
	DarknetFileSchema,
	DevicesFileSchema,
	IndexedInternetFileSchema,
	MixedFileSchema,
	SearchEnginesFileSchema,
	SocialNetworksFileSchema,
	DomainsIpsFileSchema,
} from '../types/schema'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dataDir = join(__dirname, '..', 'public', 'data')

function validateData(): void {
	try {
		console.log('🔍 Validating public/data/*.json...\n')

		const files = {
			indexed_internet: {
				path: join(dataDir, 'indexed_internet.json'),
				schema: IndexedInternetFileSchema,
			},
			archived_web: {
				path: join(dataDir, 'archived_web.json'),
				schema: ArchivedWebFileSchema,
			},
			network_devices: {
				path: join(dataDir, 'network_devices.json'),
				schema: DevicesFileSchema,
			},
			darknet: {
				path: join(dataDir, 'darknet.json'),
				schema: DarknetFileSchema,
			},
			social_networks: {
				path: join(dataDir, 'social_networks.json'),
				schema: SocialNetworksFileSchema,
			},
			search_engines: {
				path: join(dataDir, 'search_engines.json'),
				schema: SearchEnginesFileSchema,
			},
			domains_ips: {
				path: join(dataDir, 'domains_ips.json'),
				schema: DomainsIpsFileSchema,
			},
			mixed: { path: join(dataDir, 'mixed.json'), schema: MixedFileSchema },
		} as const

		type SectionKey = keyof typeof files

		let totalRecords = 0
		const allTools: string[] = []
		const errors: string[] = []

		for (const section of Object.keys(files) as SectionKey[]) {
			const { path, schema } = files[section]

			let json: unknown
			try {
				const content = readFileSync(path, 'utf-8')
				json = JSON.parse(content)
			} catch (e: unknown) {
				const message =
					e instanceof SyntaxError
						? `Invalid JSON syntax in ${section}.json`
						: e instanceof Error &&
								'code' in e &&
								(e as { code?: string }).code === 'ENOENT'
							? `File not found: ${path}`
							: `Unexpected error reading ${section}.json: ${e instanceof Error ? e.message : String(e)}`
				errors.push(`❌ ${section}.json - ${message}`)
				continue
			}

			const result = schema.safeParse(json)
			if (!result.success) {
				const issueLines = result.error.issues
					.map((error, index) => {
						const p = error.path.join('.')
						return `   ${index + 1}. ${p}: ${error.message}`
					})
					.join('\n')
				errors.push(
					`❌ ${section}.json validation failed!\nIssues found:\n${issueLines}\nTotal issues: ${result.error.issues.length}`,
				)
				continue
			}

			console.log(`✅ ${section}.json: schema validation successful!`)

			const recordCount = result.data.data.length
			totalRecords += recordCount
			console.log(`📊 ${section}: ${recordCount} records`)

			const availableCategories = Object.keys(result.data.meta.categories)
			if (availableCategories.length > 0) {
				console.log(
					`📋 ${section} available categories: ${availableCategories.join(', ')}`,
				)
			}

			const usedCategories = new Set<string>()
			for (const record of result.data.data) {
				if (record.categories) {
					for (const category of record.categories) {
						usedCategories.add(category)
					}
				}
				if (record.name) {
					allTools.push(String(record.name).toLowerCase().trim())
				}
			}

			const undefinedCategories = Array.from(usedCategories).filter(
				(category) => !availableCategories.includes(category),
			)
			if (undefinedCategories.length > 0) {
				const undefinedList = undefinedCategories
					.map((category) => `   - ${category}`)
					.join('\n')
				errors.push(
					`❌ Error: Found categories used in ${section} records that are not defined in meta:\n${undefinedList}`,
				)
			}
		}

		console.log(`\n📊 Total records across all sections: ${totalRecords}`)

		const duplicates = allTools.filter(
			(tool: string, index: number) => allTools.indexOf(tool) !== index,
		)
		if (duplicates.length > 0) {
			console.warn(
				'\n⚠️  Warning: Potential duplicate tools found across all sections:',
			)
			for (const duplicate of [...new Set(duplicates)]) {
				console.warn(`   - ${duplicate}`)
			}
		}

		if (errors.length > 0) {
			console.error('\n❌ Validation failed. Issues found:')
			for (const err of errors) {
				console.error(`\n${err}`)
			}
			console.error(`\nTotal error groups: ${errors.length}`)
			process.exit(1)
		}

		console.log('\n🎉 All validations passed!')
		process.exit(0)
	} catch (error: unknown) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
			console.error('❌ Error: one of the section files not found!')
			console.error(`Expected directory: ${dataDir}`)
		} else if (error instanceof SyntaxError) {
			console.error('❌ Error: Invalid JSON syntax in data.json')
			console.error(error.message)
		} else {
			console.error(
				'❌ Unexpected error:',
				error instanceof Error ? error.message : String(error),
			)
		}
		process.exit(1)
	}
}

// Run validation when script is executed directly
validateData()

export { validateData }
