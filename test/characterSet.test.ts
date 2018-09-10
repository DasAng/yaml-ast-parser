import { assert } from "chai";
import * as YAML from '../src/';
import * as util from './testUtil';

suite('YAML Syntax', () => {
	test('Forbid non-printable characters', function () {
		testErrors('\x01', [{
			line: 1,
			column: 0,
			message:'the stream contains non-printable characters',
			isWarning: false
		}]);

		testErrors('\x7f', [{
			line: 1,
			column: 0,
			message:'the stream contains non-printable characters',
			isWarning: false
		}]);

		testErrors('\x9f', [{
			line: 1,
			column: 0,
			message:'the stream contains non-printable characters',
			isWarning: false
		}]);
	});

	test('Forbid lone surrogates', function () {
		testErrors('\udc00\ud800', [{
			line: 1,
			column: 0,
			message:'the stream contains non-printable characters',
			isWarning: false
		}]);
	});

	test('Allow non-printable characters inside quoted scalars', function () {
		const key = '"\x7f\x9f\udc00\ud800"';
		const document = YAML.safeLoad(key);

		assert.deepEqual(document.value, '\x7f\x9f\udc00\ud800');
	});

	test('Forbid control sequences inside quoted scalars', function () {
		testErrors('"\x03"', [{
			line: 0,
			column: 2,
			message:'expected valid JSON character',
			isWarning: false
		}]);
	});

});

function testErrors(input: string, expectedErrors: util.TestError[]) {
	util.testErrors(input, expectedErrors);
}