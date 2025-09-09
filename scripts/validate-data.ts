#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { DataJSONSchema } from '../types/schema'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dataPath = join(__dirname, '..', 'public', 'data', 'data.json')

function validateData(): void {
	try {
		console.log('🔍 Validating data.json...\n')

		// Read the data file
		const dataContent = readFileSync(dataPath, 'utf-8')
		const data = JSON.parse(dataContent)

		// First, validate basic structure
		const basicResult = DataJSONSchema.safeParse(data)
		if (!basicResult.success) {
			console.error('❌ Basic structure validation failed!\n')
			console.error('Issues found:')
			basicResult.error.issues.forEach((error, index) => {
				const path = error.path.join('.')
				console.error(`${index + 1}. ${path}: ${error.message}`)
			})
			console.error(`\nTotal issues: ${basicResult.error.issues.length}`)
			process.exit(1)
		}

		// Validation successful
		console.log('✅ Schema validation successful!')

		// Count records across all sections
		const sections = [
			'indexed_internet',
			'archived_web',
			'devices',
			'dark_web',
			'social_networks',
			'search_engines',
			'mixed',
		]
		let totalRecords = 0

		for (const section of sections) {
			const sectionData = data[section]
			if (sectionData?.data) {
				const recordCount = sectionData.data.length
				totalRecords += recordCount
				console.log(`📊 ${section}: ${recordCount} records`)
			}
		}

		console.log(`📊 Total records across all sections: ${totalRecords}`)

		// Validate categories for each section
		for (const section of sections) {
			const sectionData = data[section]
			if (sectionData?.data) {
				const availableCategories = Object.keys(sectionData.meta.categories)

				if (availableCategories.length > 0) {
					console.log(
						`📋 ${section} available categories: ${availableCategories.join(', ')}`,
					)
				}

				// Check for undefined categories in records
				const usedCategories = new Set<string>()
				for (const record of sectionData.data) {
					if (record.categories) {
						for (const category of record.categories) {
							usedCategories.add(category)
						}
					}
				}

				const undefinedCategories = Array.from(usedCategories).filter(
					(category) => !availableCategories.includes(category),
				)

				if (undefinedCategories.length > 0) {
					console.error(
						`\n❌ Error: Found categories used in ${section} records that are not defined in meta:`,
					)
					for (const category of undefinedCategories) {
						console.error(`   - ${category}`)
					}
					process.exit(1)
				}

				// Check for unused categories
				const unusedCategories = availableCategories.filter(
					(category) => !usedCategories.has(category),
				)

				if (unusedCategories.length > 0 && sectionData.data.length > 0) {
					console.warn(
						`\n⚠️  Warning: Found categories defined in ${section} meta but not used in any records:`,
					)
					for (const category of unusedCategories) {
						console.warn(`   - ${category}`)
					}
				}
			}
		}

		// Additional validation: check for duplicates by tool name across all sections
		const allTools: string[] = []
		for (const section of sections) {
			const sectionData = data[section]
			if (sectionData?.data) {
				const sectionTools = sectionData.data
					.map((record: { tool: string }) => record.tool?.toLowerCase().trim())
					.filter(Boolean)
				allTools.push(...sectionTools)
			}
		}

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

		console.log('\n🎉 All validations passed!')
		process.exit(0)
	} catch (error: unknown) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
			console.error('❌ Error: data.json file not found!')
			console.error(`Expected at: ${dataPath}`)
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
