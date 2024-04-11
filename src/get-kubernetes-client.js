import * as k8s from '@kubernetes/client-node'

const _clients = {}

export function getKubeConfig (namespace = undefined) {
  const kc = new k8s.KubeConfig()
  const cluster = {
    name: process.env.K8S_CLUSTER_NAME,
    server: process.env.K8S_CLUSTER_SERVER,
    skipTLSVerify: !!process.env.K8S_CLUSTER_SKIP_TLS || false
  }
  const user = {
    name: process.env.K8S_USER_NAME,
    token: process.env.K8S_USER_TOKEN
  }
  const context = {
    name: 'default',
    user: user.name,
    cluster: cluster.name,
    namespace: namespace || process.env.K8S_NAMESPACE
  }
  kc.loadFromOptions({
    clusters: [cluster],
    users: [user],
    contexts: [context],
    currentContext: context.name
  })
  return kc
}

export function getKubernetesClient (namespace = process.env.K8S_NAMESPACE, api = k8s.CoreV1Api) {
  if (_clients[namespace]) {
    if (_clients[namespace][api.name]) {
      return _clients[namespace][api.name]
    }
  }
  if (!_clients[namespace]) _clients[namespace] = {}
  if (!_clients[namespace][api.name]) _clients[namespace][api.name] = {}
  const kc = getKubeConfig(namespace)
  _clients[namespace][api.name] = kc.makeApiClient(api)

  return _clients[namespace][api.name]
}
