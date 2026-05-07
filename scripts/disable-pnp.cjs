const modulePackage = require('module')
const path = require('path')

const Module = modulePackage.Module

if (Module && typeof Module.findPnpApi === 'function') {
  Module.findPnpApi = () => null
}

if (Module && typeof Module._load === 'function') {
  const originalLoad = Module._load
  Module._load = function patchedLoad(request, parent, isMain) {
    if (typeof request === 'string' && request.endsWith(`${path.sep}.pnp.cjs`)) {
      return {}
    }
    return originalLoad.call(this, request, parent, isMain)
  }
}
