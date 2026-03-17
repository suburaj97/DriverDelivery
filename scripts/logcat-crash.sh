#!/usr/bin/env bash
set -euo pipefail

PKG="${1:-com.driverdeliveryapp}"

echo "Package: ${PKG}"
echo
echo "=== adb logcat -b crash (last crashes) ==="
adb logcat -b crash -v time -d || true
echo

PID="$(adb shell pidof -s "${PKG}" 2>/dev/null | tr -d '\r' || true)"
if [[ -n "${PID}" ]]; then
  echo "=== adb logcat (current process pid=${PID}) ==="
  adb logcat -v time --pid="${PID}" | rg -n "FATAL EXCEPTION|AndroidRuntime|ReactNativeJS|Fatal signal|SIGSEGV|tombstoned|${PKG}"
else
  echo "=== adb logcat (no running pid; filtered) ==="
  adb logcat -v time | rg -n "FATAL EXCEPTION|AndroidRuntime|ReactNativeJS|Fatal signal|SIGSEGV|tombstoned|${PKG}"
fi

