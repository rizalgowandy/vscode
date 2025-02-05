/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { PromptFilesConfig } from '../../../common/promptSyntax/config.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';

/**
 * Mocked mocked instance of {@link IConfigurationService}.
 */
const createMock = <T>(value: T): IConfigurationService => {
	const service = new Proxy(
		{},
		{
			get: (_target, key) => {
				assert.strictEqual(
					key,
					'getValue',
					`Mocked configuration service supports only one method: 'getValue()'.`,
				);

				return (key: string) => {
					assert.strictEqual(
						key,
						PromptFilesConfig.CONFIG_KEY,
						`Mocked service supports only one configuration key: '${PromptFilesConfig.CONFIG_KEY}'.`,
					);

					return value;
				};
			},
		});

	// note! it's ok to `as IConfigurationService` here, because of the runtime checks in the Proxy getter
	return service as Pick<IConfigurationService, 'getValue'> as IConfigurationService;
};

suite('PromptFilesConfig', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('getValue', () => {
		test('undefined', () => {
			const configService = createMock(undefined);

			assert.strictEqual(
				PromptFilesConfig.getValue(configService),
				undefined,
				'Must read correct value.',
			);
		});

		test('null', () => {
			const configService = createMock(null);

			assert.strictEqual(
				PromptFilesConfig.getValue(configService),
				undefined,
				'Must read correct value.',
			);
		});

		suite('string', () => {
			test('empty', () => {
				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('')),
					undefined,
					'Must read correct value.',
				);

				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('  ')),
					undefined,
					'Must read correct value.',
				);

				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('\t')),
					undefined,
					'Must read correct value.',
				);

				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('\v')),
					undefined,
					'Must read correct value.',
				);

				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('\f')),
					undefined,
					'Must read correct value.',
				);

				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('\n')),
					undefined,
					'Must read correct value.',
				);

				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('\r\n')),
					undefined,
					'Must read correct value.',
				);
			});

			test('true', () => {
				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('true')),
					true,
					'Must read correct value.',
				);

				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('TRUE')),
					true,
					'Must read correct value.',
				);

				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('TrUe')),
					true,
					'Must read correct value.',
				);
			});

			test('false', () => {
				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('false')),
					false,
					'Must read correct value.',
				);

				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('FALSE')),
					false,
					'Must read correct value.',
				);

				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('fAlSe')),
					false,
					'Must read correct value.',
				);
			});

			test('non-empty', () => {
				assert.strictEqual(
					PromptFilesConfig.getValue(createMock('/absolute/path/to/folder')),
					'/absolute/path/to/folder',
					'Must read correct value.',
				);
			});
		});
	});
});
