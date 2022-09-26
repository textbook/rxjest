#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "usage: ./bin/e2e.sh <version> [--build]"
  echo "This will E2E test the specified version (or 'local')"
  exit 1
fi

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$HERE/.."
TEST_DIR="$ROOT_DIR/e2e"

rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"

RXJEST_VERSION="${1}"
JEST_VERSION="${JEST_VERSION:-29}"
RXJS_VERSION="${RXJS_VERSION:-7}"

if [[ "$*" =~ '--build' ]]; then
	pushd "$ROOT_DIR"
		npm run build
		npm pack
		mv "rxjest-$(jq -r '.version' "$ROOT_DIR/package.json").tgz" package.tgz
	popd
fi

pushd "$TEST_DIR"
	npm init -y
	npm install "rxjs@$RXJS_VERSION"
	npm install --save-dev {@types/,ts-,}"jest@$JEST_VERSION" typescript
	npx tsc --init

	npm pkg set scripts.test='jest --preset ts-jest'

	if [ "$RXJEST_VERSION" = 'local' ]; then
		npm install --save-dev "$ROOT_DIR/package.tgz"
	else
		npm install --save-dev "rxjest@$RXJEST_VERSION"
	fi

	cat <<-EOF > demo.test.ts
	import "rxjest";
	import { from } from "rxjs";

	it("asserts that a matching value was emitted", async () => {
	  await expect(from(["foo", "bar", "baz"])).toEmit("bar");
	  await expect(from(["foo", "bar", "baz"])).not.toEmit("qux");
	});
	EOF

	npm test
popd
